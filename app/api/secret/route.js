import { NextResponse } from "next/server";
import { readSecrets, writeSecret } from "@/lib/config";

export const dynamic = "force-dynamic";

/** Report which secret names are set — never the values. */
export async function GET() {
  const secrets = await readSecrets();
  const present = Object.fromEntries(
    Object.keys(secrets).map((k) => [k, Boolean(secrets[k])])
  );
  return NextResponse.json({ present });
}

export async function POST(request) {
  const { name, value } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Missing secret name." }, { status: 400 });
  }
  const names = await writeSecret(name, value || "");
  return NextResponse.json({ ok: true, names });
}
