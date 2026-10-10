'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, TaskStatus, PriorityLevel } from '@/types';
import {
  CheckSquare,
  Clock,
  Trash2,
  Edit,
  Plus,
  Calendar,
  AlertCircle,
  Tag,
  CheckCircle2,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskModal } from './TaskModal';

export function TaskListView() {
  const {
    tasks,
    projects,
    teamMembers,
    moveTaskStatus,
    deleteTask,
    selectedProjectId,
    setSelectedProjectId,
    searchQuery,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((t) => {
    const matchesProject = !selectedProjectId || t.projectId === selectedProjectId;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProject && matchesStatus && matchesPriority && matchesSearch;
  });

  const handleToggleDone = (task: Task) => {
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    moveTaskStatus(task.id, newStatus);
    if (newStatus === 'done') {
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleExportTasksCsv = () => {
    if (filteredTasks.length === 0) return;
    const csvRows = [
      'Titre;Projet;Statut;Priorite;Assignee;DateLimite',
      ...filteredTasks.map((t) => {
        const p = projects.find((proj) => proj.id === t.projectId)?.name || '';
        const m = teamMembers.find((mem) => mem.id === t.assigneeId)?.name || '';
        return `"${t.title}";"${p}";"${t.status}";"${t.priority}";"${m}";"${t.dueDate}"`;
      }),
    ];
    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taches_export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'urgent':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">Urgente</span>;
      case 'high':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Haute</span>;
      case 'medium':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Moyenne</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">Basse</span>;
    }
  };

  const getStatusBadge = (s: TaskStatus) => {
    switch (s) {
      case 'done':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Terminé</span>;
      case 'in_review':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">En revue</span>;
      case 'in_progress':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">En cours</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">À faire</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="in_review">En revue</option>
            <option value="done">Terminé</option>
          </select>

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

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportTasksCsv}
            className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Exporter CSV</span>
          </button>

          <button
            onClick={() => {
              setTaskToEdit(null);
              setIsModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvelle Tâche</span>
          </button>
        </div>
      </div>

      {/* High Density Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-10">Fait</th>
                <th className="py-3 px-4">Tâche</th>
                <th className="py-3 px-4">Projet</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Priorité</th>
                <th className="py-3 px-4">Assigné à</th>
                <th className="py-3 px-4">Échéance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Aucune tâche ne correspond aux critères.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  const assignee = teamMembers.find((m) => m.id === task.assigneeId);
                  const isDone = task.status === 'done';

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => handleToggleDone(task)}
                          className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div
                          onClick={() => {
                            setTaskToEdit(task);
                            setIsModalOpen(true);
                          }}
                          className={`font-semibold cursor-pointer hover:text-indigo-300 transition-colors ${
                            isDone ? 'line-through text-slate-500' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </div>
                        {task.subtasks.length > 0 && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Checklist : {task.subtasks.filter((s) => s.completed).length}/
                            {task.subtasks.length}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-indigo-300 font-medium truncate max-w-[140px] block">
                          {project?.name || '—'}
                        </span>
                      </td>

                      <td className="py-3 px-4">{getStatusBadge(task.status)}</td>

                      <td className="py-3 px-4">{getPriorityBadge(task.priority)}</td>

                      <td className="py-3 px-4">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={assignee.avatar}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700"
                            />
                            <span className="truncate max-w-[100px]">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500">Non assigné</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(task.dueDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setTaskToEdit(task);
                              setIsModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
