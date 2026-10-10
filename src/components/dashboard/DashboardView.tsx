'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { StatsOverview } from './StatsOverview';
import { RevenueChart } from './RevenueChart';
import { TaskVelocityChart } from './TaskVelocityChart';
import { RecentActivity } from './RecentActivity';
import {
  FolderKanban,
  CheckSquare,
  CreditCard,
  UserPlus,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewProject: () => void;
  onOpenNewTask: () => void;
  onOpenInviteMember: () => void;
}

export function DashboardView({
  onOpenNewProject,
  onOpenNewTask,
  onOpenInviteMember,
}: DashboardViewProps) {
  const { activeWorkspace, setActiveView, projects, tasks } = useApp();

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 overflow-hidden shadow-2xl">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Espace Multitenant Opérationnel
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Bienvenue sur {activeWorkspace.name} {activeWorkspace.logo}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Supervisez l’ensemble de vos sprints, suivez vos tâches en Kanban interactif et synchronisez vos factures déductibles Stripe sans friction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewProject}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Nouveau Projet</span>
            </button>
            <button
              onClick={onOpenNewTask}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Nouvelle Tâche</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <StatsOverview />

      {/* Analytics & Velocity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TaskVelocityChart />
      </div>

      {/* Bottom Grid: Recent Activity & Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Access Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide mb-1">
              Raccourcis & Modules
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Navigation rapide vers les centres névralgiques du SaaS
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setActiveView('projects')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 hover:bg-indigo-950/20 transition-all text-left text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-indigo-300">
                      Gérer les Projets
                    </div>
                    <div className="text-[11px] text-slate-400">{projects.length} projets au total</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>

              <button
                onClick={() => setActiveView('tasks')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all text-left text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-300">
                      Tableau Kanban
                    </div>
                    <div className="text-[11px] text-slate-400">{tasks.length} tâches en cours</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>

              <button
                onClick={() => setActiveView('billing')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 hover:bg-indigo-950/20 transition-all text-left text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-indigo-300">
                      Factures & Stripe
                    </div>
                    <div className="text-[11px] text-slate-400">Plan {activeWorkspace.plan.toUpperCase()}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>

              <button
                onClick={() => setActiveView('team')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 hover:bg-amber-950/20 transition-all text-left text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-amber-300">
                      Collaborateurs
                    </div>
                    <div className="text-[11px] text-slate-400">Permissions RBAC</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
