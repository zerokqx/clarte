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
      localStorage.setItem("clarte_tasks_cache", JSON.stringify(fetchedTasks));

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
      if (err.response?.status !== 503) {
        console.error(err);
      }
      
      // Fallback to localStorage cache
      let cached = localStorage.getItem("clarte_tasks_cache");
      if (!cached) {
        // Initialize cache with default mock tasks so the screen is never blank/broken
        const initialMockTasks = [
          {
            id: "welcome-task-1",
            title: "Добро пожаловать в Clarte! 👋",
            description: "Это ознакомительная задача. Вы можете отмечать задачи как выполненные, перемещать их и редактировать.",
            isCompleted: false,
            dueDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "welcome-task-2",
            title: "Изучить функциональную модель IDEF0 📂",
            description: "Посмотрите спецификацию IDEF0.md в корне проекта для ознакомления с архитектурой системы.",
            isCompleted: false,
            dueDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ];
        localStorage.setItem("clarte_tasks_cache", JSON.stringify(initialMockTasks));
        cached = JSON.stringify(initialMockTasks);
      }

      const fetchedTasks = JSON.parse(cached);
      const localMeta = JSON.parse(localStorage.getItem("todo_task_metadata") || "{}");
      const deletedIds: string[] = JSON.parse(localStorage.getItem("todo_deleted_ids") || "[]");

      const mappedTasks: Task[] = fetchedTasks
        .filter((t: any) => !deletedIds.includes(t.id))
        .map((t: any) => {
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
      setError("Автономный режим: Сервер задач недоступен. Отображаются локальные данные.");
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

      let newId: string;
      try {
        const response = await apiClient.post<{ id: string }>("/todos", payload);
        newId = response.data.id;
      } catch (apiErr: any) {
        console.warn("Ошибка при обращении к API, создание задачи локально:", apiErr);
        // Create offline task in local cache
        newId = `local-task-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
        const cached = localStorage.getItem("clarte_tasks_cache");
        const cachedTasks = cached ? JSON.parse(cached) : [];
        cachedTasks.push({
          id: newId,
          title: taskData.title,
          description: finalDesc,
          isCompleted: false,
          dueDate: dueDateIso,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        localStorage.setItem("clarte_tasks_cache", JSON.stringify(cachedTasks));
      }

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

    // Delete from cache as well
    const cached = localStorage.getItem("clarte_tasks_cache");
    if (cached) {
      const cachedTasks = JSON.parse(cached);
      const updated = cachedTasks.filter((t: any) => t.id !== id);
      localStorage.setItem("clarte_tasks_cache", JSON.stringify(updated));
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));

    // Async attempt to delete from server
    try {
      await apiClient.delete(`/todos/${id}`).catch(err => {
        console.warn("Удаление на сервере отложено: ", err);
      });
    } catch (err) {
      // Ignored since we deleted it locally
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newCompleted = !task.isCompleted;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: newCompleted } : t))
    );

    const cached = localStorage.getItem("clarte_tasks_cache");
    if (cached) {
      const cachedTasks = JSON.parse(cached);
      const updated = cachedTasks.map((t: any) => t.id === id ? { ...t, isCompleted: newCompleted } : t);
      localStorage.setItem("clarte_tasks_cache", JSON.stringify(updated));
    }

    try {
      await apiClient.patch(`/todos/${id}`, {
        is_completed: newCompleted,
      });
      await fetchTasks();
    } catch (err: any) {
      console.error(err);
      setError("Задача обновлена локально. Ошибка соединения с сервером.");
    }
  };

  const updateTaskTitle = async (id: string, title: string) => {
    if (!title.trim() || title.length < 10 || title.length > 50) {
      setError("Название должно быть от 10 до 50 символов");
      return;
    }

    // Update in local cache
    const cached = localStorage.getItem("clarte_tasks_cache");
    if (cached) {
      const cachedTasks = JSON.parse(cached);
      const updated = cachedTasks.map((t: any) => t.id === id ? { ...t, title: title.trim() } : t);
      localStorage.setItem("clarte_tasks_cache", JSON.stringify(updated));
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: title.trim() } : t))
    );

    try {
      await apiClient.patch(`/todos/${id}`, {
        title: title.trim(),
      });
      await fetchTasks();
    } catch (err: any) {
      console.error(err);
      setError("Название обновлено локально. Ошибка соединения с сервером.");
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
