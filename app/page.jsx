"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, NotebookPen, BrainCircuit } from "lucide-react";
import StatusBar from "@/components/StatusBar";
import AgentCard from "@/components/AgentCard";
import SelfCard from "@/components/SelfCard";

export default function MissionControl() {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(null);
  const [stats, setStats] = useState({ goals: null, journal: null, memory: null });

  useEffect(() => {
    fetch("/api/config").then((r) => r.json()).then(setConfig).catch(() => {});
    const loadStatus = () =>
      fetch("/api/status").then((r) => r.json()).then(setStatus).catch(() => {});
    loadStatus();
    const t = setInterval(loadStatus, 8000);

    Promise.all([
      fetch("/api/goals").then((r) => r.json()).catch(() => ({ goals: [] })),
      fetch("/api/journal").then((r) => r.json()).catch(() => ({ dates: [] })),
      fetch("/api/memory").then((r) => r.json()).catch(() => ({ totalFiles: 0 })),
    ]).then(([g, j, m]) => {
      const done = (g.goals || []).filter((x) => x.done).length;
      const total = (g.goals || []).length;
      setStats({
        goals: total ? `${done}/${total}` : "0",
        journal: (j.dates || []).length,
        memory: m.totalFiles || 0,
      });
    });

    return () => clearInterval(t);
  }, []);

  const agents = config?.agents || [];
  const statusFor = (id) => status?.agents?.find((a) => a.id === id) || {};
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-glow-cyan">
            {greeting}, {config?.operator?.name || "Operator"}
          </div>
          <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-white">
            Mission Control
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Status of every agent, every memory, every signal.
          </p>
        </motion.div>
        <StatusBar agents={agents} />
      </div>

      {/* Agents */}
      <div className="mt-10 flex items-center gap-3">
        <h2 className="font-display text-lg font-bold text-white">Agents</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
      </div>
      <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((a, i) => {
          const s = statusFor(a.id);
          return (
            <AgentCard
              key={a.id}
              agent={a}
              status={s.status || (a.enabled ? "degraded" : "offline")}
              latency={s.latency}
              index={i}
            />
          );
        })}
      </div>

      {/* Self */}
      <div className="mt-12 flex items-center gap-3">
        <h2 className="font-display text-lg font-bold text-white">Self</h2>
        <span className="text-xs text-slate-500">Grounded in your vault</span>
        <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
      </div>
      <div className="mt-4 grid gap-5 md:grid-cols-3">
        <SelfCard
          href="/goals"
          title="Goals"
          subtitle="Set targets and watch the bar fill."
          stat={stats.goals != null ? `${stats.goals} done` : "—"}
          icon={Target}
          accent="emerald"
          index={0}
        />
        <SelfCard
          href="/journal"
          title="Journal"
          subtitle="One file per day. Voice or text."
          stat={stats.journal != null ? `${stats.journal} entries` : "—"}
          icon={NotebookPen}
          accent="amber"
          index={1}
        />
        <SelfCard
          href="/memory"
          title="Memory"
          subtitle="Every chat, auto-logged & searchable."
          stat={stats.memory != null ? `${stats.memory} logs` : "—"}
          icon={BrainCircuit}
          accent="violet"
          index={2}
        />
      </div>

      <div className="mt-12 text-center text-xs text-slate-600">
        Agentic OS · local-first · nothing leaves your machine
      </div>
    </div>
  );
}
