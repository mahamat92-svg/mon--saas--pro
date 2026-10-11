import { NextRequest, NextResponse } from 'next/server';

// Petite base de données temporaire pour InnovTech
// Plus tard on mettra une vraie base, mais pour l'instant ça marche
let MESSAGES: any[] = [];

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        console.log("=== NOUVEAU MESSAGE POUR BOITE 651465708 INNOVTECH ===");
        console.log(JSON.stringify(data, null, 2));

        const newMessage = {
            id: Date.now(),
            from: data.from || data.phone || "Client WhatsApp",
            text: data.text || data.message || JSON.stringify(data),
            channel: "WhatsApp 651465708",
            date: new Date().toLocaleString("fr-FR"),
            raw: data
        };

        MESSAGES.unshift(newMessage); // Ajoute en haut

        // Garde seulement les 100 derniers
        if (MESSAGES.length > 100) MESSAGES = MESSAGES.slice(0, 100);

        return NextResponse.json({
            ok: true,
            message: "Reçu dans Boite InnovTech 651465708",
            data: newMessage
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        boite: "651465708 - InnovTech",
        status: "Prête à recevoir",
        total: MESSAGES.length,
        messages: MESSAGES
    });
}