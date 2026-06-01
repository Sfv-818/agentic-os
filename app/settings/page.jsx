"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Check, Bot, KeyRound } from "lucide-react";

const ACCENT_OPTIONS = ["cyan", "violet", "magenta", "emerald", "amber", "blue", "rose"];

export default function SettingsPage() {
  const [config, setConfig] = useState(null);
  const [saved, setSaved] = useState(false);
  const [secretsPresent, setSecretsPresent] = useState({});
  const [secretInputs, setSecretInputs] = useState({});
  const [savedKey, setSavedKey] = useState(null);

  useEffect(() => {
    fetch("/api/config").then((r) => r.json()).then(setConfig);
    fetch("/api/secret").then((r) => r.json()).then((d) => setSecretsPresent(d.present || {}));
  }, []);

  const saveKey = async (secretName) => {
    const value = secretInputs[secretName] || "";
    await fetch("/api/secret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: secretName, value }),
    });
    setSecretsPresent((p) => ({ ...p, [secretName]: Boolean(value) }));
    setSecretInputs((s) => ({ ...s, [secretName]: "" }));
    setSavedKey(secretName);
    setTimeout(() => setSavedKey(null), 1800);
  };

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
              {/* Mode toggle */}
              <div className="mt-3 flex gap-2 text-xs">
                {["cli", "api"].map((mode) => {
                  const current = (a.mode || "cli") === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setAgent(a.id, { mode: mode === "cli" ? "cli" : "api" })}
                      className={`rounded-lg border px-3 py-1 uppercase tracking-wide ${
                        current
                          ? "border-glow-cyan/40 bg-glow-cyan/10 text-glow-cyan"
                          : "border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {mode === "cli" ? "CLI" : "API"}
                    </button>
                  );
                })}
                <div className="ml-auto flex items-center gap-2">
                  <label className="text-[11px] text-slate-500">Accent</label>
                  <select
                    className="rounded-lg border border-white/10 bg-ink-800 px-2 py-1 text-xs text-slate-200 focus:outline-none"
                    value={a.accent}
                    onChange={(e) => setAgent(a.id, { accent: e.target.value })}
                  >
                    {ACCENT_OPTIONS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(a.mode || "cli") === "cli" ? (
                <div className="mt-3">
                  <label className="mb-1 block text-[11px] text-slate-500">CLI command (prompt piped over stdin)</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-200 focus:outline-none"
                    value={a.command || ""}
                    onChange={(e) => setAgent(a.id, { command: e.target.value })}
                    placeholder="e.g. claude"
                  />
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-500">API endpoint</label>
                      <input
                        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-200 focus:outline-none"
                        value={a.endpoint || ""}
                        onChange={(e) => setAgent(a.id, { endpoint: e.target.value })}
                        placeholder="https://openrouter.ai/api/v1/chat/completions"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-500">Model</label>
                      <input
                        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-200 focus:outline-none"
                        value={a.model || ""}
                        onChange={(e) => setAgent(a.id, { model: e.target.value })}
                        placeholder="nousresearch/hermes-3-llama-3.1-70b"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                      <KeyRound size={12} />
                      API key
                      <span className="ml-1 rounded px-1.5 text-[10px] uppercase tracking-wide"
                        style={{
                          background: secretsPresent[a.secret] ? "rgba(52,211,153,0.15)" : "rgba(148,163,184,0.1)",
                          color: secretsPresent[a.secret] ? "#34d399" : "#94a3b8",
                        }}>
                        {secretsPresent[a.secret] ? "set" : "not set"}
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        autoComplete="off"
                        className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-200 focus:outline-none"
                        value={secretInputs[a.secret] || ""}
                        onChange={(e) =>
                          setSecretInputs((s) => ({ ...s, [a.secret]: e.target.value }))
                        }
                        placeholder={secretsPresent[a.secret] ? "•••••••• (enter to replace)" : "Paste your key…"}
                      />
                      <button
                        onClick={() => saveKey(a.secret)}
                        className="btn bg-glow-magenta/15 text-glow-magenta hover:brightness-125"
                      >
                        {savedKey === a.secret ? <Check size={15} /> : <KeyRound size={15} />}
                        {savedKey === a.secret ? "Saved" : "Save key"}
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Stored locally in <code>agentic-os.secrets.json</code> (gitignored). Never committed or sent anywhere but your endpoint.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          <span className="text-slate-400">CLI mode</span> pipes the prompt to a local command over stdin (e.g. <code>claude -p</code>).{" "}
          <span className="text-slate-400">API mode</span> calls any OpenAI-compatible endpoint (OpenRouter, Together, a local LM server…).
        </p>
      </motion.div>
    </div>
  );
}
