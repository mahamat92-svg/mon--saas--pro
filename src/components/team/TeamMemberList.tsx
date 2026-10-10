'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Role } from '@/types';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Shield,
  Trash2,
  Mail,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { InviteMemberModal } from './InviteMemberModal';

export function TeamMemberList() {
  const { teamMembers, updateMemberRole, removeMember, activeWorkspace, currentUser } = useApp();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-3 h-3" />
            Propriétaire
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Shield className="w-3 h-3" />
            Administrateur
          </span>
        );
      case 'member':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Membre
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
            Lecteur
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">
            Membres de l'Organisation ({teamMembers.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gérez les permissions et les accès des collaborateurs pour {activeWorkspace.name}
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 flex items-center gap-1.5 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Inviter un membre</span>
        </button>
      </div>

      {/* Team Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Collaborateur</th>
                <th className="py-3 px-4">Poste</th>
                <th className="py-3 px-4">Rôle</th>
                <th className="py-3 px-4">Date d’arrivée</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {teamMembers.map((member) => {
                const isCurrentUser = member.email === currentUser.email;

                return (
                  <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="truncate">{member.name}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 rounded font-medium">
                                Vous
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{member.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      {member.title}
                    </td>

                    <td className="py-3.5 px-4">
                      {member.role === 'owner' ? (
                        getRoleBadge('owner')
                      ) : (
                        <select
                          value={member.role}
                          onChange={(e) => updateMemberRole(member.id, e.target.value as Role)}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="admin">Administrateur</option>
                          <option value="member">Membre</option>
                          <option value="viewer">Lecteur</option>
                        </select>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(member.joinedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Actif
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {member.role !== 'owner' && (
                        <button
                          onClick={() => removeMember(member.id)}
                          title="Retirer le membre"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
