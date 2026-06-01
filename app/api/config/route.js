import { NextResponse } from "next/server";
import { readConfig, writeConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await readConfig();
  return NextResponse.json(config);
}

export async function PUT(request) {
  const current = await readConfig();
  const body = await request.json();
  const merged = { ...current, ...body };
  await writeConfig(merged);
  return NextResponse.json(merged);
}
