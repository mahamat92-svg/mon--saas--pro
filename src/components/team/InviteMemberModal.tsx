'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Role } from '@/types';
import { X, UserPlus, Sparkles, Mail, Shield } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const { inviteMember, activeWorkspace } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    inviteMember({
      name: name.trim(),
      email: email.trim(),
      role,
      title: title.trim() || 'Collaborateur',
    });

    setName('');
    setEmail('');
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Inviter un Membre</h2>
            <p className="text-xs text-slate-400">
              Ajoutez un collaborateur à <span className="text-white font-medium">{activeWorkspace.name}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
              Nom & Prénom *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Lucas Moreau"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
              Adresse e-mail professionnelle *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lucas@entreprise.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
              Poste / Rôle dans l'entreprise
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Designer UX, Développeur Backend..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
              Niveau d’accès (RBAC)
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs"
            >
              <option value="admin">Administrateur (Gestion totale sauf facturation)</option>
              <option value="member">Membre (Peut créer et modifier des projets/tâches)</option>
              <option value="viewer">Lecteur (Consultation seule)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Envoyer l’invitation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
