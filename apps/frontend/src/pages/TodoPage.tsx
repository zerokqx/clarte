import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import { TaskItem } from "../components/TaskItem";
import "./TodoPage.css";

export const TodoPage = () => {
  const [selectedView, setSelectedView] = useState<"Входящие" | "Сегодня" | "Предстоящие">("Входящие");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    section: "Входящие" as "Входящие" | "Сегодня" | "Предстоящие"
  });
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const { logout } = useAuth();
  const { tasks, addTask, deleteTask, toggleComplete, moveTask, getTasksBySection } = useTasks();
  const { projects, selectedProject, setSelectedProject, addProject, deleteProject } = useProjects();

  const currentTasks = selectedProject
    ? tasks.filter(t => t.section === selectedView && t.title.includes(selectedProject))
    : getTasksBySection(selectedView);

  const currentTitle = selectedProject || selectedView;

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addTask({
        title: newTask.title,
        description: newTask.description || undefined,
        dueDate: newTask.dueDate || undefined,
        section: newTask.section,
        isCompleted: false,
      });
      setNewTask({ title: "", description: "", dueDate: "", section: "Входящие" });
      setIsAddingTask(false);
    }
  };

  const handleDragStart = (id: string) => setDraggingTaskId(id);
  const handleDragEnd = () => setDraggingTaskId(null);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (section: "Входящие" | "Сегодня" | "Предстоящие") => {
    if (draggingTaskId) {
      moveTask(draggingTaskId, section);
      setDraggingTaskId(null);
    }
  };

  return (
    <div className="todo-app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Мои задачи</h2>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section">
            {(["Входящие", "Сегодня", "Предстоящие"] as const).map(view => (
              <div
                key={view}
                className={`nav-item ${selectedView === view && !selectedProject ? "active" : ""}`}
                onClick={() => { setSelectedView(view); setSelectedProject(null); }}
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
                onClick={() => setSelectedProject(project)}
              >
                {project}
                <button
                  className="delete-project-btn"
                  onClick={(e) => { e.stopPropagation(); deleteProject(project); }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
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

      {/* Main Content */}
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
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleComplete}
                onDelete={deleteTask}
                onMove={moveTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))
          )}

          <div className="drop-zones">
            {(["Входящие", "Сегодня", "Предстоящие"] as const).map(section => (
              <div
                key={section}
                className="drop-zone"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(section)}
              >
                {section}
              </div>
            ))}
          </div>
        </div>

        {/* Add Task */}
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
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
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
                <button className="save-btn" onClick={handleAddTask}>Добавить задачу</button>
                <button className="cancel-btn" onClick={() => {
                  setIsAddingTask(false);
                  setNewTask({ title: "", description: "", dueDate: "", section: "Входящие" });
                }}>Отмена</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
