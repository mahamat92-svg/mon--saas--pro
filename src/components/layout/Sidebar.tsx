'use client';

import React, { useState } from 'react';
import { useApp, NavView } from '@/context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  MessageCircle,
  CreditCard,
  Users,
  Settings,
  ChevronDown,
  Plus,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { WorkspaceModal } from '@/components/workspaces/WorkspaceModal';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const {
    activeWorkspace,
    workspaces,
    setActiveWorkspaceId,
    currentUser,
    logout,
    activeView,
    setActiveView,
    projects,
    tasks,
    teamMembers,
  } = useApp();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isCreateWsOpen, setIsCreateWsOpen] = useState(false);

  const navItems: { view: NavView; label: string; icon: React.ElementType; badge?: number | string }[] = [
    { view: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { view: 'projects', label: 'Projets', icon: FolderKanban, badge: projects.length },
    { view: 'tasks', label: 'Tâches & Kanban', icon: CheckSquare, badge: tasks.filter((t) => t.status !== 'done').length },
    { view: 'billing', label: 'Factures & Stripe', icon: CreditCard, badge: activeWorkspace.plan.toUpperCase() },
    { view: 'team', label: 'Équipe & Membres', icon: Users, badge: teamMembers.length },
    { view: 'settings', label: 'Paramètres', icon: Settings },
    { view: 'inbox' as any, label: 'Boite 651465708 🟢', icon: MessageCircle, badge: 2 },
  ];

  const handleSelectNav = (view: any) => {
    if (view === 'inbox') {
      window.location.href = '/inbox';
      return;
    }
    setActiveView(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-950/95 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out backdrop-blur-xl lg:translate-x-0 ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Workspace Switcher Header */}
        <div className="p-4 border-b border-slate-800/80 relative">
          <button
            type="button"
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-lg shadow-sm">
                {activeWorkspace.logo}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                  {activeWorkspace.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {activeWorkspace.plan}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {activeWorkspace.memberCount} membres
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${isWorkspaceMenuOpen ? 'rotate-180 text-white' : ''
                }`}
            />
          </button>

          {/* Multitenant Dropdown Menu */}
          {isWorkspaceMenuOpen && (
            <div className="absolute top-[82px] left-4 right-4 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5">
                Changer de Workspace
              </div>
              <div className="space-y-1 my-1 max-h-56 overflow-y-auto">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspaceId(ws.id);
                      setIsWorkspaceMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${ws.id === activeWorkspace.id
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base">{ws.logo}</span>
                      <span className="font-semibold truncate">{ws.name}</span>
                    </div>
                    {ws.id === activeWorkspace.id && (
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setIsWorkspaceMenuOpen(false);
                    setIsCreateWsOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nouveau Workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;

            return (
              <button
                key={item.view}
                onClick={() => handleSelectNav(item.view)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-300'
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Stripe Plan Quick Card */}
        <div className="px-4 pb-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20 text-white relative overflow-hidden group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Stripe Billing
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {activeWorkspace.plan === 'enterprise' ? 'Illimité' : 'Actif'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Plan <strong className="text-white capitalize">{activeWorkspace.plan}</strong> • Facturation synchronisée.
            </p>

            <button
              onClick={() => handleSelectNav('billing')}
              className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>Gérer les Factures</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* User Profile Bar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span className="capitalize">{currentUser.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Se déconnecter"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* New Workspace Modal */}
      <WorkspaceModal
        isOpen={isCreateWsOpen}
        onClose={() => setIsCreateWsOpen(false)}
      />
    </>
  );
}
