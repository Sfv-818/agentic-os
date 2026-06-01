"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot } from "lucide-react";
import { accent, STATUS } from "@/lib/accents";

export default function AgentCard({ agent, status = "offline", latency, index = 0 }) {
  const ac = accent(agent.accent);
  const s = STATUS[status] || STATUS.offline;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border bg-ink-800/50 p-5 backdrop-blur-xl ${ac.border}`}
    >
      {/* glow wash */}
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${ac.grad} opacity-20 blur-3xl transition-opacity group-hover:opacity-40`}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${ac.grad} shadow-glow`}
            style={{ "--tw-shadow-color": ac.hex }}
          >
            <Bot size={22} className="text-ink-950" />
          </div>
          <div>
            <div className="font-display text-lg font-bold text-white">{agent.name}</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {agent.layer} Layer
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-2.5 py-1">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: s.dot, boxShadow: `0 0 8px ${s.dot}` }}
          />
          <span className={`text-[10px] font-bold uppercase tracking-wide ${s.text}`}>
            {s.label}
          </span>
        </div>
      </div>

      <p className="relative mt-4 min-h-[40px] text-sm leading-relaxed text-slate-400">
        {agent.tagline}
      </p>

      <div className="relative mt-4 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          {agent.mode === "api"
            ? status === "live"
              ? `API · ${agent.model?.split("/").pop() || "ready"}`
              : agent.enabled
                ? "API key needed — add it in Settings"
                : "Not connected"
            : status === "live"
              ? `${latency != null ? latency + "ms" : "ready"} · ${agent.command}`
              : agent.enabled
                ? `CLI "${agent.command}" not found`
                : "Not connected"}
        </span>
        <Link
          href={`/agents/${agent.id}`}
          className={`btn border ${ac.border} ${ac.soft} ${ac.text} hover:brightness-125`}
        >
          Open Control Room
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </motion.div>
  );
}
