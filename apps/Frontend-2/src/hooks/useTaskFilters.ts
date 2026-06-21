import { useMemo } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  section: 'Входящие' | 'Сегодня' | 'Предстоящие';
  project?: string;
  createdAt: string;
  updatedAt: string;
}

export const useTaskFilters = (
  tasks: Task[],
  selectedView: 'Входящие' | 'Сегодня' | 'Предстоящие',
  selectedProject: string | null,
  searchQuery: string,
  filterStatus: 'all' | 'active' | 'completed',
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

    return filtered;
  }, [tasks, selectedView, selectedProject, searchQuery, filterStatus]);
};
