'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Project } from '@/types';
import {
  X,
  FolderKanban,
  Calendar,
  DollarSign,
  Users,
  CheckSquare,
  Tag,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onEdit: (p: Project) => void;
}

export function ProjectDetailModal({ project, onClose, onEdit }: ProjectDetailModalProps) {
  const { tasks, teamMembers, toggleSubtask, setActiveView, setSelectedProjectId } = useApp();

  if (!project) return null;

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const assignedMembers = teamMembers.filter((m) => project.teamIds.includes(m.id));

  const handleOpenKanban = () => {
    setSelectedProjectId(project.id);
    setActiveView('tasks');
    onClose();
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    planning: { label: 'En planification', color: 'bg-slate-800 text-slate-300 border-slate-700' },
    in_progress: { label: 'En cours', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    on_hold: { label: 'En pause', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    completed: { label: 'Terminé', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800 pr-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusLabels[project.status]?.color
                  }`}
              >
                {statusLabels[project.status]?.label}
              </span>
              <span className="text-xs text-slate-400 font-medium">• {project.client}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{project.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(project);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              Modifier
            </button>
            <button
              onClick={handleOpenKanban}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>Voir dans Kanban</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-slate-800">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Description & Objectifs
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {project.description || 'Aucune description détaillée.'}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium"
                  >
                    <Tag className="w-3 h-3 text-indigo-400" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Associated Tasks */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tâches Associées ({projectTasks.length})
                </h3>
                <span className="text-xs text-indigo-400 font-semibold">
                  {projectTasks.filter((t) => t.status === 'done').length} terminées
                </span>
              </div>

              {projectTasks.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
                  Aucune tâche rattachée pour le moment.
                </div>
              ) : (
                <div className="space-y-2">
                  {projectTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{task.title}</span>
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${task.status === 'done'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-indigo-500/10 text-indigo-400'
                            }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      {task.subtasks.length > 0 && (
                        <div className="mt-2 space-y-1 pl-1">
                          {task.subtasks.map((st) => (
                            <label
                              key={st.id}
                              className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-200"
                            >
                              <input
                                type="checkbox"
                                checked={st.completed}
                                onChange={() => toggleSubtask(task.id, st.id)}
                                className="accent-indigo-500 rounded"
                              />
                              <span className={st.completed ? 'line-through opacity-60' : ''}>
                                {st.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Metrics & Team */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Indicateurs Clés
              </h3>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Progression</span>
                  <span className="font-bold text-indigo-400">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${project.progress}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-xs text-slate-400">Budget Consommé</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {project.spent.toLocaleString('fr-FR')} FCFA{' '}
                  <span className="text-xs text-slate-500 font-normal">
                    / {project.budget.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Date d’échéance
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  {new Date(project.dueDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            {/* Assigned Team */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Équipe Assignée ({assignedMembers.length})
              </h3>
              <div className="space-y-2">
                {assignedMembers.map((m) => (
                  <div key={m.id} className="flex items-center gap-2.5">
                    <img src={m.avatar} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{m.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{m.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
