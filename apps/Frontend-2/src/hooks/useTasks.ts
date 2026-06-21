import { useState, useEffect } from "react";
import { apiClient } from "../api/client";

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  section: "Входящие" | "Сегодня" | "Предстоящие";
  project?: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
  updatedAt: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<any[]>("/todos");
      const fetchedTasks = response.data || [];

      const localMeta = JSON.parse(localStorage.getItem("todo_task_metadata") || "{}");
      const deletedIds: string[] = JSON.parse(localStorage.getItem("todo_deleted_ids") || "[]");

      const mappedTasks: Task[] = fetchedTasks
        .filter((t) => !deletedIds.includes(t.id))
        .map((t) => {
          const meta = localMeta[t.id] || {};
          let section = meta.section;
          
          if (!section) {
            if (t.dueDate) {
              const taskDate = new Date(t.dueDate);
              taskDate.setHours(0, 0, 0, 0);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              if (taskDate.getTime() === today.getTime()) {
                section = "Сегодня";
              } else if (taskDate.getTime() > today.getTime()) {
                section = "Предстоящие";
              } else {
                section = "Входящие";
              }
            } else {
              section = "Входящие";
            }
          }

          return {
            id: t.id,
            title: t.title,
            description: t.description || "",
            isCompleted: t.isCompleted,
            dueDate: t.dueDate,
            section: section || "Входящие",
            project: meta.project || undefined,
            priority: meta.priority || "medium",
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
          };
        });

      setTasks(mappedTasks);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Не удалось загрузить задачи");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true);
    setError(null);
    try {
      let dueDateIso = "";
      if (taskData.dueDate) {
        const d = new Date(taskData.dueDate);
        d.setHours(23, 59, 59, 999);
        dueDateIso = d.toISOString();
      } else {
        const d = new Date();
        d.setHours(23, 59, 59, 999);
        dueDateIso = d.toISOString();
      }

      const rawDesc = taskData.description?.trim() || "";
      const finalDesc = rawDesc.length >= 10 ? rawDesc : "Описание отсутствует";

      const payload = {
        title: taskData.title,
        description: finalDesc,
        dueDate: dueDateIso,
      };

      const response = await apiClient.post<{ id: string }>("/todos", payload);
      const newId = response.data.id;

      const localMeta = JSON.parse(localStorage.getItem("todo_task_metadata") || "{}");
      localMeta[newId] = {
        section: taskData.section,
        project: taskData.project,
        priority: taskData.priority || "medium",
      };
      localStorage.setItem("todo_task_metadata", JSON.stringify(localMeta));

      await fetchTasks();
      return true;
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.details || err.response?.data?.message || err.message;
      setError(msg || "Не удалось добавить задачу");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    const deletedIds: string[] = JSON.parse(localStorage.getItem("todo_deleted_ids") || "[]");
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem("todo_deleted_ids", JSON.stringify(deletedIds));
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newCompleted = !task.isCompleted;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: newCompleted } : t))
    );

    try {
      await apiClient.patch(`/todos/${id}`, {
        is_completed: newCompleted,
      });
      await fetchTasks();
    } catch (err: any) {
      console.error(err);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isCompleted: !newCompleted } : t))
      );
      setError(err.response?.data?.message || err.message || "Не удалось обновить задачу");
    }
  };

  const updateTaskTitle = async (id: string, title: string) => {
    if (!title.trim() || title.length < 10 || title.length > 50) {
      setError("Название должно быть от 10 до 50 символов");
      return;
    }

    try {
      await apiClient.patch(`/todos/${id}`, {
        title: title.trim(),
      });
      await fetchTasks();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Не удалось переименовать задачу");
    }
  };

  const moveTask = (id: string, section: "Входящие" | "Сегодня" | "Предстоящие") => {
    const localMeta = JSON.parse(localStorage.getItem("todo_task_metadata") || "{}");
    if (!localMeta[id]) localMeta[id] = {};
    localMeta[id].section = section;
    localStorage.setItem("todo_task_metadata", JSON.stringify(localMeta));

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, section } : t))
    );
  };

  const moveTaskToProject = (id: string, project: string | undefined) => {
    const localMeta = JSON.parse(localStorage.getItem("todo_task_metadata") || "{}");
    if (!localMeta[id]) localMeta[id] = {};
    localMeta[id].project = project;
    localStorage.setItem("todo_task_metadata", JSON.stringify(localMeta));

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, project } : t))
    );
  };

  const updateTaskPriority = (id: string, priority: "high" | "medium" | "low") => {
    const localMeta = JSON.parse(localStorage.getItem("todo_task_metadata") || "{}");
    if (!localMeta[id]) localMeta[id] = {};
    localMeta[id].priority = priority;
    localStorage.setItem("todo_task_metadata", JSON.stringify(localMeta));

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t))
    );
  };

  return {
    tasks,
    isLoading,
    error,
    addTask,
    deleteTask,
    toggleComplete,
    moveTask,
    moveTaskToProject,
    updateTaskTitle,
    updateTaskPriority,
    refreshTasks: fetchTasks,
  };
};
