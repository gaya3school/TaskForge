// src/types/task.ts

export type Priority = 'low' | 'medium' | 'high';
export type PermissionLevel = 'owner' | 'manager' | 'editor' | 'viewer';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date;
  estimatedHours?: number;
  progress: number;
  tags: string[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: Record<string, PermissionLevel>;
}

export interface ProductivityMetrics {
  weeklyScore: number;
  completionRatio: number;
  tasksCompleted: number;
  tasksAdded: number;
  focusSessions: number;
  averageSessionLength: number; // in minutes
  totalFocusTime: number; // in minutes
  streak: number;
}