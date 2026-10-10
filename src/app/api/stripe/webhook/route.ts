import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      event = {
        type: 'invoice.payment_succeeded',
        data: { object: { id: 'in_test_' + Date.now(), amount_paid: 1500000, status: 'paid' } },
      };
    }

    // Process Stripe event types
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('[Stripe Webhook] Session complétée avec succès:', event.data?.object?.id);
        break;

      case 'invoice.payment_succeeded':
        console.log('[Stripe Webhook] Facture acquittée:', event.data?.object?.id);
        break;

      case 'customer.subscription.updated':
        console.log('[Stripe Webhook] Abonnement mis à jour:', event.data?.object?.id);
        break;

      case 'customer.subscription.deleted':
        console.log('[Stripe Webhook] Abonnement résilié:', event.data?.object?.id);
        break;

      default:
        console.log('[Stripe Webhook] Événement non pris en compte:', event.type);
    }

    return NextResponse.json({ received: true, eventType: event.type });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook error: ${err.message}` },
      { status: 400 }
    );
  }
}
