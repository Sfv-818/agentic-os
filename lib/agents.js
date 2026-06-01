import { spawn } from "node:child_process";

const isWin = process.platform === "win32";

/**
 * Check whether a CLI command is resolvable on this machine.
 * Returns { found: boolean, ms: number }.
 */
export function probeCommand(command) {
  const start = Date.now();
  return new Promise((resolve) => {
    const finder = isWin ? "where" : "which";
    const child = spawn(finder, [command], { shell: true });
    let found = false;
    child.stdout.on("data", (d) => {
      if (String(d).trim().length > 0) found = true;
    });
    child.on("error", () => resolve({ found: false, ms: Date.now() - start }));
    child.on("close", (code) =>
      resolve({ found: found && code === 0, ms: Date.now() - start })
    );
  });
}

/**
 * Run an agent CLI one-shot, feeding the prompt over stdin.
 * Works with `claude -p` (headless print mode) and similar agents that
 * read a prompt from stdin. Returns the trimmed stdout.
 */
export function runAgent(agent, prompt, { timeoutMs = 120000 } = {}) {
  return new Promise((resolve, reject) => {
    const args = Array.isArray(agent.args) ? agent.args : [];
    const child = spawn(agent.command, args, { shell: true });

    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("The agent took too long to respond (timeout)."));
    }, timeoutMs);

    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(new Error(`Could not start "${agent.command}": ${e.message}`));
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0 && out.trim()) {
        resolve(out.trim());
      } else if (out.trim()) {
        resolve(out.trim());
      } else {
        reject(new Error(err.trim() || `Agent exited with code ${code} and no output.`));
      }
    });

    // Feed the prompt over stdin so we never have to shell-escape it.
    try {
      child.stdin.write(prompt);
      child.stdin.end();
    } catch {
      /* stdin may already be closed on spawn error */
    }
  });
}

/**
 * Call an OpenAI-compatible chat completions endpoint (OpenRouter, Together,
 * local LM servers, etc.). `messages` is the standard role/content array.
 */
export async function runApiAgent(agent, messages, apiKey, { timeoutMs = 120000 } = {}) {
  if (!agent.endpoint) throw new Error("No API endpoint configured for this agent.");
  if (!apiKey) throw new Error("No API key set. Add one in Settings.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(agent.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        // OpenRouter likes these; harmless for other providers.
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Agentic OS",
      },
      body: JSON.stringify({ model: agent.model, messages }),
      signal: controller.signal,
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Bad response from endpoint (${res.status}): ${text.slice(0, 200)}`);
    }
    if (!res.ok) {
      const msg = data?.error?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) throw new Error("Endpoint returned no message content.");
    return reply.trim();
  } catch (e) {
    if (e.name === "AbortError") throw new Error("The API request timed out.");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
