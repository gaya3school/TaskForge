// src/hooks/useTasks.ts

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';

// Using the mock data from your Home.tsx as a fallback for first-time users
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review quarterly budget proposals',
    description: 'Analyze Q4 budget allocations and prepare recommendations for the board meeting.',
    priority: 'high',
    dueDate: new Date('2025-12-25'),
    estimatedHours: 3,
    progress: 75,
    tags: ['finance', 'urgent'],
    completed: false,
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2025-12-23'),
  },
  {
    id: '2',
    title: 'Update project documentation',
    description: 'Revise API documentation and user guides for the new feature release.',
    priority: 'medium',
    dueDate: new Date('2025-12-26'),
    estimatedHours: 2,
    progress: 30,
    tags: ['documentation', 'api'],
    completed: false,
    createdAt: new Date('2025-12-21'),
    updatedAt: new Date('2025-12-23'),
  },
  // Add the rest of your mock tasks here
];

const TASKS_STORAGE_KEY = 'taskforge-tasks';

// These helper functions correctly handle converting Date objects to strings for storage
const jsonReplacer = (key: string, value: unknown) => {
  if (['dueDate', 'createdAt', 'updatedAt'].includes(key) && value) {
    return new Date(value as string | number | Date).toISOString();
  }
  return value;
};

const jsonReviver = (key: string, value: unknown) => {
  if (['dueDate', 'createdAt', 'updatedAt'].includes(key) && value) {
    return new Date(value as string | number | Date);
  }
  return value;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        return JSON.parse(storedTasks, jsonReviver);
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
    }
    return initialTasks; // Load initial data if storage is empty
  });

  // This effect runs every time the `tasks` state changes, saving it to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks, jsonReplacer));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }
  }, [tasks]);

  const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const completeTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed, progress: 100, updatedAt: new Date() }
          : task
      )
    );
  };

  // --- THIS IS THE NEW FUNCTION (NOW COMPLETE) ---
  const editTask = (taskId: string, updates: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() } // This line was incomplete
          : task
      )
    );
  };

  // --- THIS IS THE MISSING RETURN STATEMENT ---
  return { tasks, addTask, completeTask, editTask };
}