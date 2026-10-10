'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, Clock, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';

export function TaskVelocityChart() {
  const { tasks, projects, setActiveView } = useApp();

  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const inReviewCount = tasks.filter((t) => t.status === 'in_review').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const total = tasks.length || 1;

  const urgentCount = tasks.filter((t) => t.priority === 'urgent').length;
  const highCount = tasks.filter((t) => t.priority === 'high').length;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Vélocité & État des Tâches
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Répartition opérationnelle du flux de travail Kanban
            </p>
          </div>
          <button
            onClick={() => setActiveView('tasks')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>Kanban</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stacked multi-color progress bar */}
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex my-3">
          <div
            style={{ width: `${(doneCount / total) * 100}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Terminées: ${doneCount}`}
          />
          <div
            style={{ width: `${(inReviewCount / total) * 100}%` }}
            className="bg-purple-500 transition-all duration-500"
            title={`En revue: ${inReviewCount}`}
          />
          <div
            style={{ width: `${(inProgressCount / total) * 100}%` }}
            className="bg-blue-500 transition-all duration-500"
            title={`En cours: ${inProgressCount}`}
          />
          <div
            style={{ width: `${(todoCount / total) * 100}%` }}
            className="bg-slate-600 transition-all duration-500"
            title={`À faire: ${todoCount}`}
          />
        </div>

        {/* Status badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <div className="font-bold text-sm text-emerald-300">{doneCount}</div>
            <div className="text-[11px] text-emerald-400/80">Terminées</div>
          </div>
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <div className="font-bold text-sm text-purple-300">{inReviewCount}</div>
            <div className="text-[11px] text-purple-400/80">En revue</div>
          </div>
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <div className="font-bold text-sm text-blue-300">{inProgressCount}</div>
            <div className="text-[11px] text-blue-400/80">En cours</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/80 text-slate-300">
            <div className="font-bold text-sm text-slate-200">{todoCount}</div>
            <div className="text-[11px] text-slate-400">À faire</div>
          </div>
        </div>
      </div>

      {/* Urgent alerts & Active Projects mini list */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Priorités critiques :</span>
          <span className="font-bold text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {urgentCount} urgente{urgentCount > 1 ? 's' : ''}, {highCount} haute{highCount > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Avancement global projets :</span>
          <span className="font-bold text-indigo-400">
            {projects.length > 0
              ? Math.round(
                  projects.reduce((acc, p) => acc + p.progress, 0) / projects.length
                )
              : 0}
            % complété
          </span>
        </div>
      </div>
    </div>
  );
}
