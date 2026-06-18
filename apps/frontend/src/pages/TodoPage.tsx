import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./TodoPage.css";

interface Task {
  id: string;
  title: string;
  description?: string;
  date?: string;
  project?: string;
  completed: boolean;
}

export const TodoPage = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "вававававава", description: "вававававава", date: "11/11/1111", project: "Личное", completed: false },
    { id: "2", title: "вававававава", description: "вававававава", date: "Invalid Date", project: "Личное", completed: false },
  ]);
  const [selectedView, setSelectedView] = useState("Личное");
  const [selectedProject, setSelectedProject] = useState<string | null>("Личное");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", date: "" });
  const [showTemplates, setShowTemplates] = useState(false);
  const { logout } = useAuth();

  const views = ["Входящие", "Сегодня", "Предстоящие"];
  const projects = ["Личное", "Работа"];

  const getTasksForView = () => {
    if (selectedProject) {
      return tasks.filter(t => t.project === selectedProject);
    }
    return tasks;
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
        completed: false,
      };
      setTasks([...tasks, task]);
      setNewTask({ title: "", description: "", date: "" });
      setIsAddingTask(false);
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

  return (
    <div className="todo-app">
      {/* Боковое меню */}
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
                  setSelectedView(project);
                }}
              >
                {project}
              </div>
            ))}
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

      {/* Основная область */}
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
              <div key={task.id} className="task-item">
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
        </div>

        {/* Добавление задачи */}
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
              <div className="add-task-actions">
                <button className="save-btn" onClick={handleAddTask}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Добавить задачу
                </button>
                <button className="cancel-btn" onClick={() => {
                  setIsAddingTask(false);
                  setNewTask({ title: "", description: "", date: "" });
                }}>
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Футер с шаблонами */}
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
