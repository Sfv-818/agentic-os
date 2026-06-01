"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

const SECTIONS = [
  {
    emoji: "🖥️",
    title: "Mission Control",
    body: "The home screen shows the status of every agent, memory, and signal. Green dot = LIVE, amber = BUSY, grey = OFFLINE. Glance once and you know your whole operation is healthy.",
  },
  {
    emoji: "🧠",
    title: "The Agents",
    body: "Each agent has its own Control Room. Claude is wired to your local `claude` CLI — a real, live line, not a browser tab. OpenClaw and Hermes appear as cards you can switch on in Settings once their CLIs are installed.",
  },
  {
    emoji: "🎤",
    title: "Voice everywhere",
    body: "Tap the mic in any chat, in Goals, or in the Journal. It uses your browser's built-in speech recognition — no API keys, nothing sent to a server. Works best in Chrome or Safari.",
  },
  {
    emoji: "🌱",
    title: "The Self layer",
    body: "Goals, Journal, and Memory are grounded in your vault. Goals fill a progress bar. Journal writes one markdown file per day. Memory auto-logs every conversation and makes it searchable forever.",
  },
  {
    emoji: "🧠",
    title: "Memory that compounds",
    body: "Every chat is saved to `Agentic OS/Memory` as dated markdown. Open the Memory page to search across everything you've ever discussed. Your AI never starts from scratch.",
  },
  {
    emoji: "⚙️",
    title: "Make it yours",
    body: "Everything lives in `agentic-os.config.json` and the Settings page — your name, vault path, agent commands, and accent colors. Point the vault at your Obsidian folder and your notes show up inside Obsidian too.",
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8 md:px-10">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-glow-cyan">
          <BookOpen size={20} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">The Guide</h1>
          <p className="text-sm text-slate-400">How your Agentic OS works.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 overflow-hidden rounded-2xl border border-glow-cyan/20 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-6"
      >
        <div className="flex items-center gap-2 text-glow-cyan">
          <Sparkles size={18} />
          <span className="font-display font-bold">You're the Mission Operator</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          You don't do the tasks anymore — you run the system that does them. Set direction in Goals,
          think out loud in the Journal, brief your agents in their Control Rooms, and let memory compound
          every single day.
        </p>
      </motion.div>

      <div className="mt-6 space-y-4">
        {SECTIONS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/10 bg-ink-800/40 p-5 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{s.emoji}</span>
              <h2 className="font-display text-lg font-bold text-white">{s.title}</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-ink-800/40 p-5 text-sm text-slate-400">
        <span className="font-semibold text-white">Daily rhythm:</span> Morning — check Mission Control,
        read your goals, write a line in the journal, brief your agents. Evening — review what they
        produced, log one win, queue tomorrow.
      </div>

      <p className="mt-6 text-center text-xs text-slate-600">
        This guide is also saved to <code>Agentic OS/Guide.md</code> in your vault.
      </p>
    </div>
  );
}
