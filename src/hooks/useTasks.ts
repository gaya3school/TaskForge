import { useState, useEffect } from 'react';
import { Task, Priority, PermissionLevel } from '@/types/task'; // 1. Import new types
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebaseConfig';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
  where
} from "firebase/firestore";

// Firestore type
type FirestoreTask = Omit<Task, 'id' | 'dueDate' | 'createdAt' | 'updatedAt'> & {
  dueDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setTasks([]);
      return;
    }

    setLoading(true);

    // 2. This is the new query!
    // Get all tasks from the top-level 'tasks' collection...
    const collectionRef = collection(db, 'tasks');

    // ...where the user's ID is present in the 'roles' map.
    // This single query gets tasks YOU OWN and tasks SHARED WITH YOU.
    const q = query(collectionRef, where(`roles.${user.uid}`, 'in', ['owner', 'manager', 'editor', 'viewer']));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksFromFirestore: Task[] = snapshot.docs.map((doc) => {
        const data = doc.data() as FirestoreTask;
        return {
          id: doc.id,
          ...data,
          dueDate: data.dueDate?.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      });

      setTasks(tasksFromFirestore);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // --- DATABASE FUNCTIONS (Now point to /tasks) ---

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'roles'>) => {
    if (!user) return;

    // 3. Create the new task in the top-level 'tasks' collection
    const collectionRef = collection(db, 'tasks');

    const { dueDate, ...restOfTaskData } = taskData;

    const dataToSave = {
      ...restOfTaskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...(dueDate && { dueDate: Timestamp.fromDate(dueDate) }),

      // 4. Set the creator as the 'owner' in the roles map
      roles: {
        [user.uid]: 'owner' as PermissionLevel,
      }
    };

    await addDoc(collectionRef, dataToSave);
  };

  const editTask = async (taskId: string, updates: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'roles'>) => {
    if (!user) return;

    // 5. Update the doc in the top-level 'tasks' collection
    const docRef = doc(db, 'tasks', taskId);

    // remove dueDate if it's undefined, otherwise convert to Timestamp
    const { dueDate, ...restOfTaskData } = updates;
    const dataToSave: any = {
      ...restOfTaskData,
      updatedAt: serverTimestamp(),
    };

    if (dueDate) {
      dataToSave.dueDate = Timestamp.fromDate(dueDate);
    } else {
      // If dueDate is explicitly set to undefined or null, you might want to remove it
      // Or handle it as needed. For now, we'll just not add it if it's not present.
      // If you want to *delete* a date, you'd need special handling.
    }

    await updateDoc(docRef, dataToSave);
  };

  const completeTask = async (taskId: string) => {
    if (!user) return;

    const taskToComplete = tasks.find(t => t.id === taskId);
    if (!taskToComplete) return;

    const newCompletedStatus = !taskToComplete.completed;
    const docRef = doc(db, 'tasks', taskId);

    await updateDoc(docRef, {
      completed: newCompletedStatus,
      progress: newCompletedStatus ? 100 : 0,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return;
    const docRef = doc(db, 'tasks', taskId);
    await deleteDoc(docRef);
  };

  // 6. We'll add this function in the next step
  const updateTaskRoles = async (taskId: string, newRoles: Record<string, PermissionLevel>) => {
    if (!user) return;
    const docRef = doc(db, 'tasks', taskId);
    await updateDoc(docRef, {
      roles: newRoles,
      updatedAt: serverTimestamp(),
    });
  };

  return {
    tasks,
    loading,
    addTask,
    editTask,
    completeTask,
    deleteTask,
    updateTaskRoles // 7. Export the new function
  };
}