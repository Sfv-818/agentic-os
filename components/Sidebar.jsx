"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Target,
  NotebookPen,
  BrainCircuit,
  Settings,
  BookOpen,
  Radio,
} from "lucide-react";
import { accent } from "@/lib/accents";

const SELF_LINKS = [
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/journal", label: "Journal", icon: NotebookPen },
  { href: "/memory", label: "Memory", icon: BrainCircuit },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((c) => setAgents(c.agents || []))
      .catch(() => {});
  }, []);

  const NavItem = ({ href, label, icon: Icon, dot }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
          active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        {active && (
          <motion.span
            layoutId="nav-active"
            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-glow-cyan shadow-glow-cyan shadow-glow"
          />
        )}
        <Icon size={18} className={active ? "text-glow-cyan" : ""} />
        <span className="font-medium">{label}</span>
        {dot && (
          <span
            className="ml-auto h-2 w-2 rounded-full"
            style={{ background: dot, boxShadow: `0 0 8px ${dot}` }}
          />
        )}
      </Link>
    );
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-ink-900/60 px-4 py-6 backdrop-blur-xl md:flex">
      <Link href="/" className="mb-8 flex items-center gap-3 px-2">
        <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 shadow-glow shadow-glow-cyan">
          <Radio size={20} className="text-ink-950" />
          <span className="absolute inset-0 animate-pulse-ring rounded-xl ring-2 ring-glow-cyan/50" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-base font-bold tracking-tight text-white">
            Agentic OS
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Mission Control
          </div>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        <NavItem href="/" label="Mission Control" icon={LayoutDashboard} />

        <div className="mt-5 mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          Agents
        </div>
        {agents.map((a) => {
          const ac = accent(a.accent);
          return (
            <NavItem
              key={a.id}
              href={`/agents/${a.id}`}
              label={a.name}
              icon={Bot}
              dot={a.enabled ? ac.hex : "#475569"}
            />
          );
        })}

        <div className="mt-5 mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          Self
        </div>
        {SELF_LINKS.map((l) => (
          <NavItem key={l.href} {...l} />
        ))}

        <div className="mt-5 mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          System
        </div>
        <NavItem href="/guide" label="Guide" icon={BookOpen} />
        <NavItem href="/settings" label="Settings" icon={Settings} />
      </nav>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-[11px] text-slate-500">
        <span className="text-glow-emerald">●</span> Local-first. Nothing leaves your machine.
      </div>
    </aside>
  );
}
