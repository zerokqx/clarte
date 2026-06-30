import React, { useState } from "react";
import { Paper, Group, ActionIcon, Menu, TextInput, Badge, Modal, Button, Textarea, Stack, Text, Tooltip, Box } from "@mantine/core";
import {
  IconCheck,
  IconTrash,
  IconArrowsSort,
  IconCalendar,
  IconFolder,
  IconInbox,
  IconClock,
  IconFlag,
  IconEdit,
  IconPaperclip,
} from "@tabler/icons-react";
import { SerializedAttachment, fileToBase64, compressImage } from "../utils/mediaSerializer";
import { MediaAttachmentList } from "./MediaAttachmentList";

interface Task {
  id: string;
  title: string;
  description?: string;
  cleanDescription?: string;
  attachments?: SerializedAttachment[];
  isCompleted: boolean;
  dueDate?: string;
  section: "Входящие" | "Сегодня" | "Предстоящие";
  project?: string;
  priority: "high" | "medium" | "low";
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
  onUpdateDescription: (id: string, cleanDesc: string, attachments: SerializedAttachment[]) => void;
  onUpdatePriority: (id: string, priority: "high" | "medium" | "low") => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  editingTaskId: string | null;
  isCompleted: boolean;
}

const priorityColors = {
  high: "red",
  medium: "orange",
  low: "gray",
};

const priorityLabels = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  projects,
  onToggle,
  onDelete,
  onMove,
  onMoveToProject,
  onStartEditing,
  onUpdateTitle,
  onUpdateDescription,
  onUpdatePriority,
  onDragStart,
  onDragEnd,
  isDragging,
  editingTaskId,
  isCompleted,
}) => {
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [localTitle, setLocalTitle] = useState(task.title);
  const [localDesc, setLocalDesc] = useState(task.cleanDescription || task.description || "");
  const [localAttachments, setLocalAttachments] = useState<SerializedAttachment[]>(task.attachments || []);

  const handleOpenDetails = () => {
    setLocalTitle(task.title);
    setLocalDesc(task.cleanDescription || (task.description === "Описание отсутствует" ? "" : task.description) || "");
    setLocalAttachments(task.attachments || []);
    setDetailsOpened(true);
  };

  const handleSave = () => {
    if (localTitle.trim()) {
      onUpdateTitle(task.id, localTitle.trim());
    }
    onUpdateDescription(task.id, localDesc, localAttachments);
    setDetailsOpened(false);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          try {
            const compressedBlob = await compressImage(file);
            const compressedFile = new File([compressedBlob], `Вставка-${Date.now()}.jpg`, { type: "image/jpeg" });
            
            if (compressedFile.size > 1.5 * 1024 * 1024) {
              alert("Размер вставляемого изображения превышает лимит 1.5 МБ.");
              return;
            }

            const base64Data = await fileToBase64(compressedFile);
            const newAttachment: SerializedAttachment = {
              id: `media-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`,
              name: compressedFile.name,
              type: compressedFile.type,
              size: compressedFile.size,
              data: base64Data,
            };

            setLocalAttachments((prev) => [...prev, newAttachment]);
          } catch (err) {
            console.error("Failed to process pasted image:", err);
          }
        }
      }
    }
  };

  return (
    <Paper
      className={`task-item priority-${task.priority || "medium"} ${isCompleted ? "completed" : ""} ${isDragging ? "dragging" : ""}`}
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
          {task.cleanDescription && task.cleanDescription !== "Описание отсутствует" && (
            <div className="task-description">{task.cleanDescription}</div>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <div style={{ marginTop: "8px" }} onClick={(e) => e.stopPropagation()}>
              <MediaAttachmentList
                attachments={task.attachments}
                onAttachmentsChange={() => {}}
                readOnly
              />
            </div>
          )}

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
            <Badge size="xs" variant="light" color={priorityColors[task.priority || "medium"]}>
              {priorityLabels[task.priority || "medium"]}
            </Badge>
            {task.attachments && task.attachments.length > 0 && (
              <span className="task-meta-item" style={{ color: "#4f46e5", fontWeight: 600 }}>
                <IconPaperclip size={12} stroke={1.5} />
                {task.attachments.length}
              </span>
            )}
            <span className="task-section-badge">{task.section}</span>
          </div>
        </div>
      </Group>

      <Group gap={4} style={{ flexShrink: 0 }}>
        <Tooltip label="Редактировать и добавить файлы">
          <ActionIcon variant="subtle" color="indigo" onClick={handleOpenDetails}>
            <IconEdit size={16} stroke={1.5} />
          </ActionIcon>
        </Tooltip>

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
            <Menu.Divider />
            <Menu.Label>Приоритет</Menu.Label>
            <Menu.Item leftSection={<IconFlag size={14} />} color="red" onClick={() => onUpdatePriority(task.id, "high")}>
              Высокий
            </Menu.Item>
            <Menu.Item leftSection={<IconFlag size={14} />} color="orange" onClick={() => onUpdatePriority(task.id, "medium")}>
              Средний
            </Menu.Item>
            <Menu.Item leftSection={<IconFlag size={14} />} color="gray" onClick={() => onUpdatePriority(task.id, "low")}>
              Низкий
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <ActionIcon variant="subtle" color="red" onClick={() => onDelete(task.id)}>
          <IconTrash size={16} stroke={1.5} />
        </ActionIcon>
      </Group>

      <Modal
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
        title="Детали и вложения задачи"
        centered
        size="md"
        radius="md"
      >
        <Stack gap="md" onPaste={handlePaste}>
          <TextInput
            label="Название"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.currentTarget.value)}
            placeholder="Название задачи"
            required
          />

          <Textarea
            label="Описание"
            value={localDesc}
            onChange={(e) => setLocalDesc(e.currentTarget.value)}
            placeholder="Опишите подробности задачи..."
            rows={4}
          />

          <Box>
            <Text size="xs" fw={700} mb={5}>Вложения (фото, видео, аудио):</Text>
            <MediaAttachmentList
              attachments={localAttachments}
              onAttachmentsChange={setLocalAttachments}
            />
          </Box>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setDetailsOpened(false)}>
              Отмена
            </Button>
            <Button color="indigo" onClick={handleSave} disabled={!localTitle.trim()}>
              Сохранить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Paper>
  );
};
