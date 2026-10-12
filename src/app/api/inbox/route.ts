import { NextRequest, NextResponse } from "next/server";

let messages: any[] = [];

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newMsg = {
            id: Date.now().toString(),
            from: data.from || data.name || "WhatsApp",
            text: data.message || data.text || JSON.stringify(data),
            timestamp: new Date().toISOString(),
        };
        messages.unshift(newMsg);
        return NextResponse.json({ ok: true, msg: newMsg });
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }
}

export async function GET() {
    return NextResponse.json(messages);
}