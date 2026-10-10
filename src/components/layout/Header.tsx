'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Plus,
  RotateCcw,
  Sparkles,
  ChevronDown,
  FolderKanban,
  CheckSquare,
  UserPlus,
  Check,
} from 'lucide-react';
import { DEMO_USERS } from '@/lib/mockData';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenNewProject: () => void;
  onOpenNewTask: () => void;
  onOpenInviteMember: () => void;
}

export function Header({
  onOpenMobileSidebar,
  onOpenNewProject,
  onOpenNewTask,
  onOpenInviteMember,
}: HeaderProps) {
  const {
    activeWorkspace,
    activeView,
    searchQuery,
    setSearchQuery,
    currentUser,
    loginAsDemoUser,
    resetAllData,
    activities,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const viewTitles: Record<string, string> = {
    dashboard: 'Tableau de bord',
    projects: 'Projets & Sprints',
    tasks: 'Tâches & Tableau Kanban',
    billing: 'Factures & Abonnements Stripe',
    team: 'Équipe & Membres',
    settings: 'Paramètres du Workspace',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            <span>{activeWorkspace.logo}</span>
            <span className="text-white truncate max-w-[140px]">{activeWorkspace.name}</span>
          </span>
          <span className="hidden sm:inline text-slate-600">/</span>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {viewTitles[activeView] || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher projets, tâches, factures..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Reset Demo Data quick button */}
        <button
          onClick={resetAllData}
          title="Réinitialiser les données de démo"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Démo</span>
        </button>

        {/* Create Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Créer</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {isCreateMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <button
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  onOpenNewProject();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <FolderKanban className="w-4 h-4 text-indigo-400" />
                <span>Nouveau Projet</span>
              </button>
              <button
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  onOpenNewTask();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Nouvelle Tâche</span>
              </button>
              <button
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  onOpenInviteMember();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <UserPlus className="w-4 h-4 text-purple-400" />
                <span>Inviter un Membre</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Flux d’activité direct</span>
                <span className="text-[10px] text-indigo-400 font-semibold">{activeWorkspace.name}</span>
              </div>
              <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="text-xs p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-300">
                      <img src={act.user.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                      <span className="font-semibold text-white truncate">{act.user.name}</span>
                      <span className="text-slate-400">{act.action}</span>
                    </div>
                    <div className="text-indigo-400 font-medium text-[11px] mt-0.5 truncate">{act.target}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{act.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Quick Switch Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="pb-2.5 mb-2 border-b border-slate-800">
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  <Sparkles className="w-3 h-3" />
                  Rôle: {currentUser.role}
                </div>
              </div>

              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Changer de profil démo
              </div>

              <div className="space-y-1">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      loginAsDemoUser(u);
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-1.5 rounded-xl text-left text-xs transition-colors ${
                      u.id === currentUser.id
                        ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{u.title}</div>
                      </div>
                    </div>
                    {u.id === currentUser.id && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
