import { useState, useEffect } from 'react';

export const useProjects = () => {
  const [projects, setProjects] = useState<string[]>(() => {
    const saved = localStorage.getItem('todo_projects');
    return saved ? JSON.parse(saved) : ['Личное', 'Работа'];
  });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('todo_projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !projects.includes(trimmed)) {
      setProjects((prev) => [...prev, trimmed]);
      return true;
    }
    return false;
  };

  const deleteProject = (name: string) => {
    setProjects((prev) => prev.filter((p) => p !== name));
    if (selectedProject === name) {
      setSelectedProject(null);
    }
  };

  return {
    projects,
    selectedProject,
    setSelectedProject,
    addProject,
    deleteProject,
  };
};
