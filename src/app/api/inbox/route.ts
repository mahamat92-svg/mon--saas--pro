import { NextRequest, NextResponse } from "next/server";

let messages: any[] = [];

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const newMsg = {
            id: Date.now().toString(),
            from: data.from || data.name || data.phone || "Make",
            name: data.name || data.from || "Client",
            text: data.message || data.text || data.body || JSON.stringify(data),
            timestamp: new Date().toISOString(),
            ...data
        };

        messages.unshift(newMsg);
        if (messages.length > 100) messages.pop();

        return NextResponse.json({ ok: true, total: messages.length });
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }
}

export async function GET() {
    return NextResponse.json(messages);
}