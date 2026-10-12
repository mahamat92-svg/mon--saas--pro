"use client";
import { useEffect, useState } from "react";

type Msg = {
    id: string;
    from: string;
    text: string;
    timestamp: string;
};

export default function InboxPage() {
    const [msgs, setMsgs] = useState<Msg[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        const res = await fetch("/api/inbox");
        const data = await res.json();
        setMsgs(data);
        setLoading(false);
    };

    useEffect(() => {
        load();
        const interval = setInterval(load, 3000); // actualise auto pour Make
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold">Inbox - Mon-Saas-Pro Solutions</h1>
                <p className="text-slate-400 mt-2">
                    {msgs.length} messages reçus depuis Make / WhatsApp • Actualisation auto
                </p>

                <div className="mt-6 flex gap-2">
                    <button onClick={load} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
                        Actualiser
                    </button>
                    <span className="text-sm text-slate-500 self-center">
                        URL Make: /api/inbox
                    </span>
                </div>

                <div className="mt-8 grid gap-3">
                    {loading ? (
                        <p>Chargement...</p>
                    ) : msgs.length === 0 ? (
                        <div className="bg-[#1e293b] p-8 rounded-xl text-center text-slate-400">
                            Aucun message pour l'instant.<br />
                            Envoie un test depuis Make vers <b>/api/inbox</b>
                        </div>
                    ) : (
                        msgs.map((m) => (
                            <div key={m.id} className="bg-[#1e293b] p-4 rounded-xl border border-slate-800">
                                <div className="flex justify-between">
                                    <b className="text-blue-400">{m.from}</b>
                                    <span className="text-xs text-slate-500">{new Date(m.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="mt-2 text-slate-200 whitespace-pre-wrap">{m.text}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}