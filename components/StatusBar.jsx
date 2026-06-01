"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { STATUS } from "@/lib/accents";

function Pill({ label, status, value }) {
  const s = STATUS[status] || STATUS.offline;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        {status === "live" && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ background: s.dot }}
          />
        )}
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ background: s.dot, boxShadow: `0 0 8px ${s.dot}` }}
        />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
        {label}
      </span>
      <span className={`text-[10px] font-bold uppercase tracking-wide ${s.text}`}>
        {value || s.label}
      </span>
    </div>
  );
}

export default function StatusBar({ agents = [] }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/status")
        .then((r) => r.json())
        .then((d) => alive && setData(d))
        .catch(() => {});
    load();
    const t = setInterval(load, 8000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const statusFor = (id) => data?.agents?.find((a) => a.id === id)?.status || "offline";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2"
    >
      {agents.map((a) => (
        <Pill key={a.id} label={a.name} status={statusFor(a.id)} />
      ))}
      <Pill label="Heartbeat" status={data?.heartbeat || "offline"} />
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5">
        <Activity size={12} className="text-glow-cyan" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
          Latency
        </span>
        <span className="text-[10px] font-bold text-glow-cyan">
          {data?.latency != null ? `${data.latency}ms` : "—"}
        </span>
      </div>
    </motion.div>
  );
}
