'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Building2,
  Save,
  Trash2,
  AlertTriangle,
  Sparkles,
  Shield,
  CreditCard,
  RotateCcw,
} from 'lucide-react';

export function WorkspaceSettings() {
  const { activeWorkspace, updateWorkspace, deleteWorkspace, resetAllData } = useApp();

  const [name, setName] = useState(activeWorkspace.name);
  const [slug, setSlug] = useState(activeWorkspace.slug);
  const [logo, setLogo] = useState(activeWorkspace.logo);
  const [currency, setCurrency] = useState(activeWorkspace.currency);
  const [ownerEmail, setOwnerEmail] = useState(activeWorkspace.ownerEmail);

  useEffect(() => {
    setName(activeWorkspace.name);
    setSlug(activeWorkspace.slug);
    setLogo(activeWorkspace.logo);
    setCurrency(activeWorkspace.currency);
    setOwnerEmail(activeWorkspace.ownerEmail);
  }, [activeWorkspace]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspace(activeWorkspace.id, {
      name: name.trim(),
      slug: slug.trim(),
      logo,
      currency,
      ownerEmail: ownerEmail.trim(),
    });
  };

  const handleDelete = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement le workspace "${activeWorkspace.name}" ?`)) {
      deleteWorkspace(activeWorkspace.id);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* General Settings */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Paramètres Généraux du Workspace</h2>
            <p className="text-xs text-slate-400">
              Configurez le nom public, l’URL personnalisée et les options de facturation
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                Icône / Logo
              </label>
            </div>
            <div className="sm:col-span-9 flex items-center gap-3">
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                maxLength={4}
                className="w-16 text-center text-2xl py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <span className="text-slate-400 text-xs">
                Saisissez un emoji représentatif de votre organisation
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                Nom du Workspace
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                Identifiant URL (Slug)
              </label>
            </div>
            <div className="sm:col-span-9">
              <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3 text-slate-400 text-xs">
                <span className="text-slate-500">app.mon-saas-pro.io/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full py-2.5 px-1 bg-transparent text-white focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                Email de Facturation
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                Devise Principale
              </label>
            </div>
            <div className="sm:col-span-9">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'EUR' | 'USD')}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
              >
                <option value="XAF">Franc CFA (FCFA - XAF)</option>
                <option value="EUR">Euro (€ - EUR)</option>
                <option value="USD">Dollar ($ - USD)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer les paramètres</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 text-rose-400 mb-2 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Zone Dangereuse</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          La suppression de ce workspace est irréversible et supprimera l’ensemble de ses projets, tâches et historique Stripe associés.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Supprimer ce Workspace</span>
          </button>

          <button
            onClick={resetAllData}
            className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurer les données démo par défaut</span>
          </button>
        </div>
      </div>
    </div>
  );
}
