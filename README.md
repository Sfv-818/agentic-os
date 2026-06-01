# 🚀 Agentic OS — Personal AI Mission Control

A beautiful, local-first dashboard for managing Claude and your AI agents from one place.
Chat with agents, track goals, journal, and search every conversation — all saved as
markdown to your vault. Nothing leaves your machine.

Built with **Next.js · Tailwind · Framer Motion**.

## ✨ Features
- 🛰️ **Mission Control** — live status of every agent (LIVE / BUSY / OFFLINE), heartbeat, latency
- 💬 **Real agent chat** — Claude is wired to your local `claude` CLI; conversations stream back into the dashboard
- 🤖 **Multi-agent** — Claude, OpenClaw, Hermes (and any CLI agent you add) as configurable cards
- 🎤 **Voice input** — browser-native speech recognition in every chat, Goals, and Journal (no API keys)
- 🎯 **Goals** — progress bars + checkbox markdown saved to your vault
- 📓 **Journal** — one markdown file per day
- 🧠 **Memory** — every chat auto-logged and full-text searchable
- ⚙️ **Config-driven** — portable via `agentic-os.config.json` and a Settings page

## 🟢 Requirements
- [Node.js](https://nodejs.org) 22.16+ (24 recommended)
- The [`claude` CLI](https://claude.ai/code) on your PATH (for the Claude agent)
- Optional: an [Obsidian](https://obsidian.md) vault for your notes
- Optional: Chrome or Safari for voice input

## ⚡ Setup
```bash
npm install
npm run dev
```
Then open **http://localhost:3000**.

## 🔧 Configure
Open **Settings** in the app (or edit `agentic-os.config.json`):
- **Operator name** — how the dashboard greets you
- **Vault path** — set this to your Obsidian vault folder; notes are written into the
  `Agentic OS` subfolder there. Defaults to `./vault` inside the project.
- **Agents** — name, CLI command, accent color, enabled. Each agent's prompt is piped
  to its CLI over stdin (e.g. `claude -p`).

## 📁 How it works
- **Chat** spawns the agent's CLI per message, feeding the conversation over stdin, and
  appends the exchange to `Agentic OS/Memory/YYYY-MM-DD-<agent>.md`.
- **Goals** are stored as `Agentic OS/Goals/goals.json` and rendered to `Goals.md`.
- **Journal** writes `Agentic OS/Journal/YYYY-MM-DD.md`.
- Everything is local. The `vault/` folder is gitignored — your notes stay yours.

## 🔒 Privacy
Local-first by design. Your config, vault, and chats live on your machine. The only
outbound calls are the ones the agent CLIs themselves make (e.g. Claude talking to
Anthropic, using your existing CLI auth).

---
Build your own and make it yours. You're the Mission Operator now. 💛
