'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Key, Shield, Check, ExternalLink } from 'lucide-react';

interface StripeApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StripeApiConfigModal({ isOpen, onClose }: StripeApiConfigModalProps) {
  const { stripeConfig, updateStripeConfig } = useApp();

  const [pk, setPk] = useState(stripeConfig.publishableKey);
  const [sk, setSk] = useState('sk_test_51MzSaaSProSuperSecretKey94b2');
  const [wh, setWh] = useState(stripeConfig.webhookSecret);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStripeConfig({
      publishableKey: pk,
      secretKeyMasked: 'sk_test_••••••••••••' + sk.slice(-4),
      webhookSecret: wh,
      isConfigured: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Clés API Stripe</h2>
            <p className="text-xs text-slate-400">
              Connectez votre tableau de bord Stripe réel ou utilisez les clés Sandbox de test
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
              Clé Publique (Publishable Key)
            </label>
            <input
              type="text"
              required
              value={pk}
              onChange={(e) => setPk(e.target.value)}
              placeholder="pk_test_..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
              Clé Secrète (Secret Key)
            </label>
            <input
              type="password"
              required
              value={sk}
              onChange={(e) => setSk(e.target.value)}
              placeholder="sk_test_..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
              Secret de Signature Webhook (Endpoint Secret)
            </label>
            <input
              type="text"
              value={wh}
              onChange={(e) => setWh(e.target.value)}
              placeholder="whsec_..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 leading-relaxed text-[11px]">
            Pour trouver ces identifiants, rendez-vous dans votre{' '}
            <a
              href="https://dashboard.stripe.com/test/apikeys"
              target="_blank"
              rel="noreferrer"
              className="underline font-bold text-white inline-flex items-center gap-0.5"
            >
              Dashboard Stripe Développeurs <ExternalLink className="w-3 h-3" />
            </a>
            .
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold transition-colors"
            >
              Fermer
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              Sauvegarder les clés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
