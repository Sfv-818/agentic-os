import { promises as fs } from "node:fs";
import path from "node:path";
import { vaultFolder } from "@/lib/config";

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

/** Today's date as YYYY-MM-DD (local). */
export function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Resolve a path inside the Agentic OS vault folder. */
function inVault(config, ...parts) {
  return path.join(vaultFolder(config), ...parts);
}

export async function readFileSafe(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

export async function writeVaultFile(config, relParts, content) {
  const full = inVault(config, ...relParts);
  await ensureDir(path.dirname(full));
  await fs.writeFile(full, content, "utf8");
  return full;
}

export async function appendVaultFile(config, relParts, content) {
  const full = inVault(config, ...relParts);
  await ensureDir(path.dirname(full));
  await fs.appendFile(full, content, "utf8");
  return full;
}

export async function readVaultFile(config, relParts) {
  return readFileSafe(inVault(config, ...relParts));
}

export async function listVaultDir(config, relParts) {
  const dir = inVault(config, ...relParts);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isFile()).map((e) => e.name);
  } catch {
    return [];
  }
}

export { inVault };
