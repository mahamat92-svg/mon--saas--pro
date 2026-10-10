'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Project, ProjectStatus } from '@/types';
import {
  FolderKanban,
  Plus,
  Search,
  Calendar,
  DollarSign,
  MoreVertical,
  CheckCircle2,
  Clock,
  Tag,
  ArrowRight,
  Trash2,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { ProjectDetailModal } from './ProjectDetailModal';

export function ProjectList() {
  const {
    projects,
    deleteProject,
    teamMembers,
    searchQuery,
    setSearchQuery,
    setSelectedProjectId,
    setActiveView,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [inspectProject, setInspectProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            En cours
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Terminé
          </span>
        );
      case 'on_hold':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            En pause
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Planification
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">Urgent</span>;
      case 'high':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Haute</span>;
      case 'medium':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Moyenne</span>;
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Basse</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action & filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tous', count: projects.length },
            { id: 'in_progress', label: 'En cours', count: projects.filter((p) => p.status === 'in_progress').length },
            { id: 'planning', label: 'Planifiés', count: projects.filter((p) => p.status === 'planning').length },
            { id: 'completed', label: 'Terminés', count: projects.filter((p) => p.status === 'completed').length },
            { id: 'on_hold', label: 'En pause', count: projects.filter((p) => p.status === 'on_hold').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* New Project Button */}
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Projet</span>
        </button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Aucun projet trouvé</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `Aucun projet ne correspond à "${searchQuery}".`
              : 'Commencez par ajouter votre premier projet pour ce workspace.'}
          </p>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Créer un projet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const assigned = teamMembers.filter((m) => project.teamIds.includes(m.id));

            return (
              <div
                key={project.id}
                className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 backdrop-blur-xl transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(project.status)}
                        {getPriorityBadge(project.priority)}
                      </div>
                      <h3
                        onClick={() => setInspectProject(project)}
                        className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer truncate"
                      >
                        {project.name}
                      </h3>
                      <div className="text-xs text-slate-400 truncate mt-0.5">
                        Client : <span className="text-slate-300 font-medium">{project.client}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setProjectToEdit(project)}
                        title="Modifier"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        title="Supprimer"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {project.description || 'Aucune description fournie.'}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Progression</span>
                      <span className="font-bold text-white">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${project.progress}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${project.progress >= 90
                            ? 'bg-emerald-500'
                            : project.progress >= 50
                              ? 'bg-indigo-500'
                              : 'bg-purple-500'
                          }`}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        #{tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[10px] text-slate-500">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  {/* Avatars */}
                  <div className="flex items-center -space-x-2">
                    {assigned.slice(0, 3).map((m) => (
                      <img
                        key={m.id}
                        src={m.avatar}
                        alt={m.name}
                        title={m.name}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-slate-900"
                      />
                    ))}
                    {assigned.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-slate-800 ring-2 ring-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-300">
                        +{assigned.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Budget</div>
                      <div className="text-xs font-bold text-white">
                        {project.spent.toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>

                    <button
                      onClick={() => setInspectProject(project)}
                      className="p-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isNewModalOpen || projectToEdit !== null}
        onClose={() => {
          setIsNewModalOpen(false);
          setProjectToEdit(null);
        }}
        projectToEdit={projectToEdit}
      />

      <ProjectDetailModal
        project={inspectProject}
        onClose={() => setInspectProject(null)}
        onEdit={(p) => setProjectToEdit(p)}
      />
    </div>
  );
}
