"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Trash2, Check } from "lucide-react";
import VoiceButton from "@/components/VoiceButton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState(["Business", "Health", "Learning", "Personal"]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Business");
  const [loaded, setLoaded] = useState(false);

  const { listening, supported, toggle } = useSpeechRecognition({
    onResult: ({ finalText }) => finalText && setTitle((t) => (t + " " + finalText).trim()),
  });

  useEffect(() => {
    fetch("/api/config").then((r) => r.json()).then((c) => {
      if (c.goalCategories?.length) {
        setCategories(c.goalCategories);
        setCategory(c.goalCategories[0]);
      }
    });
    fetch("/api/goals")
      .then((r) => r.json())
      .then((d) => {
        setGoals(d.goals || []);
        setLoaded(true);
      });
  }, []);

  const persist = (next) => {
    setGoals(next);
    fetch("/api/goals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goals: next }),
    });
  };

  const addGoal = () => {
    const t = title.trim();
    if (!t) return;
    persist([...goals, { id: crypto.randomUUID(), title: t, category, progress: 0, done: false }]);
    setTitle("");
  };

  const update = (id, patch) =>
    persist(goals.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  const remove = (id) => persist(goals.filter((g) => g.id !== id));

  const total = goals.length;
  const completed = goals.filter((g) => g.done).length;
  const overall = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 md:px-10">
      <Header overall={overall} completed={completed} total={total} />

      {/* Composer */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-ink-800/40 p-4 backdrop-blur-xl sm:flex-row sm:items-center">
        <VoiceButton listening={listening} supported={supported} onToggle={toggle} />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addGoal()}
          placeholder={listening ? "Listening…" : "New goal…"}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-white/20 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-slate-200 focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button onClick={addGoal} className="btn bg-glow-emerald/15 text-glow-emerald hover:brightness-125">
          <Plus size={16} /> Add
        </button>
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        <AnimatePresence>
          {goals.map((g) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl border border-white/10 bg-ink-800/40 p-4 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => update(g.id, { done: !g.done, progress: !g.done ? 100 : g.progress })}
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-colors ${
                    g.done
                      ? "border-glow-emerald bg-glow-emerald/20 text-glow-emerald"
                      : "border-white/20 text-transparent hover:border-white/40"
                  }`}
                >
                  <Check size={14} />
                </button>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-medium ${g.done ? "text-slate-500 line-through" : "text-slate-100"}`}>
                    {g.title}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">{g.category}</div>
                </div>
                <span className="text-xs font-bold text-glow-emerald">{g.progress}%</span>
                <button onClick={() => remove(g.id)} className="text-slate-500 transition-colors hover:text-rose-400">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={g.progress}
                  onChange={(e) =>
                    update(g.id, { progress: Number(e.target.value), done: Number(e.target.value) === 100 })
                  }
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-emerald-400"
                />
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                  animate={{ width: `${g.progress}%` }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loaded && goals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
            No goals yet. Add your top 3 and your agents will know what you&apos;re working towards.
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ overall, completed, total }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-glow-emerald/15 text-glow-emerald">
          <Target size={20} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Goals</h1>
          <p className="text-sm text-slate-400">Saved as markdown to your vault.</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-ink-800/40 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Overall progress</span>
          <span className="font-bold text-glow-emerald">
            {overall}% · {completed}/{total}
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-glow"
            style={{ "--tw-shadow-color": "#34d399" }}
            animate={{ width: `${overall}%` }}
          />
        </div>
      </div>
    </div>
  );
}
