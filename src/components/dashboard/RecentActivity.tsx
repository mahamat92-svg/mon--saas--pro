'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Activity, Clock, FolderKanban, CheckSquare, CreditCard, Users, Building2 } from 'lucide-react';

export function RecentActivity() {
  const { activities, setActiveView } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderKanban className="w-3.5 h-3.5 text-purple-400" />;
      case 'task':
        return <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case 'billing':
        return <CreditCard className="w-3.5 h-3.5 text-indigo-400" />;
      case 'team':
        return <Users className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            Activité Récente de l’Équipe
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Événements en direct au sein de votre workspace
          </p>
        </div>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          En temps réel
        </span>
      </div>

      <div className="divide-y divide-slate-800/80">
        {activities.slice(0, 6).map((item) => (
          <div key={item.id} className="py-3 flex items-start gap-3 first:pt-0 last:pb-0 group">
            <img
              src={item.user.avatar}
              alt={item.user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800 shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-300 leading-snug">
                <strong className="text-white font-semibold">{item.user.name}</strong>{' '}
                <span className="text-slate-400">{item.action}</span>{' '}
                <span className="text-indigo-300 font-semibold">{item.target}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                  {getIcon(item.type)}
                  <span className="capitalize">{item.type}</span>
                </span>
                <span className="text-[10px] text-slate-500">• {item.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
