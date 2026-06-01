"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Search, FileText, X } from "lucide-react";

export default function MemoryPage() {
  const [q, setQ] = useState("");
  const [data, setData] = useState({ entries: [], totalFiles: 0 });
  const [open, setOpen] = useState(null);

  const load = (query = "") =>
    fetch(`/api/memory?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then(setData);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  const openFile = (file) =>
    fetch(`/api/memory?file=${encodeURIComponent(file)}`)
      .then((r) => r.json())
      .then((d) => setOpen({ file, content: d.content }));

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 md:px-10">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-glow-violet/15 text-glow-violet">
          <BrainCircuit size={20} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Memory</h1>
          <p className="text-sm text-slate-400">
            {data.totalFiles} conversation log{data.totalFiles === 1 ? "" : "s"} · auto-saved to your vault.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-800/40 px-4 py-3 backdrop-blur-xl">
        <Search size={18} className="text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search across every conversation…"
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
        {q && (
          <button onClick={() => setQ("")} className="text-slate-500 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results */}
      <div className="mt-6 space-y-2">
        {data.entries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
            {q ? "No matches found." : "No conversations logged yet. Chat with an agent to build memory."}
          </div>
        )}
        {data.entries.map((e, i) => (
          <motion.button
            key={e.file}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => openFile(e.file)}
            className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-ink-800/40 px-4 py-3 text-left backdrop-blur-xl transition-colors hover:bg-white/5"
          >
            <FileText size={16} className="shrink-0 text-glow-violet" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-200">{e.file.replace(/\.md$/, "")}</div>
              {e.snippet ? (
                <div className="truncate text-xs text-slate-500">…{e.snippet}…</div>
              ) : (
                <div className="text-xs text-slate-500">{e.exchanges} exchange{e.exchanges === 1 ? "" : "s"}</div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Viewer */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-ink-850 p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="font-display font-bold text-white">{open.file.replace(/\.md$/, "")}</div>
              <button onClick={() => setOpen(null)} className="text-slate-500 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <pre className="flex-1 overflow-auto whitespace-pre-wrap rounded-xl bg-black/30 p-4 text-xs leading-relaxed text-slate-300">
              {open.content}
            </pre>
          </motion.div>
        </div>
      )}
    </div>
  );
}
