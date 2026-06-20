import React from "react";
import { Paper, Group, ActionIcon, Menu, TextInput } from "@mantine/core";
import {
  IconCheck,
  IconTrash,
  IconArrowsSort,
  IconCalendar,
  IconFolder,
  IconInbox,
  IconClock,
} from "@tabler/icons-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  section: "Входящие" | "Сегодня" | "Предстоящие";
  project?: string;
}

interface TaskItemProps {
  task: Task;
  projects: string[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, section: "Входящие" | "Сегодня" | "Предстоящие") => void;
  onMoveToProject: (id: string, project: string | undefined) => void;
  onStartEditing: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  editingTaskId: string | null;
  isCompleted: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  projects,
  onToggle,
  onDelete,
  onMove,
  onMoveToProject,
  onStartEditing,
  onUpdateTitle,
  onDragStart,
  onDragEnd,
  isDragging,
  editingTaskId,
  isCompleted,
}) => {
  return (
    <Paper
      className={`task-item ${isCompleted ? "completed" : ""} ${isDragging ? "dragging" : ""}`}
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      withBorder
    >
      <Group align="flex-start" gap={12} style={{ flex: 1, minWidth: 0 }}>
        <ActionIcon
          variant="subtle"
          color={isCompleted ? "green" : "gray"}
          onClick={() => onToggle(task.id)}
          className="task-checkbox"
        >
          <IconCheck size={18} stroke={2} />
        </ActionIcon>

        <div className="task-content">
          {editingTaskId === task.id ? (
            <TextInput
              defaultValue={task.title}
              autoFocus
              onBlur={(e) => onUpdateTitle(task.id, e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onUpdateTitle(task.id, e.currentTarget.value);
                }
                if (e.key === "Escape") {
                  onStartEditing("");
                }
              }}
              size="xs"
            />
          ) : (
            <div
              className={`task-title ${isCompleted ? "completed" : ""}`}
              onDoubleClick={() => onStartEditing(task.id)}
            >
              {task.title}
            </div>
          )}
          {task.description && <div className="task-description">{task.description}</div>}
          <div className="task-meta">
            {task.dueDate && (
              <span className="task-meta-item">
                <IconCalendar size={12} stroke={1.5} />
                {new Date(task.dueDate).toLocaleDateString("ru-RU")}
              </span>
            )}
            {task.project && (
              <span className="task-meta-item task-project">
                <IconFolder size={12} stroke={1.5} />
                {task.project}
              </span>
            )}
            <span className="task-section-badge">{task.section}</span>
          </div>
        </div>
      </Group>

      <Group gap={4} style={{ flexShrink: 0 }}>
        <Menu shadow="md" position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon variant="subtle" size="sm">
              <IconArrowsSort size={16} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Переместить в</Menu.Label>
            <Menu.Item leftSection={<IconInbox size={14} />} onClick={() => onMove(task.id, "Входящие")}>
              Входящие
            </Menu.Item>
            <Menu.Item leftSection={<IconCalendar size={14} />} onClick={() => onMove(task.id, "Сегодня")}>
              Сегодня
            </Menu.Item>
            <Menu.Item leftSection={<IconClock size={14} />} onClick={() => onMove(task.id, "Предстоящие")}>
              Предстоящие
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>Проект</Menu.Label>
            {projects.map((p) => (
              <Menu.Item
                key={p}
                leftSection={<IconFolder size={14} />}
                onClick={() => onMoveToProject(task.id, p)}
              >
                {p}
              </Menu.Item>
            ))}
            <Menu.Item leftSection={<IconFolder size={14} />} onClick={() => onMoveToProject(task.id, undefined)}>
              Без проекта
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <ActionIcon variant="subtle" color="red" onClick={() => onDelete(task.id)}>
          <IconTrash size={16} stroke={1.5} />
        </ActionIcon>
      </Group>
    </Paper>
  );
};
