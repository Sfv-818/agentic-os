"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { NotebookPen, Save, Check } from "lucide-react";
import VoiceButton from "@/components/VoiceButton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

function todayStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function JournalPage() {
  const [date, setDate] = useState(todayStr());
  const [content, setContent] = useState("");
  const [dates, setDates] = useState([]);
  const [saved, setSaved] = useState(false);
  const baseRef = useRef("");

  const { listening, supported, toggle } = useSpeechRecognition({
    onResult: ({ finalText }) => {
      if (finalText) {
        baseRef.current = (baseRef.current + " " + finalText).trim();
        setContent(baseRef.current);
      }
    },
  });

  const loadList = () =>
    fetch("/api/journal").then((r) => r.json()).then((d) => setDates(d.dates || []));

  const loadEntry = (d) =>
    fetch(`/api/journal?date=${d}`)
      .then((r) => r.json())
      .then((res) => {
        const body = (res.content || "").replace(/^# Journal — .*\n+/, "");
        setContent(body);
        baseRef.current = body;
      });

  useEffect(() => {
    loadList();
    loadEntry(todayStr());
  }, []);

  const selectDate = (d) => {
    setDate(d);
    loadEntry(d);
  };

  const save = async () => {
    await fetch("/api/journal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, content }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    loadList();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-glow-amber/15 text-glow-amber">
          <NotebookPen size={20} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Journal</h1>
          <p className="text-sm text-slate-400">One file per day, saved to your vault.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_220px]">
        {/* Editor */}
        <div className="rounded-2xl border border-white/10 bg-ink-800/40 p-5 backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => selectDate(e.target.value)}
              className="rounded-xl border border-white/10 bg-ink-800 px-3 py-2 text-sm text-slate-200 focus:outline-none"
            />
            <VoiceButton listening={listening} supported={supported} onToggle={toggle} size="sm" />
            <button
              onClick={save}
              className="btn ml-auto bg-glow-amber/15 text-glow-amber hover:brightness-125"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              baseRef.current = e.target.value;
            }}
            placeholder={
              listening ? "Listening…" : "What's the most important thing today? What's on your mind? One thing you're grateful for?"
            }
            className="h-[55vh] w-full resize-none rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-white/20 focus:outline-none"
          />
        </div>

        {/* Past entries */}
        <div className="rounded-2xl border border-white/10 bg-ink-800/40 p-4 backdrop-blur-xl">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Past entries
          </div>
          <div className="space-y-1">
            {dates.length === 0 && <div className="text-xs text-slate-500">No entries yet.</div>}
            {dates.map((d) => (
              <button
                key={d}
                onClick={() => selectDate(d)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  d === date ? "bg-glow-amber/15 text-glow-amber" : "text-slate-400 hover:bg-white/5"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
