'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PricingPlan } from '@/types';
import { X, Smartphone, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlan: PricingPlan | null;
  interval: 'monthly' | 'yearly';
}

// TA LOGIQUE GENIALE - Paiement par pays
const PAYS_MOBILE_MONEY: any = {
  TD: { nom: 'TCHAD', devise: 'FCFA', indicatif: '+235', providers: [{ id: 'orange', nom: 'Orange Money', color: 'bg-orange-500' }, { id: 'moov', nom: 'Moov Money', color: 'bg-blue-600' }, { id: 'airtel', nom: 'Airtel Money', color: 'bg-red-600' }] },
  CM: { nom: 'CAMEROUN', devise: 'FCFA', indicatif: '+237', providers: [{ id: 'mtn', nom: 'MTN MoMo', color: 'bg-yellow-500' }, { id: 'orange', nom: 'Orange Money', color: 'bg-orange-500' }] },
  BJ: { nom: 'BENIN', devise: 'FCFA', indicatif: '+229', providers: [{ id: 'mtn', nom: 'MTN MoMo', color: 'bg-yellow-500' }, { id: 'moov', nom: 'Moov Money', color: 'bg-blue-600' }, { id: 'wave', nom: 'Wave', color: 'bg-sky-500' }] },
  TG: { nom: 'TOGO', devise: 'FCFA', indicatif: '+228', providers: [{ id: 'tmoney', nom: 'T-Money', color: 'bg-blue-700' }, { id: 'moov', nom: 'Moov Money', color: 'bg-blue-600' }, { id: 'wave', nom: 'Wave', color: 'bg-sky-500' }] },
  CI: { nom: "COTE D'IVOIRE", devise: 'FCFA', indicatif: '+225', providers: [{ id: 'wave', nom: 'Wave', color: 'bg-sky-500' }, { id: 'orange', nom: 'Orange Money', color: 'bg-orange-500' }, { id: 'mtn', nom: 'MTN MoMo', color: 'bg-yellow-500' }] },
  CG: { nom: 'CONGO', devise: 'FCFA', indicatif: '+242', providers: [{ id: 'airtel', nom: 'Airtel Money', color: 'bg-red-600' }, { id: 'mtn', nom: 'MTN MoMo', color: 'bg-yellow-500' }] },
  CD: { nom: 'RDC', devise: 'FC', indicatif: '+243', providers: [{ id: 'airtel', nom: 'Airtel Money', color: 'bg-red-600' }, { id: 'orange', nom: 'Orange Money', color: 'bg-orange-500' }, { id: 'mpesa', nom: 'M-Pesa', color: 'bg-green-600' }] },
}

export function StripeCheckoutModal({ isOpen, onClose, targetPlan, interval }: StripeCheckoutModalProps) {
  const { changePlan, activeWorkspace } = useApp();
  const [pays, setPays] = useState('TD');
  const [provider, setProvider] = useState('orange');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !targetPlan) return null;

  const config = PAYS_MOBILE_MONEY[pays];
  const prixFCFA = interval === 'monthly' ? targetPlan.priceMonthly : targetPlan.priceYearly;
  const tva = Math.round(prixFCFA * 0.18);
  const total = prixFCFA + tva;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return alert('Entre ton numéro Mobile Money');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      try { confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }); } catch { }
      setTimeout(() => {
        changePlan(targetPlan.id, interval);
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center"><CheckCircle2 className="w-10 h-10" /></div>
            <h2 className="text-2xl font-black">Paiement {config.providers.find((p: any) => p.id === provider)?.nom} Validé!</h2>
            <p className="text-sm text-slate-300">Forfait <strong className="text-white">{targetPlan.name}</strong> activé. Reçu envoyé au {config.indicatif} {phone}</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400"><Smartphone className="w-6 h-6" /></div>
              <div><h2 className="text-xl font-bold">Payer en Mobile Money</h2><p className="text-xs text-slate-400">Workspace : <span className="text-white">{activeWorkspace.name}</span></p></div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-5 space-y-2 text-xs">
              <div className="flex justify-between"><span>Forfait {targetPlan.name} ({interval === 'monthly' ? '1 mois' : '1 an'})</span><span className="font-semibold">{prixFCFA.toLocaleString()} FCFA HT</span></div>
              <div className="flex justify-between text-slate-400"><span>TVA (18%)</span><span>{tva.toLocaleString()} FCFA</span></div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold"><span>Total TTC</span><span className="text-orange-400 text-base">{total.toLocaleString()} {config.devise}</span></div>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1.5 text-slate-300">Pays - Localisation automatique</label>
                <select value={pays} onChange={(e) => { setPays(e.target.value); setProvider(PAYS_MOBILE_MONEY[e.target.value].providers[0].id) }} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm">
                  {Object.keys(PAYS_MOBILE_MONEY).map(code => <option key={code} value={code}>{PAYS_MOBILE_MONEY[code].nom} ({PAYS_MOBILE_MONEY[code].indicatif})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1.5 text-slate-300">Choisir Opérateur Mobile Money</label>
                <div className="grid grid-cols-3 gap-2">
                  {config.providers.map((p: any) => (
                    <button type="button" key={p.id} onClick={() => setProvider(p.id)} className={`p-3 rounded-xl border text-xs font-bold transition-all ${provider === p.id ? 'border-orange-500 bg-orange-500/20 text-white' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>
                      <div className={`w-full h-2 rounded-full mb-2 ${p.color}`}></div>{p.nom}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1.5 text-slate-300">Numéro {config.providers.find((p: any) => p.id === provider)?.nom}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500 text-xs font-bold">{config.indicatif}</span>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="22 34 56 78" className="w-full pl-16 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-orange-500/50 outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                <ShieldCheck className="w-4 h-4 shrink-0" /><span>Paiement 100% sécurisé via {config.providers.find((p: any) => p.id === provider)?.nom}. Confirmation USSD instantanée.</span>
              </div>

              <button type="submit" disabled={isProcessing} className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2">
                {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock className="w-4 h-4" /><span>Payer {total.toLocaleString()} {config.devise} via {config.providers.find((p: any) => p.id === provider)?.nom}</span></>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}