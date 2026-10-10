'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PRICING_PLANS } from '@/lib/mockData';
import { PricingPlan } from '@/types';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { StripeCheckoutModal } from './StripeCheckoutModal';

export function SubscriptionPlans() {
  const { activeWorkspace } = useApp();
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PricingPlan | null>(null);

  return (
    <div className="space-y-6">
      {/* Interval Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Forfaits & Abonnements Disponibles</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Passez à la vitesse supérieure ou ajustez vos capacités à tout moment sans engagement.
          </p>
        </div>

        <div className="flex items-center gap-3 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setInterval('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${interval === 'monthly'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            Facturation Mensuelle
          </button>
          <button
            onClick={() => setInterval('yearly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${interval === 'yearly'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            <span>Annuelle</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICING_PLANS.map((plan) => {
          const isCurrent = activeWorkspace.plan === plan.id;
          const displayPrice = interval === 'monthly' ? plan.priceMonthly : plan.priceYearly;

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 relative flex flex-col justify-between ${plan.popular
                  ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900/90 border-indigo-500/50 shadow-2xl shadow-indigo-950/50 ring-1 ring-indigo-500/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Recommandé par 85% des équipes
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Actif sur ce Workspace
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 min-h-[36px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="my-5 pb-5 border-b border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{displayPrice} FCFA</span>
                    <span className="text-xs text-slate-400 font-medium">/ mois</span>
                  </div>
                  {interval === 'yearly' && (
                    <div className="text-[11px] text-emerald-400 font-medium mt-1">
                      Facturé {displayPrice * 12} FCFA / an (2 mois offerts)
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div>
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider cursor-default border border-slate-700/60"
                  >
                    Votre Forfait Actuel
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedPlanForCheckout(plan)}
                    className={`w-full py-3 rounded-xl font-bold text-xs tracking-wide shadow-lg flex items-center justify-center gap-1.5 transition-all ${plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                  >
                    <span>Choisir {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stripe Checkout Modal */}
      <StripeCheckoutModal
        isOpen={selectedPlanForCheckout !== null}
        onClose={() => setSelectedPlanForCheckout(null)}
        targetPlan={selectedPlanForCheckout}
        interval={interval}
      />
    </div>
  );
}
