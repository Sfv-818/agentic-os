"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Check, Bot } from "lucide-react";

const ACCENT_OPTIONS = ["cyan", "violet", "magenta", "emerald", "amber", "blue", "rose"];

export default function SettingsPage() {
  const [config, setConfig] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/config").then((r) => r.json()).then(setConfig);
  }, []);

  if (!config) {
    return <div className="px-10 py-10 text-slate-500">Loading…</div>;
  }

  const setOperator = (patch) =>
    setConfig({ ...config, operator: { ...config.operator, ...patch } });
  const setVault = (patch) => setConfig({ ...config, vault: { ...config.vault, ...patch } });
  const setAgent = (id, patch) =>
    setConfig({
      ...config,
      agents: config.agents.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    });

  const save = async () => {
    await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-white/20 focus:outline-none";
  const card = "rounded-2xl border border-white/10 bg-ink-800/40 p-5 backdrop-blur-xl";

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 md:px-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-glow-cyan">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Settings</h1>
            <p className="text-sm text-slate-400">Everything is config-driven — portable to any machine.</p>
          </div>
        </div>
        <button onClick={save} className="btn bg-glow-cyan/15 text-glow-cyan hover:brightness-125">
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* Operator */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 ${card}`}>
        <h2 className="mb-3 font-display text-base font-bold text-white">Operator</h2>
        <label className="mb-1 block text-xs text-slate-400">Your name</label>
        <input
          className={field}
          value={config.operator?.name || ""}
          onChange={(e) => setOperator({ name: e.target.value })}
        />
      </motion.div>

      {/* Vault */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 ${card}`}>
        <h2 className="mb-3 font-display text-base font-bold text-white">Vault</h2>
        <label className="mb-1 block text-xs text-slate-400">
          Vault path (your Obsidian vault folder, or a local folder)
        </label>
        <input
          className={field}
          value={config.vault?.path || ""}
          onChange={(e) => setVault({ path: e.target.value })}
          placeholder="./vault"
        />
        <label className="mb-1 mt-3 block text-xs text-slate-400">Subfolder inside the vault</label>
        <input
          className={field}
          value={config.vault?.folder || ""}
          onChange={(e) => setVault({ folder: e.target.value })}
          placeholder="Agentic OS"
        />
        <p className="mt-2 text-xs text-slate-500">
          Goals, Journal and Memory are written here as markdown. Point this at your Obsidian vault to see
          them inside Obsidian.
        </p>
      </motion.div>

      {/* Agents */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 ${card}`}>
        <h2 className="mb-3 font-display text-base font-bold text-white">Agents</h2>
        <div className="space-y-4">
          {config.agents.map((a) => (
            <div key={a.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300">
                  <Bot size={16} />
                </div>
                <input
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-white focus:outline-none"
                  value={a.name}
                  onChange={(e) => setAgent(a.id, { name: e.target.value })}
                />
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={a.enabled}
                    onChange={(e) => setAgent(a.id, { enabled: e.target.checked })}
                    className="h-4 w-4 accent-cyan-400"
                  />
                  Enabled
                </label>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] text-slate-500">CLI command</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-200 focus:outline-none"
                    value={a.command}
                    onChange={(e) => setAgent(a.id, { command: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-500">Accent color</label>
                  <select
                    className="w-full rounded-lg border border-white/10 bg-ink-800 px-3 py-1.5 text-sm text-slate-200 focus:outline-none"
                    value={a.accent}
                    onChange={(e) => setAgent(a.id, { accent: e.target.value })}
                  >
                    {ACCENT_OPTIONS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          The agent&apos;s prompt is piped to its CLI over stdin (e.g. <code>claude -p</code>). Enable an agent once
          its CLI is installed and on your PATH.
        </p>
      </motion.div>
    </div>
  );
}
