'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, TaskStatus, PriorityLevel, Subtask } from '@/types';
import { X, CheckSquare, Plus, Trash2, Sparkles, Calendar, Tag } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultStatus?: TaskStatus;
}

export function TaskModal({
  isOpen,
  onClose,
  taskToEdit,
  defaultStatus = 'todo',
}: TaskModalProps) {
  const { createTask, updateTask, projects, teamMembers } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-25');
  const [tagsInput, setTagsInput] = useState('Frontend');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setProjectId(taskToEdit.projectId);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setAssigneeId(taskToEdit.assigneeId);
      setDueDate(taskToEdit.dueDate);
      setTagsInput(taskToEdit.tags.join(', '));
      setSubtasks(taskToEdit.subtasks);
    } else {
      setTitle('');
      setDescription('');
      setProjectId(projects[0]?.id || '');
      setStatus(defaultStatus);
      setPriority('medium');
      setAssigneeId(teamMembers[0]?.id || '');
      setDueDate('2026-10-28');
      setTagsInput('Sprint');
      setSubtasks([
        { id: 'st-' + Date.now(), title: 'Spécification technique', completed: false },
        { id: 'st-' + (Date.now() + 1), title: 'Tests unitaires & validation', completed: false },
      ]);
    }
  }, [taskToEdit, isOpen, defaultStatus, projects, teamMembers]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      {
        id: 'st-' + Date.now(),
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((st) => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        projectId,
        status,
        priority,
        assigneeId,
        dueDate,
        tags,
        subtasks,
      });
    } else {
      createTask({
        title: title.trim(),
        description: description.trim(),
        projectId,
        status,
        priority,
        assigneeId,
        dueDate,
        tags,
        subtasks,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {taskToEdit ? 'Modifier la Tâche' : 'Nouvelle Tâche'}
            </h2>
            <p className="text-xs text-slate-400">
              Renseignez les détails d’exécution et la checklist
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Titre de la tâche *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Intégrer les webhooks Stripe dans l’API"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Projet rattaché *
              </label>
              <select
                required
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Assigné à
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="in_review">En revue</option>
                <option value="done">Terminé</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date limite
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Critères d'acceptation, spécificités..."
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
            />
          </div>

          {/* Subtasks Checklist */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Sous-tâches & Critères ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </label>

            <div className="space-y-2 mb-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() =>
                        setSubtasks((prev) =>
                          prev.map((s) => (s.id === st.id ? { ...s, completed: !s.completed } : s))
                        )
                      }
                      className="accent-emerald-500 rounded"
                    />
                    <span className={st.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {st.title}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Ajouter une sous-tâche..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800/60 text-slate-300 text-sm font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {taskToEdit ? 'Enregistrer' : 'Créer la Tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
