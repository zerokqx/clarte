import { useState } from "react";

interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  section: "Входящие" | "Сегодня" | "Предстоящие";
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      userId: "current-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted, updatedAt: new Date().toISOString() } : t
    ));
  };

  const moveTask = (id: string, section: "Входящие" | "Сегодня" | "Предстоящие") => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, section, updatedAt: new Date().toISOString() } : t
    ));
  };

  const getTasksBySection = (section: "Входящие" | "Сегодня" | "Предстоящие") => {
    return tasks.filter(t => t.section === section);
  };

  return {
    tasks,
    addTask,
    deleteTask,
    toggleComplete,
    moveTask,
    getTasksBySection,
  };
};
