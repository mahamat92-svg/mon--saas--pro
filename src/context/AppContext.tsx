'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Workspace,
  TeamMember,
  Project,
  Task,
  TaskStatus,
  Invoice,
  Activity,
  SubscriptionPlanId,
  ToastMessage,
  Role,
} from '@/types';
import {
  DEMO_USERS,
  INITIAL_WORKSPACES,
  INITIAL_MEMBERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_INVOICES,
  INITIAL_ACTIVITIES,
} from '@/lib/mockData';

export type NavView = 'dashboard' | 'projects' | 'tasks' | 'billing' | 'team' | 'settings';

interface StripeConfig {
  publishableKey: string;
  secretKeyMasked: string;
  isConfigured: boolean;
  webhookSecret: string;
}

interface AppContextType {
  // Auth
  currentUser: User;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  loginAsDemoUser: (user: User) => void;
  logout: () => void;

  // Workspaces
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspaceId: (id: string) => void;
  createWorkspace: (name: string, slug: string, logo: string, plan?: SubscriptionPlanId) => Workspace;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => boolean;

  // Projects
  projects: Project[];
  allProjects: Project[];
  createProject: (data: Omit<Project, 'id' | 'workspaceId' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Tasks
  tasks: Task[];
  createTask: (data: Omit<Task, 'id' | 'workspaceId' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteTask: (id: string) => void;

  // Invoices & Billing
  invoices: Invoice[];
  createInvoice: (data: Omit<Invoice, 'id' | 'workspaceId'>) => Invoice;
  payInvoice: (invoiceId: string) => void;
  changePlan: (newPlan: SubscriptionPlanId, interval: 'monthly' | 'yearly') => void;
  stripeConfig: StripeConfig;
  updateStripeConfig: (config: Partial<StripeConfig>) => void;

  // Team
  teamMembers: TeamMember[];
  inviteMember: (data: { name: string; email: string; role: Role; title: string }) => void;
  updateMemberRole: (memberId: string, role: Role) => void;
  removeMember: (memberId: string) => void;

  // Activities
  activities: Activity[];

  // Navigation & UI
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Reset
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'mon_saas_pro_';

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Safe LocalStorage helper
  const loadStorage = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  // State
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadStorage<User>('user', DEMO_USERS[0])
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadStorage<boolean>('is_auth', true)
  );

  const [workspaces, setWorkspaces] = useState<Workspace[]>(() =>
    loadStorage<Workspace[]>('workspaces', INITIAL_WORKSPACES)
  );

  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string>(() =>
    loadStorage<string>('active_ws_id', INITIAL_WORKSPACES[0].id)
  );

  const [allProjects, setAllProjects] = useState<Project[]>(() =>
    loadStorage<Project[]>('projects', INITIAL_PROJECTS)
  );

  const [allTasks, setAllTasks] = useState<Task[]>(() =>
    loadStorage<Task[]>('tasks', INITIAL_TASKS)
  );

  const [allInvoices, setAllInvoices] = useState<Invoice[]>(() =>
    loadStorage<Invoice[]>('invoices', INITIAL_INVOICES)
  );

  const [allMembers, setAllMembers] = useState<TeamMember[]>(() =>
    loadStorage<TeamMember[]>('members', INITIAL_MEMBERS)
  );

  const [allActivities, setAllActivities] = useState<Activity[]>(() =>
    loadStorage<Activity[]>('activities', INITIAL_ACTIVITIES)
  );

  const [stripeConfig, setStripeConfig] = useState<StripeConfig>(() =>
    loadStorage<StripeConfig>('stripe_config', {
      publishableKey: 'pk_test_51MzSaaSProLiveTestKey00918',
      secretKeyMasked: 'sk_test_••••••••••••••••••••••••94b2',
      isConfigured: true,
      webhookSecret: 'whsec_89dfb839a834bfa982348a',
    })
  );

  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent sync
  useEffect(() => {
    saveStorage('user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStorage('is_auth', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    saveStorage('workspaces', workspaces);
  }, [workspaces]);

  useEffect(() => {
    saveStorage('active_ws_id', activeWorkspaceId);
  }, [activeWorkspaceId]);

  useEffect(() => {
    saveStorage('projects', allProjects);
  }, [allProjects]);

  useEffect(() => {
    saveStorage('tasks', allTasks);
  }, [allTasks]);

  useEffect(() => {
    saveStorage('invoices', allInvoices);
  }, [allInvoices]);

  useEffect(() => {
    saveStorage('members', allMembers);
  }, [allMembers]);

  useEffect(() => {
    saveStorage('activities', allActivities);
  }, [allActivities]);

  useEffect(() => {
    saveStorage('stripe_config', stripeConfig);
  }, [stripeConfig]);

  // Derived current workspace
  const activeWorkspace =
    workspaces.find((ws) => ws.id === activeWorkspaceId) || workspaces[0] || INITIAL_WORKSPACES[0];

  // Filtered collections by active workspace
  const projects = allProjects.filter((p) => p.workspaceId === activeWorkspace.id);
  const tasks = allTasks.filter((t) => t.workspaceId === activeWorkspace.id);
  const invoices = allInvoices.filter((i) => i.workspaceId === activeWorkspace.id);
  const teamMembers = allMembers.filter((m) => m.workspaceId === activeWorkspace.id);
  const activities = allActivities.filter((a) => a.workspaceId === activeWorkspace.id);

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Activity logger
  const logActivity = (action: string, target: string, type: Activity['type']) => {
    const newAct: Activity = {
      id: 'act-' + Date.now(),
      workspaceId: activeWorkspace.id,
      user: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      action,
      target,
      timestamp: 'À l’instant',
      type,
    };
    setAllActivities((prev) => [newAct, ...prev]);
  };

  // Auth Methods
  const login = (email: string) => {
    const found = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      addToast({
        type: 'success',
        title: 'Connexion réussie',
        message: `Ravi de vous revoir, ${found.name} !`,
      });
      return true;
    }
    // Create new ad-hoc user
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0],
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'owner',
      title: 'Administrateur',
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    addToast({
      type: 'success',
      title: 'Bienvenue sur mon-saas-pro',
      message: `Compte créé avec succès pour ${email}`,
    });
    return true;
  };

