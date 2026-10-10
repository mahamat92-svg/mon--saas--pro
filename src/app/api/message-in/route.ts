import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        console.log("=== NOUVEAU MESSAGE POUR BOITE 651465708 ===");
        console.log(JSON.stringify(data, null, 2));

        // On retourne OK pour Make
        return NextResponse.json({
            ok: true,
            message: "Reçu dans Boite 651465708"
        });

    } catch (e) {
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        boite: "651465708",
        status: "Prête à recevoir"
    });
}