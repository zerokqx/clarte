import { NoteIcon } from '@phosphor-icons/react/dist/ssr/Note';
import { CheckSquareIcon } from '@phosphor-icons/react/dist/ssr/CheckSquare';
import { SparkleIcon } from '@phosphor-icons/react/dist/ssr/Sparkle';
import { Icon } from '@phosphor-icons/react/dist/lib/types';

export interface AuthFeature {
  icon: Icon;
  label: string;
  title: string;
  description: string;
}

export const AUTH_FEATURES: AuthFeature[] = [
  {
    icon: NoteIcon,
    label: 'notes',
    title: 'Умные заметки',
    description: 'Записывайте идеи и структурируйте их с легкостью',
  },
  {
    icon: CheckSquareIcon,
    label: 'tasks',
    title: 'Список задач',
    description: 'Управляйте делами и отслеживайте свой прогресс',
  },
  {
    icon: SparkleIcon,
    label: 'clarity',
    title: 'Полная ясность',
    description: 'Ничего лишнего — только фокус на важном',
  },
];

export const AUTH_WELCOME_TEXTS = {
  brand: 'Clarte',
  tagline:
    'Ваше персональное пространство ясности. Мы помогаем навести порядок в мыслях, задачах и записях.',
  welcomeTitle: 'Добро пожаловать!',
  welcomeSubtitle:
    'Приведите дела в порядок, найдите фокус и добейтесь ясности каждый день вместе с нами.',
  tosText: 'Продолжая, вы соглашаетесь с условиями обслуживания',
  loginBtn: 'Войти в систему',
  registerBtn: 'Создать новый аккаунт',
};
