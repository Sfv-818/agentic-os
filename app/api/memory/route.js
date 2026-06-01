import { NextResponse } from "next/server";
import { readConfig } from "@/lib/config";
import { readVaultFile, listVaultDir } from "@/lib/vault";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const config = await readConfig();
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const file = searchParams.get("file");

  if (file) {
    const content = await readVaultFile(config, ["Memory", file]);
    return NextResponse.json({ file, content: content || "" });
  }

  const files = (await listVaultDir(config, ["Memory"]))
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  // Build lightweight entries; if searching, include only matching files w/ snippet.
  const entries = [];
  for (const f of files) {
    const content = (await readVaultFile(config, ["Memory", f])) || "";
    if (q) {
      const idx = content.toLowerCase().indexOf(q);
      if (idx === -1) continue;
      const start = Math.max(0, idx - 60);
      const snippet = content.slice(start, idx + 120).replace(/\s+/g, " ").trim();
      entries.push({ file: f, snippet, matched: true });
    } else {
      const exchanges = (content.match(/^## /gm) || []).length;
      entries.push({ file: f, exchanges });
    }
  }

  const totalFiles = files.length;
  return NextResponse.json({ entries, totalFiles, query: q });
}
