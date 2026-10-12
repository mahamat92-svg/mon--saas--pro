import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    } catch (e) {
      body = {};
    }

    const { planId = 'pro', interval = 'monthly', workspaceId = 'ws-mon-saas-pro', customerEmail = 'client@example.com' } = body;

    const priceMap: Record<string, { monthly: number; yearly: number }> = {
      starter: { monthly: 0, yearly: 0 },
      pro: { monthly: 15000, yearly: 150000 },
      enterprise: { monthly: 50000, yearly: 500000 },
    };

    const price = priceMap[planId]
      ? interval === 'yearly'
        ? priceMap[planId].yearly
        : priceMap[planId].monthly
      : 15000;

    const sessionId = 'cs_test_' + Math.random().toString(36).substring(2, 12);
    const checkoutUrl = `/checkout/success?session_id=${sessionId}&plan=${planId}&amount=${price}`;

    return NextResponse.json({
      success: true,
      sessionId,
      url: checkoutUrl,
      amount: price,
      currency: 'EUR',
      planId,
      interval,
      workspaceId,
      customerEmail,
      status: 'open',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur interne lors de la création de la session Stripe' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    gateway: 'Stripe Test Simulator',
    plans: ['starter', 'pro', 'enterprise'],
  });
}
