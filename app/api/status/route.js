import { NextResponse } from "next/server";
import { readConfig } from "@/lib/config";
import { probeCommand } from "@/lib/agents";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await readConfig();
  const agents = config.agents || [];

  const results = await Promise.all(
    agents.map(async (a) => {
      if (!a.enabled) {
        return { id: a.id, status: "offline", latency: null, found: false };
      }
      const probe = await probeCommand(a.command);
      return {
        id: a.id,
        status: probe.found ? "live" : "degraded",
        latency: probe.found ? probe.ms : null,
        found: probe.found,
      };
    })
  );

  const heartbeat = results.some((r) => r.status === "live") ? "live" : "degraded";
  const latencies = results.map((r) => r.latency).filter((n) => typeof n === "number");
  const avgLatency = latencies.length
    ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
    : null;

  return NextResponse.json({
    agents: results,
    heartbeat,
    latency: avgLatency,
    checkedAt: new Date().toISOString(),
  });
}
