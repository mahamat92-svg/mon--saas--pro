'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { ProjectList } from '@/components/projects/ProjectList';
import { TasksView } from '@/components/tasks/TasksView';
import { BillingView } from '@/components/billing/BillingView';
import { TeamMemberList } from '@/components/team/TeamMemberList';
import { WorkspaceSettings } from '@/components/settings/WorkspaceSettings';
import { AuthModal } from '@/components/auth/AuthModal';
import { ToastContainer } from '@/components/ui/Toast';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { TaskModal } from '@/components/tasks/TaskModal';
import { InviteMemberModal } from '@/components/team/InviteMemberModal';

export default function Home() {
  const { isAuthenticated, activeView } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global modal states
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer />
        <AuthModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Main App Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
          <Header
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
            onOpenInviteMember={() => setIsInviteMemberModalOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeView === 'dashboard' && (
              <DashboardView
                onOpenNewProject={() => setIsNewProjectModalOpen(true)}
                onOpenNewTask={() => setIsNewTaskModalOpen(true)}
                onOpenInviteMember={() => setIsInviteMemberModalOpen(true)}
              />
            )}

            {activeView === 'projects' && <ProjectList />}

            {activeView === 'tasks' && <TasksView />}

            {activeView === 'billing' && <BillingView />}

            {activeView === 'team' && <TeamMemberList />}

            {activeView === 'settings' && <WorkspaceSettings />}
          </main>
        </div>
      </div>

      {/* Global Quick Action Modals */}
      <ProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />

      <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />

      <InviteMemberModal
        isOpen={isInviteMemberModalOpen}
        onClose={() => setIsInviteMemberModalOpen(false)}
      />
    </div>
  );
}
