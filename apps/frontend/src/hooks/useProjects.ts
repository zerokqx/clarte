import { useState } from "react";

export const useProjects = () => {
  const [projects, setProjects] = useState<string[]>(["Личное", "Работа"]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const addProject = (name: string) => {
    if (name.trim() && !projects.includes(name.trim())) {
      setProjects((prev) => [...prev, name.trim()]);
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
