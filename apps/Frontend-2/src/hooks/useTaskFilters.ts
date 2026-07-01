import { useMemo } from 'react';
import { type Task } from './useTasks';

export const useTaskFilters = (
  tasks: Task[],
  selectedView: 'Входящие' | 'Сегодня' | 'Предстоящие',
  selectedProject: string | null,
  searchQuery: string,
  filterStatus: 'all' | 'active' | 'completed',
  filterPriority: 'all' | 'high' | 'medium' | 'low' = 'all',
) => {
  return useMemo(() => {
    let filtered = tasks;

    if (selectedProject) {
      filtered = filtered.filter((t) => t.project === selectedProject);
    } else {
      filtered = filtered.filter((t) => t.section === selectedView);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filterStatus === 'active') {
      filtered = filtered.filter((t) => !t.isCompleted);
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter((t) => t.isCompleted);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }

    return filtered;
  }, [tasks, selectedView, selectedProject, searchQuery, filterStatus, filterPriority]);
};
