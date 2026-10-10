'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Project, ProjectStatus, PriorityLevel } from '@/types';
import { X, FolderKanban, Sparkles } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export function ProjectModal({ isOpen, onClose, projectToEdit }: ProjectModalProps) {
  const { createProject, updateProject, teamMembers } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [budget, setBudget] = useState(25000);
  const [spent, setSpent] = useState(5000);
  const [progress, setProgress] = useState(40);
  const [dueDate, setDueDate] = useState('2026-11-30');
  const [tagsInput, setTagsInput] = useState('Next.js, Tailwind');
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
      setClient(projectToEdit.client);
      setStatus(projectToEdit.status);
      setPriority(projectToEdit.priority);
      setBudget(projectToEdit.budget);
      setSpent(projectToEdit.spent);
      setProgress(projectToEdit.progress);
      setDueDate(projectToEdit.dueDate);
      setTagsInput(projectToEdit.tags.join(', '));
      setSelectedTeamIds(projectToEdit.teamIds);
    } else {
      setName('');
      setDescription('');
      setClient('');
      setStatus('in_progress');
      setPriority('high');
      setBudget(20000);
      setSpent(0);
      setProgress(0);
      setDueDate('2026-12-15');
      setTagsInput('SaaS, Produit');
      setSelectedTeamIds(teamMembers.slice(0, 2).map((m) => m.id));
    }
  }, [projectToEdit, isOpen, teamMembers]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (projectToEdit) {
      updateProject(projectToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        client: client.trim() || 'Interne',
        status,
        priority,
        budget: Number(budget),
        spent: Number(spent),
        progress: Number(progress),
        dueDate,
        tags,
        teamIds: selectedTeamIds,
      });
    } else {
      createProject({
        name: name.trim(),
        description: description.trim(),
        client: client.trim() || 'Interne',
        status,
        priority,
        budget: Number(budget),
        spent: Number(spent),
        progress: Number(progress),
        dueDate,
        tags,
        teamIds: selectedTeamIds,
      });
    }

    onClose();
  };

  const toggleMember = (id: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {projectToEdit ? 'Modifier le Projet' : 'Nouveau Projet'}
            </h2>
            <p className="text-xs text-slate-400">
              Définissez les objectifs, le budget et assignez les membres
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nom du Projet *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Refonte Dashboard SaaS"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Client / Pôle
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Ex: Interne Acme, Client VIP..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Objectifs stratégiques, livrables attendus..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="planning">En planification</option>
                <option value="in_progress">En cours</option>
                <option value="on_hold">En pause</option>
                <option value="completed">Terminé</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date d’échéance
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Budget (FCFA)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Dépensé (€)
              </label>
              <input
                type="number"
                value={spent}
                onChange={(e) => setSpent(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Avancement ({progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full mt-3 accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: Next.js, Stripe, UI/UX"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Assigner des membres de l’équipe
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {teamMembers.map((m) => {
                const isSelected = selectedTeamIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMember(m.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-colors ${isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                  >
                    <img src={m.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <span className="text-xs font-medium truncate">{m.name}</span>
                  </button>
                );
              })}
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/25 flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {projectToEdit ? 'Enregistrer les modifications' : 'Créer le Projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
