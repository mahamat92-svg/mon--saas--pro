import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const mode = req.nextUrl.searchParams.get('hub.mode')
    const token = req.nextUrl.searchParams.get('hub.verify_token')
    const challenge = req.nextUrl.searchParams.get('hub.challenge')
    if (mode === 'subscribe' && token === 'bouba123') {
        return new NextResponse(challenge, { status: 200 })
    }
    return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]

        if (message) {
            const from = message.from
            const text = message.text?.body
            console.log(`Message de ${from}: ${text}`)

            // ICI ON RÉPOND AUTOMATIQUEMENT
            const phoneNumberId = 'TON_PHONE_NUMBER_ID' // dans Meta > WhatsApp > Configuration API
            const accessToken = 'TON_ACCESS_TOKEN_PERMANENT'

            await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: from,
                    text: { body: `Salut Bouba! J'ai bien reçu: "${text}" 🤖` }
                })
            })
        }

        return NextResponse.json({ status: 'ok' })
    } catch (e) {
        console.log('Erreur', e)
        return NextResponse.json({ status: 'ok' })
    }
}