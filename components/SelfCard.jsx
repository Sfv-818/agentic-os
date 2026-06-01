"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { accent } from "@/lib/accents";

export default function SelfCard({ href, title, subtitle, stat, icon: Icon, accent: ac, index = 0 }) {
  const a = accent(ac);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08 }}
      whileHover={{ y: -3 }}
    >
      <Link
        href={href}
        className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-ink-800/40 p-5 backdrop-blur-xl ${a.border}`}
      >
        <div
          className={`pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-gradient-to-br ${a.grad} opacity-15 blur-2xl transition-opacity group-hover:opacity-30`}
        />
        <div className="flex items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-xl ${a.soft} ${a.text}`}>
            <Icon size={18} />
          </div>
          <div className="font-display text-base font-bold text-white">{title}</div>
        </div>
        <p className="mt-3 text-sm text-slate-400">{subtitle}</p>
        {stat && <div className={`mt-3 text-2xl font-bold ${a.text}`}>{stat}</div>}
      </Link>
    </motion.div>
  );
}
