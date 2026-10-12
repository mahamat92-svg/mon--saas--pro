"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function InboxPage() {
    const [messages, setMessages] = useState<any[]>([]);

    const load = async () => {
        const res = await fetch("/api/inbox");
        const data = await res.json();
        setMessages(data);
    };

    useEffect(() => {
        load();
        const i = setInterval(load, 3000);
        return () => clearInterval(i);
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-blue-400 hover:underline">← Retour Dashboard</Link>
                <h1 className="text-3xl font-bold mt-4">📥 Inbox - Mon-Saas-Pro Solutions</h1>
                <p className="text-slate-400 mt-2">{messages.length} messages • Lien Make: /api/inbox</p>

                <div className="mt-8 space-y-3">
                    {messages.length === 0 ? (
                        <div className="bg-[#1e293b] p-10 rounded-xl text-center text-slate-400">
                            Aucun message. Teste avec Make: POST {"{"} "from": "Bouba", "message": "Hello" {"}"}
                        </div>
                    ) : messages.map((m) => (
                        <div key={m.id} className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
                            <div className="flex justify-between text-sm">
                                <b className="text-blue-400">{m.from}</b>
                                <span className="text-slate-500">{new Date(m.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="mt-2">{m.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}