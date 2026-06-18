import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./TodoPage.css";

interface Task {
  id: string;
  title: string;
  description?: string;
  date?: string;
  project?: string;
  section: "Входящие" | "Сегодня" | "Предстоящие";
  completed: boolean;
}

export const TodoPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<string[]>(["Личное", "Работа"]);
  const [selectedView, setSelectedView] = useState<"Входящие" | "Сегодня" | "Предстоящие">("Входящие");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "", date: "", section: "Входящие" as "Входящие" | "Сегодня" | "Предстоящие" });
  const [showTemplates, setShowTemplates] = useState(false);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const { logout } = useAuth();

  const views: ("Входящие" | "Сегодня" | "Предстоящие")[] = ["Входящие", "Сегодня", "Предстоящие"];

  const getTasksForView = () => {
    let filtered = tasks;
    if (selectedProject) {
      filtered = filtered.filter(t => t.project === selectedProject);
    } else {
      filtered = filtered.filter(t => t.section === selectedView);
    }
    return filtered;
  };

  const currentTasks = getTasksForView();
  const currentTitle = selectedProject || selectedView;

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        date: newTask.date || new Date().toLocaleDateString("ru-RU"),
        project: selectedProject || undefined,
        section: newTask.section,
        completed: false,
      };
      setTasks([...tasks, task]);
      setNewTask({ title: "", description: "", date: "", section: "Входящие" });
      setIsAddingTask(false);
    }
  };

  const handleAddProject = () => {
    if (newProjectName.trim() && !projects.includes(newProjectName.trim())) {
      setProjects([...projects, newProjectName.trim()]);
      setNewProjectName("");
      setIsAddingProject(false);
    }
  };

  const handleDeleteProject = (project: string) => {
    if (window.confirm(`Удалить проект "${project}"?`)) {
      setProjects(projects.filter(p => p !== project));
      if (selectedProject === project) {
        setSelectedProject(null);
        setSelectedView("Входящие");
      }
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const moveTask = (taskId: string, newSection: "Входящие" | "Сегодня" | "Предстоящие") => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, section: newSection } : t
    ));
  };

  const handleDragStart = (taskId: string) => {
    setDraggingTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (section: "Входящие" | "Сегодня" | "Предстоящие") => {
    if (draggingTaskId) {
      moveTask(draggingTaskId, section);
      setDraggingTaskId(null);
    }
  };

  return (
    <div className="todo-app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Мои задачи</h2>
        </div>
        
        <div className="sidebar-nav">
          <div className="nav-section">
            {views.map(view => (
              <div
                key={view}
                className={`nav-item ${selectedView === view && !selectedProject ? "active" : ""}`}
                onClick={() => {
                  setSelectedView(view);
                  setSelectedProject(null);
                }}
              >
                {view}
              </div>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">ПРОЕКТЫ</div>
            {projects.map(project => (
              <div
                key={project}
                className={`nav-item ${selectedProject === project ? "active" : ""}`}
                onClick={() => {
                  setSelectedProject(project);
                }}
              >
                {project}
                <button
                  className="delete-project-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project);
                  }}
                  title="Удалить проект"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
            {!isAddingProject ? (
              <div
                className="nav-item add-project-btn"
                onClick={() => setIsAddingProject(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Добавить проект
              </div>
            ) : (
              <div className="add-project-form">
                <input
                  type="text"
                  placeholder="Название проекта"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="project-input"
                  autoFocus
                />
                <div className="add-project-actions">
                  <button className="save-project-btn" onClick={handleAddProject}>
                    Добавить
                  </button>
                  <button className="cancel-project-btn" onClick={() => {
                    setIsAddingProject(false);
                    setNewProjectName("");
                  }}>
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Выйти
        </button>
      </div>

      <div className="main-content">
        <div className="main-header">
          <h1>{currentTitle}</h1>
        </div>

        <div className="tasks-container">
          {currentTasks.length === 0 ? (
            <div className="empty-state">
              <p>Нет задач</p>
              <p className="empty-hint">Добавьте новую задачу ниже</p>
            </div>
          ) : (
            currentTasks.map(task => (
              <div 
                key={task.id} 
                className="task-item"
                draggable
                onDragStart={() => handleDragStart(task.id)}
                onDragEnd={handleDragEnd}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskComplete(task.id)}
                  className="task-checkbox"
                />
                <div className="task-content">
                  <div className={`task-title ${task.completed ? "completed" : ""}`}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="task-description">{task.description}</div>
                  )}
                  {task.date && (
                    <div className="task-date">{task.date}</div>
                  )}
                  {task.project && (
                    <div className="task-project">{task.project}</div>
                  )}
                  <div className="task-actions">
                    <select
                      value={task.section}
                      onChange={(e) => moveTask(task.id, e.target.value as "Входящие" | "Сегодня" | "Предстоящие")}
                      className="task-move-select"
                    >
                      <option value="Входящие">Входящие</option>
                      <option value="Сегодня">Сегодня</option>
                      <option value="Предстоящие">Предстоящие</option>
                    </select>
                  </div>
                </div>
                <button
                  className="task-delete"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))
          )}

          <div className="drop-zones">
            <div 
              className="drop-zone drop-zone-inbox"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop("Входящие")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                <polyline points="16 17 12 21 8 17"/>
                <line x1="12" y1="8" x2="12" y2="21"/>
                <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/>
              </svg>
              <span>Входящие</span>
            </div>
            <div 
              className="drop-zone drop-zone-today"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop("Сегодня")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <circle cx="12" cy="15" r="1"/>
                <circle cx="16" cy="15" r="1"/>
                <circle cx="8" cy="15" r="1"/>
              </svg>
              <span>Сегодня</span>
            </div>
            <div 
              className="drop-zone drop-zone-upcoming"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop("Предстоящие")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Предстоящие</span>
            </div>
          </div>
        </div>

        <div className="add-task-section">
          {!isAddingTask ? (
            <button className="add-task-btn" onClick={() => setIsAddingTask(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Добавить задачу
            </button>
          ) : (
            <div className="add-task-form">
              <input
                type="text"
                placeholder="Название задачи"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="task-input"
                autoFocus
              />
              <input
                type="text"
                placeholder="Описание"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="task-input"
              />
              <input
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                className="task-input"
              />
              <select
                value={newTask.section}
                onChange={(e) => setNewTask({ ...newTask, section: e.target.value as "Входящие" | "Сегодня" | "Предстоящие" })}
                className="task-select"
              >
                <option value="Входящие">Входящие</option>
                <option value="Сегодня">Сегодня</option>
                <option value="Предстоящие">Предстоящие</option>
              </select>
              <div className="add-task-actions">
                <button className="save-btn" onClick={handleAddTask}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Добавить задачу
                </button>
                <button className="cancel-btn" onClick={() => {
                  setIsAddingTask(false);
                  setNewTask({ title: "", description: "", date: "", section: "Входящие" });
                }}>
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="todo-footer">
          <button className="templates-btn" onClick={() => setShowTemplates(!showTemplates)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            Просмотр шаблонов
          </button>
        </div>
      </div>
    </div>
  );
};
