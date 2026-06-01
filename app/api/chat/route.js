import { NextResponse } from "next/server";
import { readConfig, findAgent, secretForAgent } from "@/lib/config";
import { runAgent, runApiAgent } from "@/lib/agents";
import { appendVaultFile, today, nowStamp } from "@/lib/vault";

export const dynamic = "force-dynamic";
export const maxDuration = 140;

/** Build an OpenAI-style messages array for API-mode agents. */
function buildMessages(agentName, history, message) {
  const messages = [
    {
      role: "system",
      content: `You are ${agentName}, an AI agent inside the operator's personal Agentic OS "Mission Control" dashboard. Respond helpfully and concisely in plain text/markdown.`,
    },
  ];
  for (const m of history || []) {
    messages.push({ role: m.role === "user" ? "user" : "assistant", content: m.content });
  }
  messages.push({ role: "user", content: message });
  return messages;
}

/** Build a single prompt string from the conversation transcript. */
function buildPrompt(agentName, history, message) {
  const lines = [];
  lines.push(
    `You are ${agentName}, an AI agent inside the operator's personal Agentic OS "Mission Control" dashboard. Respond helpfully and concisely in plain text/markdown.`
  );
  if (history && history.length) {
    lines.push("\n--- Conversation so far ---");
    for (const m of history) {
      lines.push(`${m.role === "user" ? "Operator" : agentName}: ${m.content}`);
    }
    lines.push("--- End conversation ---\n");
  }
  lines.push(`Operator: ${message}`);
  lines.push(`${agentName}:`);
  return lines.join("\n");
}

export async function POST(request) {
  const config = await readConfig();
  const { agentId, message, history } = await request.json();

  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Empty message." }, { status: 400 });
  }

  const agent = findAgent(config, agentId);
  if (!agent) {
    return NextResponse.json({ error: `Unknown agent "${agentId}".` }, { status: 404 });
  }
  if (!agent.enabled) {
    return NextResponse.json(
      { error: `${agent.name} is not connected yet. Enable it in Settings.` },
      { status: 503 }
    );
  }

  let reply;
  try {
    if (agent.mode === "api") {
      const key = await secretForAgent(agent);
      if (!key) {
        return NextResponse.json(
          {
            error: `${agent.name} needs an API key. Add your ${agent.secret || "API"} key in Settings.`,
          },
          { status: 503 }
        );
      }
      const messages = buildMessages(agent.name, history || [], message);
      reply = await runApiAgent(agent, messages, key);
    } else {
      const prompt = buildPrompt(agent.name, history || [], message);
      reply = await runAgent(agent, prompt);
    }
  } catch (err) {
    return NextResponse.json(
      { error: `${agent.name} error: ${err.message}` },
      { status: 502 }
    );
  }

  // Auto-log to the vault: one markdown file per day per agent.
  try {
    const date = today();
    const stamp = nowStamp();
    const entry =
      `\n## ${stamp} — ${agent.name}\n\n` +
      `**Operator:** ${message}\n\n` +
      `**${agent.name}:** ${reply}\n`;
    const file = await appendVaultFile(config, ["Memory", `${date}-${agent.id}.md`], entry);
    // Ensure a header exists if the file was just created (best-effort).
    void file;
  } catch {
    /* logging is best-effort; never fail the chat on it */
  }

  return NextResponse.json({ reply, agent: agent.id });
}
