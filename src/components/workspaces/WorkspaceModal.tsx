'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Building2, Check, Sparkles } from 'lucide-react';
import { SubscriptionPlanId } from '@/types';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['🚀', '⚡', '✨', '💎', '🔥', '🏢', '🌐', '🎯', '🦄', '🌟'];

export function WorkspaceModal({ isOpen, onClose }: WorkspaceModalProps) {
  const { createWorkspace } = useApp();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('🚀');
  const [plan, setPlan] = useState<SubscriptionPlanId>('pro');

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createWorkspace(name.trim(), slug.trim() || 'mon-workspace', logo, plan);
    setName('');
    setSlug('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Nouveau Workspace</h2>
            <p className="text-xs text-slate-400">
              Créez une organisation isolée pour vos projets, équipes et factures Stripe
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Icône du Workspace
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setLogo(emoji)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${logo === emoji
                      ? 'bg-indigo-600 ring-2 ring-indigo-400 scale-105 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/80 hover:bg-slate-700/80'
                    }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nom de l’organisation
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="Ex: Studio Alpha, NextGen SaaS..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Identifiant URL (Slug)
            </label>
            <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3 text-sm text-slate-400">
              <span className="text-slate-500">app.mon-saas-pro.io/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="studio-alpha"
                className="w-full py-2.5 px-1 bg-transparent text-white focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Forfait de départ
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'starter', name: 'Starter', price: '29€/m' },
                { id: 'pro', name: 'Pro', price: '15000€/m', popular: true },
                { id: 'enterprise', name: 'Enterprise', price: '199€/m' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id as SubscriptionPlanId)}
                  className={`p-3 rounded-xl border text-left transition-all ${plan === p.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{p.name}</span>
                    {plan === p.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{p.price}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800/60 text-slate-300 text-sm font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Créer l’organisation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
