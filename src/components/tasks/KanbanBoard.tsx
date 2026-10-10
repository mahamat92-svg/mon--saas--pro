'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, TaskStatus, PriorityLevel } from '@/types';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Edit,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskModal } from './TaskModal';

interface KanbanColumn {
  id: TaskStatus;
  title: string;
  badgeColor: string;
  dotColor: string;
}

const COLUMNS: KanbanColumn[] = [
  { id: 'todo', title: 'À faire', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700', dotColor: 'bg-slate-400' },
  { id: 'in_progress', title: 'En cours', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30', dotColor: 'bg-blue-400' },
  { id: 'in_review', title: 'En revue', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30', dotColor: 'bg-purple-400' },
  { id: 'done', title: 'Terminé', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dotColor: 'bg-emerald-400' },
];

export function KanbanBoard() {
  const {
    tasks,
    projects,
    teamMembers,
    moveTaskStatus,
    toggleSubtask,
    deleteTask,
    selectedProjectId,
    setSelectedProjectId,
    searchQuery,
  } = useApp();

  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState<TaskStatus>('todo');

  const filteredTasks = tasks.filter((t) => {
    const matchesProject = !selectedProjectId || t.projectId === selectedProjectId;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProject && matchesPriority && matchesSearch;
  });

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    moveTaskStatus(taskId, newStatus);
    if (newStatus === 'done') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const getPriorityStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const nextStatusMap: Record<TaskStatus, TaskStatus | null> = {
    todo: 'in_progress',
    in_progress: 'in_review',
    in_review: 'done',
    done: null,
  };

  const prevStatusMap: Record<TaskStatus, TaskStatus | null> = {
    todo: null,
    in_progress: 'todo',
    in_review: 'in_progress',
    done: 'in_review',
  };

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {/* Project selector filter */}
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value || null)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Tous les projets ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Toutes priorités</option>
            <option value="urgent">Urgente</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
        </div>

        <button
          onClick={() => {
            setTaskToEdit(null);
            setDefaultStatusForNew('todo');
            setIsModalOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouvelle Tâche</span>
        </button>
      </div>

      {/* 4-Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {col.title}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setTaskToEdit(null);
                    setDefaultStatusForNew(col.id);
                    setIsModalOpen(true);
                  }}
                  title="Ajouter ici"
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards List */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-center p-3 text-xs text-slate-500">
                    Aucune tâche dans cette colonne
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    const assignee = teamMembers.find((m) => m.id === task.assigneeId);
                    const nextStatus = nextStatusMap[task.status];
                    const prevStatus = prevStatusMap[task.status];
                    const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

                    return (
                      <div
                        key={task.id}
                        className="group p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 hover:border-slate-700 shadow-lg hover:shadow-indigo-950/20 transition-all text-left"
                      >
                        {/* Tags and priority */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>

                          {project && (
                            <span className="text-[10px] text-indigo-300 truncate max-w-[120px] font-medium">
                              {project.name}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <div
                          onClick={() => {
                            setTaskToEdit(task);
                            setIsModalOpen(true);
                          }}
                          className="text-xs font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer leading-snug mb-1.5"
                        >
                          {task.title}
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Subtasks checklist */}
                        {task.subtasks.length > 0 && (
                          <div className="my-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1">
                              <span>Checklist</span>
                              <span>
                                {completedSubtasks}/{task.subtasks.length}
                              </span>
                            </div>
                            {task.subtasks.map((st) => (
                              <label
                                key={st.id}
                                className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer hover:text-white"
                              >
                                <input
                                  type="checkbox"
                                  checked={st.completed}
                                  onChange={() => toggleSubtask(task.id, st.id)}
                                  className="accent-emerald-500 rounded w-3 h-3"
                                />
                                <span className={st.completed ? 'line-through text-slate-500' : ''}>
                                  {st.title}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* Card bottom info */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between mt-2 text-[10px]">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>

                          {assignee && (
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              title={assignee.name}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700"
                            />
                          )}
                        </div>

                        {/* Transition arrows */}
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/60">
                          <div>
                            {prevStatus ? (
                              <button
                                onClick={() => handleStatusChange(task.id, prevStatus)}
                                title="Reculer"
                                className="text-[10px] text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 inline-flex items-center gap-0.5"
                              >
                                <ArrowLeft className="w-3 h-3" />
                                <span>Reculer</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => deleteTask(task.id)}
                                title="Supprimer"
                                className="text-[10px] text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 inline-flex items-center gap-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setTaskToEdit(task);
                                setIsModalOpen(true);
                              }}
                              title="Modifier"
                              className="text-[10px] text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                            >
                              <Edit className="w-3 h-3" />
                            </button>

                            {nextStatus && (
                              <button
                                onClick={() => handleStatusChange(task.id, nextStatus)}
                                title="Avancer"
                                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 p-1 rounded hover:bg-indigo-950/40 inline-flex items-center gap-0.5"
                              >
                                <span>Avancer</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
        defaultStatus={defaultStatusForNew}
      />
    </div>
  );
}
