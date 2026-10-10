export type Role = 'owner' | 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  title: string;
}

export type SubscriptionPlanId = 'starter' | 'pro' | 'enterprise' | 'business';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string;
  plan: SubscriptionPlanId;
  billingInterval: 'monthly' | 'yearly';
  status: 'active' | 'trial' | 'past_due';
  memberCount: number;
  currency: 'EUR' | 'USD' | 'XAF';
  createdAt: string;
  stripeCustomerId?: string;
  ownerEmail: string;
}

export interface TeamMember {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  title: string;
  joinedAt: string;
  status: 'active' | 'invited';
}

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  client: string;
  status: ProjectStatus;
  priority: PriorityLevel;
  progress: number; // 0 to 100
  budget: number;
  spent: number;
  dueDate: string;
  teamIds: string[];
  tags: string[];
  createdAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: PriorityLevel;
  assigneeId: string;
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  createdAt: string;
}

export type InvoiceStatus = 'paid' | 'pending' | 'failed';

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  workspaceId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: 'EUR' | 'USD' | 'XAF';
  status: InvoiceStatus;
  planName: string;
  pdfUrl?: string;
  stripePaymentId?: string;
  items: InvoiceItem[];
}

export interface Activity {
  id: string;
  workspaceId: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: 'project' | 'task' | 'billing' | 'team' | 'workspace';
}

export interface PricingPlan {
  id: SubscriptionPlanId;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  maxProjects: number | 'Illimité';
  maxMembers: number | 'Illimité';
  popular?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
