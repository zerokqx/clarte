import React, { useState, useRef } from "react";
import {
  Box,
  TextInput,
  Button,
  Select,
  Modal,
  Badge,
  Stack,
  Group,
  ScrollArea,
  Text,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { z } from "zod";
import {
  IconPlus,
  IconTrash,
  IconFolder,
  IconFolderPlus,
  IconSearch,
  IconCalendar,
  IconClock,
  IconInbox,
  IconListCheck,
  IconLogout,
} from "@tabler/icons-react";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { TaskItem } from "../components/TaskItem";
import "./TodoPage.css";

const taskSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  section: z.enum(["Входящие", "Сегодня", "Предстоящие"]),
  project: z.string().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

const views: ("Входящие" | "Сегодня" | "Предстоящие")[] = ["Входящие", "Сегодня", "Предстоящие"];

export const TodoPage = () => {
  const { logout } = useAuth();
  const { tasks, addTask, deleteTask, toggleComplete, moveTask, moveTaskToProject, updateTaskTitle } =
    useTasks();
  const { projects, selectedProject, setSelectedProject, addProject, deleteProject } = useProjects();

  const [selectedView, setSelectedView] = useState<"Входящие" | "Сегодня" | "Предстоящие">("Входящие");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTasks = useTaskFilters(
    tasks,
    selectedView,
    selectedProject,
    searchQuery,
    filterStatus
  );

  const form = useForm<TaskForm>({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      dueDate: "",
      section: "Входящие",
      project: "",
    },
    validate: {
      title: (value) => {
        const result = taskSchema.shape.title.safeParse(value);
        return result.success ? null : result.error.errors[0].message;
      },
      section: (value) => {
        const result = taskSchema.shape.section.safeParse(value);
        return result.success ? null : result.error.errors[0].message;
      },
    },
  });

  const currentTitle = selectedProject || selectedView;

  const handleAddTask = (values: TaskForm) => {
    addTask({
      title: values.title,
      description: values.description || undefined,
      dueDate: values.dueDate || undefined,
      section: values.section,
      project: values.project || selectedProject || undefined,
      isCompleted: false,
    });
    form.reset();
    setIsAddingTask(false);
    close();
  };

  const handleAddProject = () => {
    if (addProject(newProjectName)) {
      setNewProjectName("");
      setIsAddingProject(false);
    }
  };

  const handleDeleteProject = (project: string) => {
    if (window.confirm(`Удалить проект "${project}"?`)) {
      deleteProject(project);
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

  const getProjectTasksCount = (project: string) => {
    return tasks.filter((t) => t.project === project).length;
  };

  const viewIcons = {
    Входящие: <IconInbox size={18} stroke={1.5} />,
    Сегодня: <IconCalendar size={18} stroke={1.5} />,
    Предстоящие: <IconClock size={18} stroke={1.5} />,
  };

  return (
    <div className="todo-app">
      <div className="sidebar">
        <div className="logo">
          <IconListCheck size={28} stroke={1.5} />
          <Text size="lg" fw={700}>Мои задачи</Text>
        </div>
        <Box mt="md">
          <TextInput
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            size="xs"
            radius="md"
          />
        </Box>

        <Box mt="md" className="sidebar-nav">
          {views.map((view) => (
            <div
              key={view}
              className={`nav-item ${selectedView === view && !selectedProject ? "active" : ""}`}
              onClick={() => {
                setSelectedView(view);
                setSelectedProject(null);
              }}
            >
              {viewIcons[view]}
              <span>{view}</span>
            </div>
          ))}

          <Divider my="md" />

          <Text size="xs" fw={600} color="gray.5" tt="uppercase" px="xs" mb="xs">
            ПРОЕКТЫ
          </Text>

          {projects.map((project) => (
            <div
              key={project}
              className={`nav-item ${selectedProject === project ? "active" : ""}`}
              onClick={() => setSelectedProject(project)}
            >
              <IconFolder size={16} stroke={1.5} />
              <span>{project}</span>
              <Badge size="xs" variant="light" color="gray" ml="auto">
                {getProjectTasksCount(project)}
              </Badge>
              <div
                className="delete-project-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project);
                  if (selectedProject === project) {
                    setSelectedProject(null);
                    setSelectedView("Входящие");
                  }
                }}
              >
                <IconTrash size={12} />
              </div>
            </div>
          ))}

          <div className="add-project-btn" onClick={() => setIsAddingProject(!isAddingProject)}>
            <IconFolderPlus size={16} stroke={1.5} />
            <span>Добавить проект</span>
          </div>

          {isAddingProject && (
            <div className="add-project-form">
              <TextInput
                placeholder="Название проекта"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.currentTarget.value)}
                size="xs"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
              />
              <div className="add-project-actions">
                <Button size="xs" onClick={handleAddProject}>Добавить</Button>
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => {
                    setIsAddingProject(false);
                    setNewProjectName("");
                  }}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </Box>

        <Button
          fullWidth
          variant="subtle"
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={logout}
          justify="flex-start"
          mt="auto"
        >
          Выйти
        </Button>
      </div>

      <div className="main-content">
        <div className="main-header">
          <Text size="28px" fw={700}>{currentTitle}</Text>
          <Group>
            <Select
              value={filterStatus}
              onChange={(value) => setFilterStatus(value as "all" | "active" | "completed")}
              data={[
                { value: "all", label: "Все" },
                { value: "active", label: "Активные" },
                { value: "completed", label: "Выполненные" },
              ]}
              size="xs"
              style={{ width: 140 }}
            />
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => {
                setIsAddingTask(true);
                open();
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              size="sm"
              radius="md"
            >
              Добавить задачу
            </Button>
          </Group>
        </div>

        <ScrollArea className="tasks-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <IconListCheck size={64} stroke={1} color="#d0d5dd" />
              <Text size="md" mt="md" color="gray.6">Нет задач</Text>
              <Text size="sm" color="gray.5">Добавьте новую задачу ниже</Text>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                projects={projects}
                onToggle={toggleComplete}
                onDelete={deleteTask}
                onMove={moveTask}
                onMoveToProject={moveTaskToProject}
                onStartEditing={setEditingTaskId}
                onUpdateTitle={updateTaskTitle}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                isDragging={draggingTaskId === task.id}
                editingTaskId={editingTaskId}
                isCompleted={task.isCompleted}
              />
            ))
          )}

          <Group grow mt="md" gap="xs">
            {views.map((section) => (
              <div
                key={section}
                className={`drop-zone drop-zone-${section === "Входящие" ? "inbox" : section === "Сегодня" ? "today" : "upcoming"}`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(section)}
              >
                {section}
              </div>
            ))}
          </Group>
        </ScrollArea>
      </div>

      <Modal
        opened={opened && isAddingTask}
        onClose={() => {
          setIsAddingTask(false);
          close();
        }}
        title="Новая задача"
        centered
      >
        <form onSubmit={form.onSubmit(handleAddTask)}>
          <Stack>
            <TextInput
              ref={inputRef}
              label="Название"
              placeholder="Что нужно сделать?"
              {...form.getInputProps("title")}
            />
            <TextInput
              label="Описание"
              placeholder="Подробности..."
              {...form.getInputProps("description")}
            />
            <TextInput
              label="Дата выполнения"
              type="date"
              {...form.getInputProps("dueDate")}
            />
            <Select
              label="Раздел"
              data={[
                { value: "Входящие", label: "Входящие" },
                { value: "Сегодня", label: "Сегодня" },
                { value: "Предстоящие", label: "Предстоящие" },
              ]}
              {...form.getInputProps("section")}
            />
            <Select
              label="Проект"
              placeholder="Выберите проект"
              data={projects.map((p) => ({ value: p, label: p }))}
              clearable
              {...form.getInputProps("project")}
            />
            <Group position="right" mt="sm">
              <Button variant="subtle" onClick={() => { setIsAddingTask(false); close(); }}>Отмена</Button>
              <Button type="submit">Добавить задачу</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </div>
  );
};
