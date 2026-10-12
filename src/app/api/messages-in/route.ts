import { addMessage, getMessages } from '@/lib/messagestore';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ messages: getMessages() });
}

export async function POST(req: Request) {
    const body = await req.json();
    addMessage(body);
    return NextResponse.json({ ok: true });
}