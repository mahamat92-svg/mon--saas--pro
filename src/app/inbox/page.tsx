"use client";
import { MOCK_INBOX_651465708 } from "@/lib/mockData";

export default function InboxPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold">Boite 651465708</h1>
            <p className="text-gray-400 mb-6">+237 651465708 • En ligne 🟢 Connecté à ton SaaS</p>

            <div className="grid gap-4 max-w-4xl">
                {MOCK_INBOX_651465708.map(m => (
                    <div key={m.id} className="bg-white text-black rounded-2xl p-4 shadow-lg">
                        <div className="flex justify-between font-bold">
                            <span>{m.fromName} • {m.from}</span>
                            <span className="text-xs text-gray-500">{m.time} {m.unread && "🔵"}</span>
                        </div>
                        <p className="mt-2 text-gray-800">{m.text}</p>
                        <p className="text-xs text-gray-400 mt-1">→ Vers {m.to}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}