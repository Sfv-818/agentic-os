import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { readConfig, findAgent } from "@/lib/config";
import ChatRoom from "@/components/ChatRoom";

export const dynamic = "force-dynamic";

export default async function AgentControlRoom({ params }) {
  const { id } = await params;
  const config = await readConfig();
  const agent = findAgent(config, id);
  if (!agent) notFound();

  return (
    <div className="mx-auto flex h-screen max-w-5xl flex-col px-6 py-6 md:px-10">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} /> Mission Control
        </Link>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
          {agent.layer} Layer · {agent.command}
        </span>
      </div>

      <div className="mt-4 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/40 p-5 backdrop-blur-xl">
        <ChatRoom agent={agent} />
      </div>
    </div>
  );
}
