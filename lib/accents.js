// Maps an accent name (from config) to concrete colors + tailwind utility classes.
// Kept as a plain module so both server and client components can use it.

export const ACCENTS = {
  cyan: {
    hex: "#22d3ee",
    text: "text-glow-cyan",
    ring: "ring-glow-cyan/40",
    border: "border-glow-cyan/30",
    glow: "shadow-glow-cyan",
    grad: "from-cyan-400 to-sky-500",
    soft: "bg-glow-cyan/10",
  },
  violet: {
    hex: "#a855f7",
    text: "text-glow-violet",
    ring: "ring-glow-violet/40",
    border: "border-glow-violet/30",
    glow: "shadow-glow-violet",
    grad: "from-violet-400 to-purple-600",
    soft: "bg-glow-violet/10",
  },
  magenta: {
    hex: "#ec4899",
    text: "text-glow-magenta",
    ring: "ring-glow-magenta/40",
    border: "border-glow-magenta/30",
    glow: "shadow-glow-magenta",
    grad: "from-pink-400 to-fuchsia-600",
    soft: "bg-glow-magenta/10",
  },
  emerald: {
    hex: "#34d399",
    text: "text-glow-emerald",
    ring: "ring-glow-emerald/40",
    border: "border-glow-emerald/30",
    glow: "shadow-glow-emerald",
    grad: "from-emerald-400 to-teal-500",
    soft: "bg-glow-emerald/10",
  },
  amber: {
    hex: "#fbbf24",
    text: "text-glow-amber",
    ring: "ring-glow-amber/40",
    border: "border-glow-amber/30",
    glow: "shadow-glow-amber",
    grad: "from-amber-300 to-orange-500",
    soft: "bg-glow-amber/10",
  },
  blue: {
    hex: "#60a5fa",
    text: "text-glow-blue",
    ring: "ring-glow-blue/40",
    border: "border-glow-blue/30",
    glow: "shadow-glow-blue",
    grad: "from-blue-400 to-indigo-500",
    soft: "bg-glow-blue/10",
  },
  rose: {
    hex: "#fb7185",
    text: "text-glow-rose",
    ring: "ring-glow-rose/40",
    border: "border-glow-rose/30",
    glow: "shadow-glow-rose",
    grad: "from-rose-400 to-red-500",
    soft: "bg-glow-rose/10",
  },
};

export function accent(name) {
  return ACCENTS[name] || ACCENTS.cyan;
}

export const STATUS = {
  live: { label: "LIVE", dot: "#34d399", text: "text-glow-emerald" },
  busy: { label: "BUSY", dot: "#fbbf24", text: "text-glow-amber" },
  degraded: { label: "DEGRADED", dot: "#fb923c", text: "text-orange-400" },
  offline: { label: "OFFLINE", dot: "#64748b", text: "text-slate-400" },
};
