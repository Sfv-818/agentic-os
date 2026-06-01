"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { accent } from "@/lib/accents";
import VoiceButton from "@/components/VoiceButton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function ChatRoom({ agent }) {
  const ac = accent(agent.accent);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const baseInput = useRef("");
  const scrollRef = useRef(null);

  const { listening, supported, toggle, stop } = useSpeechRecognition({
    onResult: ({ finalText, interim }) => {
      setInput((baseInput.current + " " + finalText + " " + interim).trim());
      if (finalText) baseInput.current = (baseInput.current + " " + finalText).trim();
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    if (listening) stop();

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    baseInput.current = "";
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, message: text, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e.message);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${e.message}`, isError: true },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-1 py-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div
              className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${ac.grad} shadow-glow-lg`}
              style={{ "--tw-shadow-color": ac.hex }}
            >
              <Sparkles size={28} className="text-ink-950" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-white">
              {agent.name} Control Room
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-400">{agent.tagline}</p>
            {agent.enabled ? (
              <p className="mt-4 text-xs text-slate-500">
                Type or tap the mic. Every exchange is saved to your vault.
              </p>
            ) : (
              <p className="mt-4 max-w-sm rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                {agent.name} isn&apos;t connected yet. Install its CLI and enable it in Settings.
              </p>
            )}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                  m.role === "user"
                    ? "bg-white/10 text-slate-300"
                    : `bg-gradient-to-br ${ac.grad} text-ink-950`
                }`}
              >
                {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-tr-sm bg-white/[0.07] text-slate-100"
                    : m.isError
                      ? "rounded-tl-sm border border-rose-500/30 bg-rose-500/10 text-rose-200"
                      : "rounded-tl-sm border border-white/10 bg-ink-800/70 text-slate-200"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${ac.grad} text-ink-950`}
            >
              <Bot size={16} />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-white/10 bg-ink-800/70 px-4 py-3 text-sm text-slate-400">
              <Loader2 size={15} className="animate-spin" />
              {agent.name} is thinking…
            </div>
          </motion.div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-white/10 pt-4">
        {error && <div className="mb-2 text-xs text-rose-400">{error}</div>}
        <div className="flex items-end gap-2">
          <VoiceButton listening={listening} supported={supported} onToggle={toggle} />
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                baseInput.current = e.target.value;
              }}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder={listening ? "Listening…" : `Message ${agent.name}…`}
              className="max-h-40 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-glow-cyan/30"
            />
          </div>
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            className={`btn h-11 border ${ac.border} ${ac.soft} ${ac.text} hover:brightness-125`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
