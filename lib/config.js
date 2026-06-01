import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "agentic-os.config.json");

const DEFAULT_CONFIG = {
  operator: { name: "Operator", title: "Mission Control" },
  vault: { path: "./vault", folder: "Agentic OS" },
  agents: [
    {
      id: "claude",
      name: "Claude",
      tagline: "Intelligence layer.",
      command: "claude",
      args: ["-p"],
      accent: "cyan",
      enabled: true,
      layer: "Intelligence",
    },
  ],
  goalCategories: ["Business", "Health", "Learning", "Personal"],
};

/** Read the config from disk, falling back to defaults. */
export async function readConfig() {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

/** Persist config back to disk. */
export async function writeConfig(config) {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", "utf8");
  return config;
}

/** Absolute path to the vault root (where notes live). */
export function vaultRoot(config) {
  const p = config?.vault?.path || "./vault";
  return path.isAbsolute(p) ? p : path.join(ROOT, p);
}

/** Absolute path to the "Agentic OS" folder inside the vault. */
export function vaultFolder(config) {
  return path.join(vaultRoot(config), config?.vault?.folder || "Agentic OS");
}

export function findAgent(config, id) {
  return (config.agents || []).find((a) => a.id === id);
}
