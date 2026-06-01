import { NextResponse } from "next/server";
import { readConfig } from "@/lib/config";
import { readVaultFile, writeVaultFile, listVaultDir, today } from "@/lib/vault";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const config = await readConfig();
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (date) {
    const content = await readVaultFile(config, ["Journal", `${date}.md`]);
    return NextResponse.json({ date, content: content || "" });
  }

  // List all journal entries (most recent first).
  const files = await listVaultDir(config, ["Journal"]);
  const dates = files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort()
    .reverse();
  return NextResponse.json({ dates });
}

export async function PUT(request) {
  const config = await readConfig();
  const body = await request.json();
  const date = body.date || today();
  const content = body.content || "";
  const md = content.startsWith("#") ? content : `# Journal — ${date}\n\n${content}`;
  await writeVaultFile(config, ["Journal", `${date}.md`], md);
  return NextResponse.json({ date, content });
}
