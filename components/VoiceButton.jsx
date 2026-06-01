"use client";

import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

/** Pulsing mic button. `listening` and `supported` come from the speech hook. */
export default function VoiceButton({ listening, supported, onToggle, size = "md" }) {
  const dims = size === "sm" ? "h-9 w-9" : "h-11 w-11";

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input isn't supported in this browser. Try Chrome or Safari."
        className={`${dims} grid place-items-center rounded-xl border border-white/10 bg-white/[0.02] text-slate-600`}
      >
        <MicOff size={18} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      title={listening ? "Stop listening" : "Speak"}
      className={`${dims} relative grid place-items-center rounded-xl border transition-colors ${
        listening
          ? "border-glow-rose/50 bg-glow-rose/15 text-glow-rose"
          : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07] hover:text-white"
      }`}
    >
      {listening && (
        <motion.span
          className="absolute inset-0 rounded-xl ring-2 ring-glow-rose/60"
          animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <Mic size={18} />
    </button>
  );
}
