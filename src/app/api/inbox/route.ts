import { NextRequest, NextResponse } from "next/server";
let messages: any[] = [];
export async function POST(req: NextRequest) {
    const data = await req.json();
    const m = { id: Date.now().toString(), from: data.from || "Make", text: data.message || data.text || JSON.stringify(data), timestamp: new Date().toISOString(), ...data };
    messages.unshift(m);
    return NextResponse.json({ ok: true });
}
export async function GET() { return NextResponse.json(messages); }