// src/data/mockTasks.ts
import { Task } from '@/types/task';

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design the new dashboard interface',
    description: 'Create a modern and intuitive UI for the main dashboard, focusing on user experience.',
    priority: 'high',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
    progress: 75,
    tags: ['design', 'ui/ux'],
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Develop API for task management',
    description: 'Set up endpoints for creating, reading, updating, and deleting tasks.',
    priority: 'high',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
    progress: 40,
    tags: ['backend', 'api'],
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Write documentation for the Focus Mode feature',
    priority: 'medium',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
    progress: 10,
    tags: ['docs'],
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Review pull request for notification system',
    priority: 'low',
    progress: 90,
    tags: ['review', 'frontend'],
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];