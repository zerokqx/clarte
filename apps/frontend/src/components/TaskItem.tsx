import React from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  section: "Входящие" | "Сегодня" | "Предстоящие";
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, section: "Входящие" | "Сегодня" | "Предстоящие") => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onMove,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div
      className="task-item"
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
    >
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggle(task.id)}
        className="task-checkbox"
      />
      <div className="task-content">
        <div className={`task-title ${task.isCompleted ? "completed" : ""}`}>
          {task.title}
        </div>
        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
        {task.dueDate && (
          <div className="task-date">{new Date(task.dueDate).toLocaleDateString("ru-RU")}</div>
        )}
        <div className="task-actions">
          <select
            value={task.section}
            onChange={(e) => onMove(task.id, e.target.value as "Входящие" | "Сегодня" | "Предстоящие")}
            className="task-move-select"
          >
            <option value="Входящие">Входящие</option>
            <option value="Сегодня">Сегодня</option>
            <option value="Предстоящие">Предстоящие</option>
          </select>
        </div>
      </div>
      <button className="task-delete" onClick={() => onDelete(task.id)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
};
