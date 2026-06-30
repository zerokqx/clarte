import React, { useState, useRef, useEffect } from "react";
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
  Alert,
  Avatar,
  Tooltip,
  ActionIcon,
  Popover,
  Indicator,
  Loader,
  SegmentedControl,
  useMantineColorScheme,
  Progress,
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
  IconBell,
  IconBellOff,
  IconAlertCircle,
  IconNotebook,
  IconLink,
  IconFileText,
  IconSun,
  IconMoon,
  IconFlag,
} from "@tabler/icons-react";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { useNotes } from "../hooks/useNotes";
import { useSmartReminders } from "../hooks/useSmartReminders";
import { TaskItem } from "../components/TaskItem";
import { CollaborativeEditor } from "../components/CollaborativeEditor";
import { apiClient } from "../api/client";
import "./TodoPage.css";

const taskSchema = z.object({
  title: z.string()
    .min(2, "Название должно быть от 2 до 100 символов")
    .max(100, "Название должно быть от 2 до 100 символов"),
  description: z.string().max(1000, "Описание не должно превышать 1000 символов").optional(),
  dueDate: z.string()
    .min(1, "Выберите дату выполнения")
    .refine((val) => {
      const selected = new Date(val);
      selected.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "Дата выполнения не может быть в прошлом"),
  section: z.enum(["Входящие", "Сегодня", "Предстоящие"]),
  project: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
});

type TaskForm = z.infer<typeof taskSchema>;

const views: ("Входящие" | "Сегодня" | "Предстоящие")[] = ["Входящие", "Сегодня", "Предстоящие"];

const priorityWeight = {
  high: 3,
  medium: 2,
  low: 1,
};

const notePriorityColors = {
  high: "red",
  medium: "orange",
  low: "gray",
};

export const TodoPage = () => {
  const { logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  
  const {
    tasks,
    isLoading: isTasksLoading,
    error: tasksError,
    addTask,
    deleteTask,
    toggleComplete,
    moveTask,
    moveTaskToProject,
    updateTaskTitle,
    updateTaskPriority,
    refreshTasks,
  } = useTasks();

  const { permission: pushPermission, requestPermission, stats: reminderStats } = useSmartReminders(tasks);

  const { projects, selectedProject, setSelectedProject, addProject, deleteProject } = useProjects();

  const {
    notes,
    selectedNoteId,
    setSelectedNoteId,
    createNote,
    deleteNote,
    updateNoteTitle,
    updateNotePriority,
    addSharedNote,
  } = useNotes();

  const [activeMode, setActiveMode] = useState<"tasks" | "notes">("tasks");
  const [selectedView, setSelectedView] = useState<"Входящие" | "Сегодня" | "Предстоящие">("Входящие");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [userProfile, setUserProfile] = useState<{ id: string; login: string; avatarUrl: string } | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsOpened, setNotificationsOpened] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("clarte_read_notifications") || "[]");
    } catch {
      return [];
    }
  });

  const [connectModalOpened, { open: openConnectModal, close: closeConnectModal }] = useDisclosure(false);
  const [shareIdInput, setShareIdInput] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get("/users/me");
        setUserProfile(res.data);
        localStorage.setItem("clarte_user_profile", JSON.stringify(res.data));
      } catch (err: any) {
        if (err.response?.status !== 503) {
          console.error(err);
        }
        setIsOffline(true);
        const cached = localStorage.getItem("clarte_user_profile");
        if (cached) {
          setUserProfile(JSON.parse(cached));
        } else {
          setUserProfile({ id: "local-user", login: "Локальный пользователь", avatarUrl: "" });
        }
      }
    };
    fetchProfile();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get("/notifications");
      const list = res.data || [];
      setNotifications(list);
      
      const storedReadIds: string[] = JSON.parse(localStorage.getItem("clarte_read_notifications") || "[]");
      const unread = list.filter((n: any) => !storedReadIds.includes(n.id));
      setUnreadCount(unread.length);
      
      localStorage.setItem("clarte_notifications_cache", JSON.stringify(list));
      setIsOffline(false);
    } catch (err: any) {
      if (err.response?.status !== 503) {
        console.error(err);
      }
      setIsOffline(true);
      const cached = localStorage.getItem("clarte_notifications_cache");
      if (cached) {
        const list = JSON.parse(cached);
        setNotifications(list);
        const storedReadIds: string[] = JSON.parse(localStorage.getItem("clarte_read_notifications") || "[]");
        const unread = list.filter((n: any) => !storedReadIds.includes(n.id));
        setUnreadCount(unread.length);
      } else {
        const initialMockNotifs = [
          {
            id: "welcome-notif-1",
            title: "Система Clarte",
            text: "Вы подключены в автономном режиме. Сервер недоступен.",
            read: false,
            createdAt: new Date().toISOString(),
          }
        ];
        setNotifications(initialMockNotifs);
        const storedReadIds: string[] = JSON.parse(localStorage.getItem("clarte_read_notifications") || "[]");
        const unread = initialMockNotifs.filter((n: any) => !storedReadIds.includes(n.id));
        setUnreadCount(unread.length);
      }
    }
  };

  const markAllNotificationsAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotificationIds(allIds);
    localStorage.setItem("clarte_read_notifications", JSON.stringify(allIds));
    setUnreadCount(0);
  };

  const markNotificationAsRead = (id: string) => {
    setReadNotificationIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem("clarte_read_notifications", JSON.stringify(next));
      return next;
    });
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedNoteId = params.get("note");
    if (sharedNoteId) {
      setActiveMode("notes");
      addSharedNote(sharedNoteId, "Совместная заметка");
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: newUrl }, "", newUrl);
    }
  }, [addSharedNote]);

  const filteredTasks = useTaskFilters(
    tasks,
    selectedView,
    selectedProject,
    searchQuery,
    filterStatus,
    filterPriority
  );

  const sortedTasks = React.useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const weightA = priorityWeight[a.priority || "medium"];
      const weightB = priorityWeight[b.priority || "medium"];
      return weightB - weightA;
    });
  }, [filteredTasks]);

  const sortedNotes = React.useMemo(() => {
    return [...notes].sort((a, b) => {
      const weightA = priorityWeight[a.priority || "medium"];
      const weightB = priorityWeight[b.priority || "medium"];
      return weightB - weightA;
    });
  }, [notes]);

  const currentViewTasks = React.useMemo(() => {
    return tasks.filter((t) => {
      if (selectedProject) {
        return t.project === selectedProject;
      }
      return t.section === selectedView;
    });
  }, [tasks, selectedView, selectedProject]);

  const stats = React.useMemo(() => {
    const total = currentViewTasks.length;
    const completed = currentViewTasks.filter((t) => t.isCompleted).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [currentViewTasks]);

  const form = useForm<TaskForm>({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      dueDate: "",
      section: "Входящие",
      project: "",
      priority: "medium",
    },
    validate: {
      title: (value) => {
        const result = taskSchema.shape.title.safeParse(value);
        return result.success ? null : (result.error?.issues?.[0]?.message || "Неверное название");
      },
      description: (value) => {
        const result = taskSchema.shape.description.safeParse(value);
        return result.success ? null : (result.error?.issues?.[0]?.message || "Неверное описание");
      },
      dueDate: (value) => {
        const result = taskSchema.shape.dueDate.safeParse(value);
        return result.success ? null : (result.error?.issues?.[0]?.message || "Неверная дата");
      },
      section: (value) => {
        const result = taskSchema.shape.section.safeParse(value);
        return result.success ? null : (result.error?.issues?.[0]?.message || "Неверный раздел");
      },
    },
  });

  const currentTitle = selectedProject || selectedView;

  const handleAddTask = async (values: TaskForm) => {
    try {
      await addTask({
        title: values.title,
        description: values.description || undefined,
        dueDate: values.dueDate,
        section: values.section,
        project: values.project || selectedProject || undefined,
        priority: values.priority || "medium",
        isCompleted: false,
      });
      form.reset();
      setIsAddingTask(false);
      close();
      setTimeout(fetchNotifications, 1500);
    } catch (err) {
      console.error(err);
    }
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

  const handleConnectByShareId = () => {
    let cleanId = shareIdInput.trim();
    if (cleanId.includes("?note=")) {
      const match = cleanId.match(/[?&]note=([^&#]+)/);
      if (match) {
        cleanId = match[1];
      }
    }
    if (cleanId) {
      addSharedNote(cleanId, "Совместная заметка");
      setShareIdInput("");
      closeConnectModal();
    }
  };

  const viewIcons = {
    Входящие: <IconInbox size={18} stroke={1.5} />,
    Сегодня: <IconCalendar size={18} stroke={1.5} />,
    Предстоящие: <IconClock size={18} stroke={1.5} />,
  };

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  return (
    <div className="todo-app">
      <div className="sidebar">
        <Group justify="space-between" mb="lg">
          <div className="logo">
            <IconListCheck size={28} stroke={1.5} />
            <Text size="lg" fw={700}>Clarte</Text>
          </div>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => toggleColorScheme()}
            title="Переключить тему"
          >
            {colorScheme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>
        </Group>

        <SegmentedControl
          value={activeMode}
          onChange={(val) => setActiveMode(val as "tasks" | "notes")}
          data={[
            { label: "Задачи", value: "tasks" },
            { label: "Заметки", value: "notes" },
          ]}
          size="xs"
          mb="md"
          radius="md"
          color="indigo"
        />
        
        {activeMode === "tasks" ? (
          <>
            <Box>
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
          </>
        ) : (
          <Box className="sidebar-nav" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Group grow gap="xs">
              <Button
                size="xs"
                variant="light"
                color="indigo"
                leftSection={<IconPlus size={14} />}
                onClick={() => createNote()}
              >
                Создать
              </Button>
              <Button
                size="xs"
                variant="outline"
                color="indigo"
                leftSection={<IconLink size={14} />}
                onClick={openConnectModal}
              >
                Войти в ID
              </Button>
            </Group>

            <Divider my="xs" label="Заметки" labelPosition="center" />

            <ScrollArea style={{ flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {sortedNotes.length === 0 ? (
                  <Text size="xs" color="dimmed" ta="center" mt="xl">
                    Нет заметок. Создайте новую или подключитесь по ID.
                  </Text>
                ) : (
                  sortedNotes.map((n) => (
                    <div
                      key={n.id}
                      className={`nav-item ${selectedNoteId === n.id ? "active" : ""}`}
                      onClick={() => setSelectedNoteId(n.id)}
                    >
                      <IconFileText size={16} stroke={1.5} style={{ color: notePriorityColors[n.priority || "medium"] }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {n.title}
                      </span>
                      <IconFlag size={14} color={notePriorityColors[n.priority || "medium"]} style={{ marginRight: "4px" }} />
                      <div
                        className="delete-project-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Удалить заметку "${n.title}"?`)) {
                            deleteNote(n.id);
                          }
                        }}
                        style={{ display: "block" }}
                      >
                        <IconTrash size={12} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Box>
        )}

        {userProfile && (
          <Group justify="space-between" mt="auto" pt="md" style={{ borderTop: "1px solid #e5e7eb" }}>
            <Group gap="xs">
              <Avatar src={userProfile.avatarUrl} alt={userProfile.login} radius="xl" size="md">
                {userProfile.login.slice(0, 2).toUpperCase()}
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" fw={600} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {userProfile.login}
                </Text>
                <Text size="xs" color={isOffline ? "orange" : "dimmed"} fw={isOffline ? 600 : 400}>
                  {isOffline ? "Автономный режим" : "В сети"}
                </Text>
              </div>
            </Group>
            <Tooltip label="Выйти">
              <ActionIcon variant="subtle" color="red" onClick={logout}>
                <IconLogout size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
        )}
      </div>

      <div className="main-content">
        {activeMode === "tasks" ? (
          <>
            <div className="main-header">
              <Text size="28px" fw={700}>{currentTitle}</Text>
              <Group>
                <Popover opened={notificationsOpened} onChange={setNotificationsOpened} position="bottom-end" withArrow shadow="md" width={320}>
                  <Popover.Target>
                    <Indicator label={unreadCount > 0 ? unreadCount : undefined} size={16} offset={3} color="indigo" disabled={unreadCount === 0}>
                      <ActionIcon variant="subtle" size="lg" radius="md" onClick={() => {
                        setNotificationsOpened((o) => !o);
                        fetchNotifications();
                      }}>
                        <IconBell size={20} stroke={1.5} />
                      </ActionIcon>
                    </Indicator>
                  </Popover.Target>
                  <Popover.Dropdown p={0}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f3f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text fw={600} size="sm">Уведомления</Text>
                      {unreadCount > 0 && (
                        <Button variant="subtle" size="xs" color="indigo" onClick={markAllNotificationsAsRead} style={{ fontSize: "11px", height: "auto", padding: "2px 6px" }}>
                          Прочитать всё
                        </Button>
                      )}
                    </div>
                    <ScrollArea.Autosize maxHeight={300}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: "24px 16px", textAlign: "center", color: "#9ca3af" }}>
                          <IconBellOff size={32} stroke={1} style={{ margin: "0 auto 8px" }} />
                          <Text size="xs">Нет новых уведомлений</Text>
                        </div>
                      ) : (
                        notifications.map((n) => {
                          const isUnread = !readNotificationIds.includes(n.id);
                          return (
                            <div
                              key={n.id}
                              onClick={() => markNotificationAsRead(n.id)}
                              style={{
                                padding: "12px 16px",
                                borderBottom: "1px solid #f1f3f5",
                                fontSize: "13px",
                                cursor: "pointer",
                                backgroundColor: isUnread ? (colorScheme === "dark" ? "#1c2436" : "#f5f7ff") : "transparent",
                                transition: "background-color 0.2s ease, transform 0.2s ease",
                                position: "relative"
                              }}
                              className="notification-item"
                            >
                              <Group justify="space-between" align="flex-start" wrap="nowrap">
                                <Text fw={isUnread ? 700 : 600} size="xs" color={isUnread ? "indigo" : "dimmed"}>
                                  {n.title}
                                </Text>
                                {isUnread && (
                                  <span style={{
                                    width: "6px",
                                    height: "6px",
                                    backgroundColor: "#4f46e5",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    marginTop: "4px"
                                  }} />
                                )}
                              </Group>
                              <Text size="xs" mt={2} style={{ color: colorScheme === "dark" ? "#c1c2c5" : "#4b5563" }}>
                                {n.text || n.message}
                              </Text>
                              <Text size="10px" color="dimmed" mt={4}>
                                {new Date(n.createdAt).toLocaleDateString("ru-RU")} {new Date(n.createdAt).toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' })}
                              </Text>
                            </div>
                          );
                        })
                      )}
                    </ScrollArea.Autosize>
                  </Popover.Dropdown>
                </Popover>

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

                <Select
                  value={filterPriority}
                  onChange={(value) => setFilterPriority(value as "all" | "high" | "medium" | "low")}
                  data={[
                    { value: "all", label: "Любой приоритет" },
                    { value: "high", label: "Высокий" },
                    { value: "medium", label: "Средний" },
                    { value: "low", label: "Низкий" },
                  ]}
                  size="xs"
                  style={{ width: 150 }}
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

            {tasksError && (
              <Alert icon={<IconAlertCircle size={16} />} title="Внимание" color="red" variant="light" mb="md" withCloseButton onClose={() => refreshTasks()}>
                {tasksError}
              </Alert>
            )}

            {pushPermission === 'default' && (
              <Alert
                icon={<IconBell size={16} />}
                title="Уведомления на рабочем столе"
                color="indigo"
                variant="light"
                mb="sm"
              >
                <Group justify="space-between" align="center" style={{ width: '100%' }}>
                  <Text size="xs">
                    Включите уведомления, чтобы получать предупреждения о просроченных задачах и делах на сегодня.
                  </Text>
                  <Button size="xs" color="indigo" onClick={requestPermission}>
                    Включить
                  </Button>
                </Group>
              </Alert>
            )}

            {reminderStats.overdueCount > 0 && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Просроченные задачи"
                color="red"
                variant="light"
                mb="sm"
              >
                У вас есть {reminderStats.overdueCount} просроченных задач! Пожалуйста, проверьте их.
              </Alert>
            )}

            {reminderStats.todayCount > 0 && (
              <Alert
                icon={<IconCalendar size={16} />}
                title="Задачи на сегодня"
                color="yellow"
                variant="light"
                mb="sm"
              >
                На сегодня запланировано {reminderStats.todayCount} задач. Продуктивного дня!
              </Alert>
            )}

            {stats.total > 0 && (
              <Box mb="md" p="sm" style={{ background: colorScheme === "dark" ? "#1e1e24" : "#f1f3f9", borderRadius: "8px", border: colorScheme === "dark" ? "1px solid #2c2e33" : "1px solid #e5e7eb" }}>
                <Group justify="space-between" mb="xs">
                  <Text size="xs" fw={700} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Прогресс:</span>
                    <Badge size="xs" variant="filled" color="indigo">{selectedProject || selectedView}</Badge>
                  </Text>
                  <Text size="xs" fw={700} color="indigo">
                    Выполнено {stats.completed} из {stats.total} ({stats.percent}%)
                  </Text>
                </Group>
                <Progress value={stats.percent} color="indigo" size="xs" radius="xl" striped animate />
              </Box>
            )}

            <ScrollArea className="tasks-container">
              {isTasksLoading && tasks.length === 0 ? (
                <Group justify="center" py="xl">
                  <Loader size="md" />
                  <Text size="sm" color="dimmed">Загрузка задач...</Text>
                </Group>
              ) : sortedTasks.length === 0 ? (
                <div className="empty-state">
                  <IconListCheck size={64} stroke={1} color="#d0d5dd" />
                  <Text size="md" mt="md" color="gray.6">Нет задач</Text>
                  <Text size="sm" color="gray.5">Добавьте новую задачу ниже</Text>
                </div>
              ) : (
                sortedTasks.map((task) => (
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
                    onUpdateDescription={updateTaskDescription}
                    onUpdatePriority={updateTaskPriority}
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
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {selectedNote ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Group justify="space-between" align="center" mb="sm">
                  <Box style={{ flex: 1 }}>
                    <TextInput
                      value={selectedNote.title}
                      onChange={(e) => updateNoteTitle(selectedNote.id, e.currentTarget.value)}
                      size="lg"
                      variant="unstyled"
                      placeholder="Введите название заметки..."
                      style={{ fontSize: "28px", fontWeight: 700, border: "none" }}
                      styles={{
                        input: {
                          fontSize: "28px",
                          fontWeight: 700,
                          paddingLeft: 0,
                          color: colorScheme === "dark" ? "#ffffff" : "#1a1a2e",
                          background: "transparent",
                          border: "none",
                          "&:focus": {
                            border: "none",
                          }
                        }
                      }}
                    />
                  </Box>
                  <Select
                    value={selectedNote.priority || "medium"}
                    onChange={(val) => updateNotePriority(selectedNote.id, val as "high" | "medium" | "low")}
                    data={[
                      { value: "high", label: "Высокий приоритет" },
                      { value: "medium", label: "Средний приоритет" },
                      { value: "low", label: "Низкий приоритет" },
                    ]}
                    size="xs"
                    radius="md"
                    style={{ width: 160 }}
                    leftSection={<IconFlag size={14} color={notePriorityColors[selectedNote.priority || "medium"]} />}
                  />
                </Group>

                <div style={{ flex: 1 }}>
                  <CollaborativeEditor
                    noteId={selectedNote.id}
                    noteTitle={selectedNote.title}
                    currentUser={userProfile}
                  />
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <IconNotebook size={64} stroke={1} color="#d0d5dd" />
                <Text size="md" mt="md" color="gray.6">Заметка не выбрана</Text>
                <Text size="sm" color="gray.5">Выберите заметку слева или создайте новую для совместной работы</Text>
              </div>
            )}
          </div>
        )}
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
            {tasksError && (
              <Alert icon={<IconAlertCircle size={16} />} title="Ошибка при создании" color="red" variant="light">
                {tasksError}
              </Alert>
            )}

            <TextInput
              ref={inputRef}
              label="Название"
              placeholder="Что нужно сделать? (от 2 до 100 символов)"
              required
              {...form.getInputProps("title")}
            />
            
            <TextInput
              label="Описание"
              placeholder="Подробности... (по желанию)"
              {...form.getInputProps("description")}
            />
            
            <TextInput
              label="Дата выполнения"
              type="date"
              required
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
              label="Приоритет"
              data={[
                { value: "high", label: "Высокий" },
                { value: "medium", label: "Средний" },
                { value: "low", label: "Низкий" },
              ]}
              {...form.getInputProps("priority")}
            />
            
            <Select
              label="Проект"
              placeholder="Выберите проект"
              data={projects.map((p) => ({ value: p, label: p }))}
              clearable
              {...form.getInputProps("project")}
            />
            
            <Group justify="flex-end" mt="sm">
              <Button variant="subtle" onClick={() => { setIsAddingTask(false); close(); }}>Отмена</Button>
              <Button type="submit">Добавить задачу</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={connectModalOpened}
        onClose={closeConnectModal}
        title="Подключиться к совместной заметке"
        centered
      >
        <Stack>
          <TextInput
            label="ID комнаты или Ссылка"
            placeholder="Вставьте ID комнаты (например, room-abc-123) или полную ссылку..."
            value={shareIdInput}
            onChange={(e) => setShareIdInput(e.currentTarget.value)}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" onClick={closeConnectModal}>Отмена</Button>
            <Button onClick={handleConnectByShareId} color="indigo">Подключиться</Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};
