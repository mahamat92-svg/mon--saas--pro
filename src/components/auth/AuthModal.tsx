'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DEMO_USERS } from '@/lib/mockData';
import { Shield, Sparkles, ArrowRight, Lock, Mail, Building2, Check, Zap } from 'lucide-react';

export function AuthModal() {
  const { login, loginAsDemoUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Decorative background glow spheres */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Side: SaaS Pitch & Highlights */}
        <div className="lg:col-span-5 text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            SaaS Multitenant Haute Performance
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              mon-saas-pro
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
              La plateforme tout-en-un pour gérer vos workspaces, piloter vos projets, animer vos tâches en Kanban et synchroniser vos factures Stripe.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              {
                title: 'Isolation Multitenant Étendue',
                desc: 'Bascule instantanée entre organisations, données et membres compartimentés.',
                icon: Building2,
              },
              {
                title: 'Kanban & Projets Interactifs',
                desc: 'Gestion des sprints, priorités, budgets consommés et checklists.',
                icon: Zap,
              },
              {
                title: 'Factures & Abonnements Stripe',
                desc: 'Checkout en temps réel, génération PDF immédiate et gestion des forfaits.',
                icon: Shield,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-indigo-500/30 transition-colors"
              >
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                  <feature.icon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">{feature.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Card & 1-Click Demo */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-indigo-950/50">
            {/* Mode switch tabs */}
            <div className="flex p-1 rounded-xl bg-slate-950/80 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Créer un compte & Workspace
              </button>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nom de votre Workspace
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      placeholder="Ex: Mon Agence Digitale"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@entreprise.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Mot de passe
                  </label>
                  {mode === 'login' && (
                    <span className="text-xs text-indigo-400 hover:underline cursor-pointer">
                      Oublié ?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Accéder au Dashboard' : 'Initialiser mon SaaS'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative px-3 bg-slate-900 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Ou connexion démo 1-clic
              </span>
            </div>

            {/* 1-Click Demo Profiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => loginAsDemoUser(u)}
                  className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/20 transition-all group"
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 mb-2"
                  />
                  <div className="font-semibold text-xs text-white truncate max-w-full">
                    {u.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-full">
                    {u.title}
                  </div>
                  <span className="mt-2 text-[10px] font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                    Tester <Check className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-slate-500 mt-5">
              Sécurisé avec Next.js 16 • Tailwind CSS • Intégration Stripe Sandbox Ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
