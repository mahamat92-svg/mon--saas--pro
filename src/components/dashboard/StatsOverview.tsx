'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { TrendingUp, FolderKanban, CheckCircle2, CreditCard, Users, ArrowUpRight } from 'lucide-react';

export function StatsOverview() {
  const { activeWorkspace, projects, tasks, invoices, teamMembers } = useApp();

  // Calculate MRR / Invoiced totals
  const totalInvoiced = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const activeProjectsCount = projects.filter((p) => p.status === 'in_progress' || p.status === 'planning').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'done').length;
  const totalTasksCount = tasks.length;
  const taskCompletionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const mrrAmount = activeWorkspace.plan === 'starter' ? 29 : activeWorkspace.plan === 'pro' ? 15000 : 199;

  const stats = [
    {
      title: 'MRR Workspace (Stripe)',
      value: `${mrrAmount} FCFA / mois`,
      change: '+14.5%',
      isPositive: true,
      subtext: `Forfait ${activeWorkspace.plan.toUpperCase()} actif`,
      icon: CreditCard,
      color: 'from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30',
      glow: 'group-hover:shadow-indigo-500/10',
    },
    {
      title: 'Projets Actifs',
      value: `${activeProjectsCount} en cours`,
      change: `${projects.length} au total`,
      isPositive: true,
      subtext: 'Suivi des jalons & budgets',
      icon: FolderKanban,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
      glow: 'group-hover:shadow-purple-500/10',
    },
    {
      title: 'Tâches Terminées',
      value: `${completedTasksCount} / ${totalTasksCount}`,
      change: `${taskCompletionRate}%`,
      isPositive: taskCompletionRate >= 50,
      subtext: 'Vélocité sprint optimale',
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      glow: 'group-hover:shadow-emerald-500/10',
    },
    {
      title: 'Membres & Collaborateurs',
      value: `${teamMembers.length} membres`,
      change: 'RBAC actif',
      isPositive: true,
      subtext: 'Rôles & invitations gérés',
      icon: Users,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      glow: 'group-hover:shadow-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`group relative p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 shadow-xl ${stat.glow}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.title}
              </span>
              <div className={`p-2 rounded-xl bg-gradient-to-br border ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl font-black text-white tracking-tight">
              {stat.value}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 truncate">{stat.subtext}</span>
              <span className="inline-flex items-center gap-0.5 font-bold text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
