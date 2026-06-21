import React, { useState, useRef, useEffect } from 'react';
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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { z } from 'zod';
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
} from '@tabler/icons-react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useNotes } from '../hooks/useNotes';
import { TaskItem } from '../components/TaskItem';
import { CollaborativeEditor } from '../components/CollaborativeEditor';
import { apiClient } from '../api/client';
import './TodoPage.css';

// Task Zod validation rules matching the NestJS backend domain rules:
// - title: 10 - 50 characters
// - description: optional in form, but if provided must be 10 - 1000 characters
// - dueDate: required, today or future date
const taskSchema = z.object({
  title: z
    .string()
    .min(10, 'Название должно быть от 10 до 50 символов')
    .max(50, 'Название должно быть от 10 до 50 символов'),
  description: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.trim().length >= 10 && val.trim().length <= 1000),
      'Описание должно быть от 10 до 1000 символов, либо оставлено пустым',
    ),
  dueDate: z
    .string()
    .min(1, 'Выберите дату выполнения')
    .refine((val) => {
      const selected = new Date(val);
      selected.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Дата выполнения не может быть в прошлом'),
  section: z.enum(['Входящие', 'Сегодня', 'Предстоящие']),
  project: z.string().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

const views: ('Входящие' | 'Сегодня' | 'Предстоящие')[] = [
  'Входящие',
  'Сегодня',
  'Предстоящие',
];

export const TodoPage = () => {
  const { logout } = useAuth();

  // Tasks Hook
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
    refreshTasks,
  } = useTasks();

  // Projects Hook
  const {
    projects,
    selectedProject,
    setSelectedProject,
    addProject,
    deleteProject,
  } = useProjects();

  // Notes Hook
  const {
    notes,
    selectedNoteId,
    setSelectedNoteId,
    createNote,
    deleteNote,
    updateNoteTitle,
    addSharedNote,
  } = useNotes();

  // Mode Selection State ("tasks" or "notes")
  const [activeMode, setActiveMode] = useState<'tasks' | 'notes'>('tasks');

  const [selectedView, setSelectedView] = useState<
    'Входящие' | 'Сегодня' | 'Предстоящие'
  >('Входящие');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'completed'
  >('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // User Profile state
  const [userProfile, setUserProfile] = useState<{
    id: string;
    login: string;
    avatarUrl: string;
  } | null>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsOpened, setNotificationsOpened] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Join Room by share link ID modal state
  const [
    connectModalOpened,
    { open: openConnectModal, close: closeConnectModal },
  ] = useDisclosure(false);
  const [shareIdInput, setShareIdInput] = useState('');

  // Load User Profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/users/me');
        setUserProfile(res.data);
      } catch (err) {
        console.error('Не удалось получить профиль пользователя:', err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch Notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      const list = res.data || [];
      setNotifications(list);
      setUnreadCount(list.length);
    } catch (err) {
      console.error('Не удалось получить уведомления:', err);
    }
  };

  // Poll notifications periodically every 15 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle share link on load (?note=ROOM_ID)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedNoteId = params.get('note');
    if (sharedNoteId) {
      setActiveMode('notes');
      // Add shared note if it doesn't exist
      addSharedNote(sharedNoteId, 'Совместная заметка');
      // Clear query string silently
      const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, [addSharedNote]);

  const filteredTasks = useTaskFilters(
    tasks,
    selectedView,
    selectedProject,
    searchQuery,
    filterStatus,
  );

  const form = useForm<TaskForm>({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      dueDate: '',
      section: 'Входящие',
      project: '',
    },
    validate: {
      title: (value) => {
        const result = taskSchema.shape.title.safeParse(value);
        return result.success
          ? null
          : result.error?.issues?.[0]?.message || 'Неверное название';
      },
      description: (value) => {
        const result = taskSchema.shape.description.safeParse(value);
        return result.success
          ? null
          : result.error?.issues?.[0]?.message || 'Неверное описание';
      },
      dueDate: (value) => {
        const result = taskSchema.shape.dueDate.safeParse(value);
        return result.success
          ? null
          : result.error?.issues?.[0]?.message || 'Неверная дата';
      },
      section: (value) => {
        const result = taskSchema.shape.section.safeParse(value);
        return result.success
          ? null
          : result.error?.issues?.[0]?.message || 'Неверный раздел';
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
        isCompleted: false,
      });
      form.reset();
      setIsAddingTask(false);
      close();
      setTimeout(fetchNotifications, 1500);
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  };

  const handleAddProject = () => {
    if (addProject(newProjectName)) {
      setNewProjectName('');
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

  const handleDrop = (section: 'Входящие' | 'Сегодня' | 'Предстоящие') => {
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
    if (cleanId.includes('?note=')) {
      const match = cleanId.match(/[?&]note=([^&#]+)/);
      if (match) {
        cleanId = match[1];
      }
    }
    if (cleanId) {
      addSharedNote(cleanId, 'Совместная заметка');
      setShareIdInput('');
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
      {/* SIDEBAR CONTAINER */}
      <div className="sidebar">
        <div className="logo" style={{ marginBottom: '16px' }}>
          <IconListCheck size={28} stroke={1.5} />
          <Text size="lg" fw={700}>
            Clarte
          </Text>
        </div>

        {/* Mode Selector Toggle */}
        <SegmentedControl
          value={activeMode}
          onChange={(val) => setActiveMode(val as 'tasks' | 'notes')}
          data={[
            { label: 'Задачи', value: 'tasks' },
            { label: 'Заметки', value: 'notes' },
          ]}
          size="xs"
          mb="md"
          radius="md"
          color="indigo"
        />

        {/* TASKS MODE SIDEBAR */}
        {activeMode === 'tasks' ? (
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
                  className={`nav-item ${selectedView === view && !selectedProject ? 'active' : ''}`}
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

              <Text
                size="xs"
                fw={600}
                color="gray.5"
                tt="uppercase"
                px="xs"
                mb="xs"
              >
                ПРОЕКТЫ
              </Text>

              {projects.map((project) => (
                <div
                  key={project}
                  className={`nav-item ${selectedProject === project ? 'active' : ''}`}
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
                        setSelectedView('Входящие');
                      }
                    }}
                  >
                    <IconTrash size={12} />
                  </div>
                </div>
              ))}

              <div
                className="add-project-btn"
                onClick={() => setIsAddingProject(!isAddingProject)}
              >
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
                    onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                  />
                  <div className="add-project-actions">
                    <Button size="xs" onClick={handleAddProject}>
                      Добавить
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        setIsAddingProject(false);
                        setNewProjectName('');
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
          /* NOTES MODE SIDEBAR */
          <Box
            className="sidebar-nav"
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
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
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                {notes.length === 0 ? (
                  <Text size="xs" color="dimmed" ta="center" mt="xl">
                    Нет заметок. Создайте новую или подключитесь по ID.
                  </Text>
                ) : (
                  notes.map((n) => (
                    <div
                      key={n.id}
                      className={`nav-item ${selectedNoteId === n.id ? 'active' : ''}`}
                      onClick={() => setSelectedNoteId(n.id)}
                      style={{ paddingRight: '40px' }}
                    >
                      <IconFileText size={16} stroke={1.5} />
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {n.title}
                      </span>
                      <div
                        className="delete-project-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Удалить заметку "${n.title}"?`)) {
                            deleteNote(n.id);
                          }
                        }}
                        style={{ display: 'block' }} // Make it visible on item hover
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

        {/* User Card in sidebar footer */}
        {userProfile && (
          <Group
            justify="space-between"
            mt="auto"
            pt="md"
            style={{ borderTop: '1px solid #e5e7eb' }}
          >
            <Group gap="xs">
              <Avatar
                src={userProfile.avatarUrl}
                alt={userProfile.login}
                radius="xl"
                size="md"
              >
                {userProfile.login.slice(0, 2).toUpperCase()}
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text
                  size="sm"
                  fw={600}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {userProfile.login}
                </Text>
                <Text size="xs" color="dimmed">
                  В сети
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

      {/* MAIN MAIN CONTENT PANEL */}
      <div className="main-content">
        {/* TASKS VIEW PANEL */}
        {activeMode === 'tasks' ? (
          <>
            <div className="main-header">
              <Text size="28px" fw={700}>
                {currentTitle}
              </Text>
              <Group>
                {/* Real-time Notifications Popover */}
                <Popover
                  opened={notificationsOpened}
                  onChange={setNotificationsOpened}
                  position="bottom-end"
                  withArrow
                  shadow="md"
                  width={320}
                >
                  <Popover.Target>
                    <Indicator
                      label={unreadCount > 0 ? unreadCount : undefined}
                      size={16}
                      offset={3}
                      color="indigo"
                      disabled={unreadCount === 0}
                    >
                      <ActionIcon
                        variant="subtle"
                        size="lg"
                        radius="md"
                        onClick={() => {
                          setNotificationsOpened((o) => !o);
                          fetchNotifications();
                        }}
                      >
                        <IconBell size={20} stroke={1.5} />
                      </ActionIcon>
                    </Indicator>
                  </Popover.Target>
                  <Popover.Dropdown p={0}>
                    <div
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #f1f3f5',
                      }}
                    >
                      <Text fw={600} size="sm">
                        Уведомления
                      </Text>
                    </div>
                    <ScrollArea.Autosize maxHeight={300}>
                      {notifications.length === 0 ? (
                        <div
                          style={{
                            padding: '24px 16px',
                            textAlign: 'center',
                            color: '#9ca3af',
                          }}
                        >
                          <IconBellOff
                            size={32}
                            stroke={1}
                            style={{ margin: '0 auto 8px' }}
                          />
                          <Text size="xs">Нет новых уведомлений</Text>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #f1f3f5',
                              fontSize: '13px',
                            }}
                          >
                            <Text fw={600} size="xs" color="indigo">
                              {n.title}
                            </Text>
                            <Text size="xs" mt={2} style={{ color: '#4b5563' }}>
                              {n.text}
                            </Text>
                            <Text size="10px" color="dimmed" mt={4}>
                              {new Date(n.createdAt).toLocaleDateString(
                                'ru-RU',
                              )}{' '}
                              {new Date(n.createdAt).toLocaleTimeString(
                                'ru-RU',
                                { hour: '2-digit', minute: '2-digit' },
                              )}
                            </Text>
                          </div>
                        ))
                      )}
                    </ScrollArea.Autosize>
                  </Popover.Dropdown>
                </Popover>

                <Select
                  value={filterStatus}
                  onChange={(value) =>
                    setFilterStatus(value as 'all' | 'active' | 'completed')
                  }
                  data={[
                    { value: 'all', label: 'Все' },
                    { value: 'active', label: 'Активные' },
                    { value: 'completed', label: 'Выполненные' },
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

            {tasksError && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Внимание"
                color="red"
                variant="light"
                mb="md"
                withCloseButton
                onClose={() => refreshTasks()}
              >
                {tasksError}
              </Alert>
            )}

            <ScrollArea className="tasks-container">
              {isTasksLoading && tasks.length === 0 ? (
                <Group justify="center" py="xl">
                  <Loader size="md" />
                  <Text size="sm" color="dimmed">
                    Загрузка задач...
                  </Text>
                </Group>
              ) : filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <IconListCheck size={64} stroke={1} color="#d0d5dd" />
                  <Text size="md" mt="md" color="gray.6">
                    Нет задач
                  </Text>
                  <Text size="sm" color="gray.5">
                    Добавьте новую задачу ниже
                  </Text>
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
                    className={`drop-zone drop-zone-${section === 'Входящие' ? 'inbox' : section === 'Сегодня' ? 'today' : 'upcoming'}`}
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
          /* NOTES VIEW PANEL */
          <div
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {selectedNote ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                {/* Note title editable input */}
                <Box mb="sm">
                  <TextInput
                    value={selectedNote.title}
                    onChange={(e) =>
                      updateNoteTitle(selectedNote.id, e.currentTarget.value)
                    }
                    size="lg"
                    variant="unstyled"
                    placeholder="Введите название заметки..."
                    style={{
                      fontSize: '28px',
                      fontWeight: 700,
                      border: 'none',
                    }}
                    styles={{
                      input: {
                        fontSize: '28px',
                        fontWeight: 700,
                        paddingLeft: 0,
                        color: '#1a1a2e',
                        background: 'transparent',
                        border: 'none',
                        '&:focus': {
                          border: 'none',
                        },
                      },
                    }}
                  />
                </Box>

                {/* Collaborative Editor Panel */}
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
                <Text size="md" mt="md" color="gray.6">
                  Заметка не выбрана
                </Text>
                <Text size="sm" color="gray.5">
                  Выберите заметку слева или создайте новую для совместной
                  работы
                </Text>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
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
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Ошибка при создании"
                color="red"
                variant="light"
              >
                {tasksError}
              </Alert>
            )}

            <TextInput
              ref={inputRef}
              label="Название"
              placeholder="Что нужно сделать? (от 10 до 50 символов)"
              required
              {...form.getInputProps('title')}
            />

            <TextInput
              label="Описание"
              placeholder="Подробности... (оставьте пустым или от 10 символов)"
              {...form.getInputProps('description')}
            />

            <TextInput
              label="Дата выполнения"
              type="date"
              required
              {...form.getInputProps('dueDate')}
            />

            <Select
              label="Раздел"
              data={[
                { value: 'Входящие', label: 'Входящие' },
                { value: 'Сегодня', label: 'Сегодня' },
                { value: 'Предстоящие', label: 'Предстоящие' },
              ]}
              {...form.getInputProps('section')}
            />

            <Select
              label="Проект"
              placeholder="Выберите проект"
              data={projects.map((p) => ({ value: p, label: p }))}
              clearable
              {...form.getInputProps('project')}
            />

            <Group justify="flex-end" mt="sm">
              <Button
                variant="subtle"
                onClick={() => {
                  setIsAddingTask(false);
                  close();
                }}
              >
                Отмена
              </Button>
              <Button type="submit">Добавить задачу</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Join Room by Share Link Modal */}
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
            <Button variant="subtle" onClick={closeConnectModal}>
              Отмена
            </Button>
            <Button onClick={handleConnectByShareId} color="indigo">
              Подключиться
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};
