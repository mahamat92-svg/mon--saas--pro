"use client";
import { useEffect, useState } from "react";

export default function InboxPage() {
    const [messages, setMessages] = useState<any[]>([]);

    async function loadMessages() {
        const res = await fetch("/api/messages-in");
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
    }

    useEffect(() => {
        loadMessages();
        // Recharge toutes les 3 secondes
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 flex">
            <div className="w-full max-w-[400px] bg-white border-r p-4">
                <h2 className="font-black text-lg">Inbox InnovTech</h2>
                <p className="text-xs bg-green-100 text-green-700 inline-block px-2 py-1 rounded-full font-bold mt-1">● Boite 651465708 Connectée</p>
                <p className="text-xs text-zinc-400 mt-2">{messages.length} messages</p>

                <div className="mt-6 space-y-2">
                    {messages.length === 0 && <p className="text-sm text-zinc-400">En attente de messages WhatsApp... Envoie un message test depuis Make.</p>}
                    {messages.map((m: any) => (
                        <div key={m.id} className="p-3 border rounded-xl bg-white hover:bg-zinc-50">
                            <p className="text-xs font-bold text-green-600">{m.channel} • {m.from}</p>
                            <p className="text-xs text-zinc-400">{m.date}</p>
                            <p className="text-sm mt-1 font-medium">{m.text}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 p-10 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-black">Ça marche Bouba!</h1>
                    <p className="text-zinc-500 mt-2 max-w-md">Quand un client écrit sur ton numéro WhatsApp InnovTech 651465708, Make envoie vers /api/ et ça s'affiche ici à gauche automatiquement.</p>
                    <button onClick={loadMessages} className="mt-6 bg-black text-white px-6 py-2 rounded-full text-sm font-bold">Actualiser</button>
                </div>
            </div>
        </div>
    );
}