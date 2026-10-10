'use client';

import React, { useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { TaskListView } from './TaskListView';
import { LayoutGrid, List } from 'lucide-react';

export function TasksView() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  return (
    <div className="space-y-4">
      {/* View switch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tableau Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Vue Liste</span>
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? <KanbanBoard /> : <TaskListView />}
    </div>
  );
}
