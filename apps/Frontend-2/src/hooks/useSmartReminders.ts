import { useEffect, useState, useMemo } from 'react';
import { Task } from './useTasks';

export interface ReminderStats {
  overdueCount: number;
  todayCount: number;
  overdueTasks: Task[];
  todayTasks: Task[];
}

export const useSmartReminders = (tasks: Task[]) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      setPermission(res);
      return res;
    }
    return 'default';
  };

  const stats = useMemo<ReminderStats>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks: Task[] = [];
    const todayTasks: Task[] = [];

    tasks.forEach((task) => {
      if (task.isCompleted) return;
      if (!task.dueDate) return;

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate.getTime() < today.getTime()) {
        overdueTasks.push(task);
      } else if (dueDate.getTime() === today.getTime()) {
        todayTasks.push(task);
      }
    });

    return {
      overdueCount: overdueTasks.length,
      todayCount: todayTasks.length,
      overdueTasks,
      todayTasks,
    };
  }, [tasks]);

  // Trigger desktop push notifications
  useEffect(() => {
    if (permission !== 'granted' || tasks.length === 0) return;

    const notifiedKeys: string[] = JSON.parse(
      localStorage.getItem('clarte_notified_tasks') || '[]'
    );
    const newNotifiedKeys = [...notifiedKeys];

    // Notification for today's tasks
    stats.todayTasks.forEach((task) => {
      const key = `today-${task.id}`;
      if (!notifiedKeys.includes(key)) {
        new Notification('📅 Clarte: Задача на сегодня', {
          body: task.title,
          icon: '/favicon.ico',
        });
        newNotifiedKeys.push(key);
      }
    });

    // Notification for overdue tasks
    stats.overdueTasks.forEach((task) => {
      const key = `overdue-${task.id}`;
      if (!notifiedKeys.includes(key)) {
        new Notification('⚠️ Clarte: Задача просрочена!', {
          body: task.title,
          icon: '/favicon.ico',
        });
        newNotifiedKeys.push(key);
      }
    });

    if (newNotifiedKeys.length !== notifiedKeys.length) {
      localStorage.setItem('clarte_notified_tasks', JSON.stringify(newNotifiedKeys));
    }
  }, [stats, permission, tasks]);

  return {
    permission,
    requestPermission,
    stats,
  };
};
