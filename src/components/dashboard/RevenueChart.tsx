'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TrendingUp, CreditCard, ChevronRight, Sparkles } from 'lucide-react';

interface MonthlyData {
  month: string;
  mrr: number;
  newCustomers: number;
}

const MONTHLY_REVENUE_DATA: MonthlyData[] = [
  { month: 'Mai', mrr: 1850, newCustomers: 12 },
  { month: 'Juin', mrr: 2400, newCustomers: 16 },
  { month: 'Juil', mrr: 2950, newCustomers: 19 },
  { month: 'Août', mrr: 3600, newCustomers: 24 },
  { month: 'Sept', mrr: 4200, newCustomers: 28 },
  { month: 'Oct', mrr: 4850, newCustomers: 34 },
];

export function RevenueChart() {
  const { setActiveView, activeWorkspace } = useApp();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxMrr = Math.max(...MONTHLY_REVENUE_DATA.map((d) => d.mrr));

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Croissance MRR & Synchronisation Stripe
            </h2>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +162% sur 6 mois
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Revenus récurrents mensuels générés par vos clients et abonnements
          </p>
        </div>

        <button
          onClick={() => setActiveView('billing')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>Facturation</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chart visualization */}
      <div className="pt-4 pb-2">
        <div className="h-44 w-full flex items-end gap-3 sm:gap-6 justify-between px-2 border-b border-slate-800">
          {MONTHLY_REVENUE_DATA.map((item, idx) => {
            const heightPercent = Math.round((item.mrr / maxMrr) * 100);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.month}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative h-full justify-end"
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 px-3 py-1.5 rounded-xl bg-slate-950 border border-indigo-500/40 shadow-xl text-center pointer-events-none whitespace-nowrap animate-in fade-in">
                    <div className="text-xs font-bold text-white">
                      {item.mrr.toLocaleString('fr-FR')} FCFA MRR
                    </div>
                    <div className="text-[10px] text-slate-400">
                      +{item.newCustomers} nouveaux clients
                    </div>
                  </div>
                )}

                {/* Animated bar with gradient */}
                <div className="w-full max-w-[42px] bg-slate-800/80 rounded-t-xl overflow-hidden relative group-hover:bg-slate-700/80 transition-all flex items-end" style={{ height: '100%' }}>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-500 ${idx === MONTHLY_REVENUE_DATA.length - 1
                      ? 'bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30'
                      : 'bg-gradient-to-t from-slate-700 to-indigo-600/70 group-hover:from-indigo-600 group-hover:to-indigo-400'
                      }`}
                  />
                </div>

                {/* Month label */}
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[11px] text-slate-400">ARR Estimé</div>
          <div className="text-sm font-bold text-white mt-0.5">58 200 FCFA</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400">Valeur Moy. Client</div>
          <div className="text-sm font-bold text-indigo-400 mt-0.5">142 FCFA/ m</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400">Taux de Rétention</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">97.8 %</div>
        </div>
      </div>
    </div>
  );
}
