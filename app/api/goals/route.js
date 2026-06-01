import { NextResponse } from "next/server";
import { readConfig } from "@/lib/config";
import { readVaultFile, writeVaultFile } from "@/lib/vault";

export const dynamic = "force-dynamic";

async function loadGoals(config) {
  const raw = await readVaultFile(config, ["Goals", "goals.json"]);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function renderMarkdown(goals) {
  const byCat = {};
  for (const g of goals) {
    const c = g.category || "General";
    (byCat[c] ||= []).push(g);
  }
  let md = `# Goals\n\n> Tracked in Agentic OS · Mission Control\n\n`;
  for (const [cat, items] of Object.entries(byCat)) {
    md += `## ${cat}\n\n`;
    for (const g of items) {
      const box = g.done ? "x" : " ";
      const pct = typeof g.progress === "number" ? ` \`${g.progress}%\`` : "";
      md += `- [${box}] ${g.title}${pct}\n`;
    }
    md += `\n`;
  }
  return md;
}

export async function GET() {
  const config = await readConfig();
  return NextResponse.json({ goals: await loadGoals(config) });
}

export async function PUT(request) {
  const config = await readConfig();
  const { goals } = await request.json();
  const clean = Array.isArray(goals) ? goals : [];
  await writeVaultFile(config, ["Goals", "goals.json"], JSON.stringify(clean, null, 2));
  await writeVaultFile(config, ["Goals", "Goals.md"], renderMarkdown(clean));
  return NextResponse.json({ goals: clean });
}
