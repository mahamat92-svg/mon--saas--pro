'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SubscriptionPlans } from './SubscriptionPlans';
import { InvoicesTable } from './InvoicesTable';
import { CreditCard, FileText, Sparkles } from 'lucide-react';

export function BillingView() {
  const [activeTab, setActiveTab] = useState<'plans' | 'invoices'>('plans');
  const { activeWorkspace } = useApp();

  return (
    <div className="space-y-6">
      {/* Sub-tabs header */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'plans'
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
            : 'text-slate-400 hover:text-white'
            }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Formules & Forfaits Mobile Money (Airtel, Moov, MTN, orange)</span>
        </button>
        <div className="flex items-center gap-2 mt-3">
          <span className="w-7 h-7 rounded-full bg-[#e60000] text-white text-[10px] font-bold flex items-center justify-center">Airtel</span>
          <span className="w-7 h-7 rounded-full bg-[#0071bc] text-white text-[10px] font-bold flex items-center justify-center">Moov</span>
          <span className="w-7 h-7 rounded-full bg-[#ffcc00] text-black text-[10px] font-bold flex items-center justify-center">MTN</span>
          <span className="w-7 h-7 rounded-full bg-[#ff6600] text-white text-[9px] font-bold flex items-center justify-center">Orange</span>
          <span className="text-[11px] text-slate-400 ml-2">+ Carte Bancaire (Stripe)</span>
        </div>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'invoices'
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
            : 'text-slate-400 hover:text-white'
            }`}
        >
          <FileText className="w-4 h-4" />
          <span>Historique des Factures & Reçus</span>
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'plans' ? <SubscriptionPlans /> : <InvoicesTable />}
    </div>
  );
}