  const loginAsDemoUser = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    addToast({
      type: 'info',
      title: 'Session profil changée',
      message: `Connecté en tant que ${user.name} (${user.title})`,
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast({
      type: 'info',
      title: 'Déconnexion effectuée',
      message: 'À très bientôt sur mon-saas-pro !',
    });
  };

  // Workspace Actions
  const setActiveWorkspaceId = (id: string) => {
    const ws = workspaces.find((w) => w.id === id);
    if (ws) {
      setActiveWorkspaceIdState(id);
      addToast({
        type: 'info',
        title: 'Workspace activé',
        message: `Vous êtes maintenant sur ${ws.name}`,
      });
    }
  };

  const createWorkspace = (
    name: string,
    slug: string,
    logo: string,
    plan: SubscriptionPlanId = 'pro'
  ): Workspace => {
    const newWs: Workspace = {
      id: 'ws-' + Date.now(),
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      logo: logo || '🏢',
      plan,
      billingInterval: 'monthly',
      status: 'active',
      memberCount: 1,
      currency: 'EUR',
      createdAt: new Date().toISOString().split('T')[0],
      ownerEmail: currentUser.email,
    };

    // Add current user as owner in members list
    const newMember: TeamMember = {
      id: 'mem-' + Date.now(),
      workspaceId: newWs.id,
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
      role: 'owner',
      title: currentUser.title,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setWorkspaces((prev) => [...prev, newWs]);
    setAllMembers((prev) => [...prev, newMember]);
    setActiveWorkspaceIdState(newWs.id);

    logActivity('a créé le workspace', newWs.name, 'workspace');
    addToast({
      type: 'success',
      title: 'Nouveau Workspace créé !',
      message: `Le workspace "${newWs.name}" est prêt.`,
    });
    return newWs;
  };

  const updateWorkspace = (id: string, updates: Partial<Workspace>) => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === id ? { ...ws, ...updates } : ws))
    );
    addToast({
      type: 'success',
      title: 'Workspace mis à jour',
      message: 'Les modifications ont été enregistrées.',
    });
  };

  const deleteWorkspace = (id: string): boolean => {
    if (workspaces.length <= 1) {
      addToast({
        type: 'error',
        title: 'Action impossible',
        message: 'Vous devez conserver au minimum un workspace.',
      });
      return false;
    }
    const wsToDelete = workspaces.find((w) => w.id === id);
    const remaining = workspaces.filter((w) => w.id !== id);
    setWorkspaces(remaining);
    setActiveWorkspaceIdState(remaining[0].id);

    addToast({
      type: 'info',
      title: 'Workspace supprimé',
      message: `Le workspace "${wsToDelete?.name}" a été retiré.`,
    });
    return true;
  };

  // Project Actions
  const createProject = (
    data: Omit<Project, 'id' | 'workspaceId' | 'createdAt'>
  ): Project => {
    const newProj: Project = {
      ...data,
      id: 'proj-' + Date.now(),
      workspaceId: activeWorkspace.id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAllProjects((prev) => [newProj, ...prev]);
    logActivity('a lancé le projet', newProj.name, 'project');
    addToast({
      type: 'success',
      title: 'Nouveau projet créé !',
      message: `"${newProj.name}" a été ajouté avec succès.`,
    });
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setAllProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast({
      type: 'success',
      title: 'Projet mis à jour',
      message: 'Les changements ont été enregistrés.',
    });
  };

  const deleteProject = (id: string) => {
    const proj = allProjects.find((p) => p.id === id);
    setAllProjects((prev) => prev.filter((p) => p.id !== id));
    setAllTasks((prev) => prev.filter((t) => t.projectId !== id));
    if (selectedProjectId === id) setSelectedProjectId(null);
    logActivity('a supprimé le projet', proj?.name || id, 'project');
    addToast({
      type: 'info',
      title: 'Projet supprimé',
      message: `Le projet a été retiré ainsi que ses tâches.`,
    });
  };

  // Task Actions
  const createTask = (
    data: Omit<Task, 'id' | 'workspaceId' | 'createdAt'>
  ): Task => {
    const newTask: Task = {
      ...data,
      id: 'task-' + Date.now(),
      workspaceId: activeWorkspace.id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAllTasks((prev) => [newTask, ...prev]);
    logActivity('a créé la tâche', newTask.title, 'task');
    addToast({
      type: 'success',
      title: 'Tâche créée',
      message: `"${newTask.title}" a été ajoutée au tableau.`,
    });
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setAllTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    addToast({
      type: 'success',
      title: 'Tâche mise à jour',
    });
  };

  const moveTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, status: newStatus };
          logActivity(
            `a changé le statut de "${t.title}" en`,
            newStatus === 'done' ? 'Terminé' : newStatus === 'in_progress' ? 'En cours' : newStatus === 'in_review' ? 'En revue' : 'À faire',
            'task'
          );
          return updated;
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    const task = allTasks.find((t) => t.id === id);
    setAllTasks((prev) => prev.filter((t) => t.id !== id));
    logActivity('a supprimé la tâche', task?.title || id, 'task');
    addToast({
      type: 'info',
      title: 'Tâche supprimée',
    });
  };

  // Invoices & Billing Actions
  const createInvoice = (data: Omit<Invoice, 'id' | 'workspaceId'>): Invoice => {
    const newInv: Invoice = {
      ...data,
      id: 'inv-' + Date.now(),
      workspaceId: activeWorkspace.id,
    };
    setAllInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const payInvoice = (invoiceId: string) => {
    setAllInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const updated: Invoice = {
            ...inv,
            status: 'paid',
            stripePaymentId: 'pi_' + Math.random().toString(36).substring(2, 10),
          };
          logActivity('a réglé la facture Stripe', `${inv.invoiceNumber} (${inv.amount} FCFA)`, 'billing');
          return updated;
        }
        return inv;
      })
    );
    addToast({
      type: 'success',
      title: 'Paiement Stripe confirmé !',
      message: `La facture a été acquittée avec succès.`,
    });
  };

  const changePlan = (newPlan: SubscriptionPlanId, interval: 'monthly' | 'yearly') => {
    const price = newPlan === 'starter' ? (interval === 'monthly' ? 29 : 24 * 12) : newPlan === 'pro' ? (interval === 'monthly' ? 15000 : 65 * 12) : (interval === 'monthly' ? 199 : 165 * 12);

    // Update workspace plan
    updateWorkspace(activeWorkspace.id, {
      plan: newPlan,
      billingInterval: interval,
    });

    // Generate new immediate Stripe Invoice
    const newInvoice: Invoice = {
      id: 'inv-' + Date.now(),
      workspaceId: activeWorkspace.id,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
      amount: price,
      currency: 'EUR',
      status: 'paid',
      planName: `Formule ${newPlan.toUpperCase()} (${interval === 'monthly' ? 'Mensuel' : 'Annuel'})`,
      stripePaymentId: 'pi_3P' + Math.random().toString(36).substring(2, 9),
      items: [
        {
          id: 'item-' + Date.now(),
          description: `Abonnement mon-saas-pro - Formule ${newPlan.toUpperCase()} (${interval === 'monthly' ? 'Mensuel' : 'Annuel'})`,
          qty: 1,
          unitPrice: price,
          amount: price,
        },
      ],
    };
    setAllInvoices((prev) => [newInvoice, ...prev]);

    logActivity('a mis à niveau le forfait vers', `${newPlan.toUpperCase()} (${interval})`, 'billing');
    addToast({
      type: 'success',
      title: 'Abonnement Stripe mis à jour !',
      message: `Votre workspace est désormais sur le forfait ${newPlan.toUpperCase()}.`,
    });
  };

  const updateStripeConfig = (updates: Partial<StripeConfig>) => {
    setStripeConfig((prev) => ({ ...prev, ...updates }));
    addToast({
      type: 'success',
      title: 'Configuration Stripe enregistrée',
      message: 'Les identifiants d’API ont été synchronisés.',
    });
  };

  // Team Actions
  const inviteMember = (data: { name: string; email: string; role: Role; title: string }) => {
    const newMem: TeamMember = {
      id: 'mem-' + Date.now(),
      workspaceId: activeWorkspace.id,
      name: data.name,
      email: data.email,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 100000000)}?w=150&auto=format&fit=crop&q=80`,
      role: data.role,
      title: data.title || 'Collaborateur',
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setAllMembers((prev) => [...prev, newMem]);
    updateWorkspace(activeWorkspace.id, { memberCount: teamMembers.length + 1 });
    logActivity('a invité un nouveau membre', `${data.name} (${data.role})`, 'team');
    addToast({
      type: 'success',
      title: 'Invitation envoyée !',
      message: `${data.name} a été ajouté à l'équipe.`,
    });
  };

  const updateMemberRole = (memberId: string, role: Role) => {
    setAllMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role } : m))
    );
    addToast({
      type: 'info',
      title: 'Rôle modifié',
      message: `Le rôle a été défini sur ${role}.`,
    });
  };

  const removeMember = (memberId: string) => {
    const mem = allMembers.find((m) => m.id === memberId);
    if (mem?.role === 'owner') {
      addToast({
        type: 'error',
        title: 'Action refusée',
        message: 'Impossible de retirer le Propriétaire du workspace.',
      });
      return;
    }
    setAllMembers((prev) => prev.filter((m) => m.id !== memberId));
    updateWorkspace(activeWorkspace.id, { memberCount: Math.max(1, teamMembers.length - 1) });
    addToast({
      type: 'info',
      title: 'Membre retiré',
      message: `${mem?.name} a été retiré de l'équipe.`,
    });
  };

  // Reset demo data
  const resetAllData = () => {
    setCurrentUser(DEMO_USERS[0]);
    setIsAuthenticated(true);
    setWorkspaces(INITIAL_WORKSPACES);
    setActiveWorkspaceIdState(INITIAL_WORKSPACES[0].id);
    setAllProjects(INITIAL_PROJECTS);
    setAllTasks(INITIAL_TASKS);
    setAllInvoices(INITIAL_INVOICES);
    setAllMembers(INITIAL_MEMBERS);
    setAllActivities(INITIAL_ACTIVITIES);
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    addToast({
      type: 'info',
      title: 'Données réinitialisées',
      message: 'L’environnement SaaS a été remis à neuf avec les données de démonstration.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        loginAsDemoUser,
        logout,

        workspaces,
        activeWorkspace,
        setActiveWorkspaceId,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,

        projects,
        allProjects,
        createProject,
        updateProject,
        deleteProject,

        tasks,
        createTask,
        updateTask,
        moveTaskStatus,
        toggleSubtask,
        deleteTask,

        invoices,
        createInvoice,
        payInvoice,
        changePlan,
        stripeConfig,
        updateStripeConfig,

        teamMembers,
        inviteMember,
        updateMemberRole,
        removeMember,

        activities,

        activeView,
        setActiveView,
        selectedProjectId,
        setSelectedProjectId,
        searchQuery,
        setSearchQuery,

        toasts,
        addToast,
        removeToast,

        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
