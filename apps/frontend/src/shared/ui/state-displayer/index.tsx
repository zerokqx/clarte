import { Group, Loader, MantineColor, Text } from '@mantine/core';

interface States {
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}

interface StateDisplayerProps extends States {
  errorText?: string;
  loadingText?: string;
  successText?: string;
}

const STATE_COLORS: Record<keyof States, MantineColor> = {
  isError: 'red',
  isLoading: 'gray',
  isSuccess: 'green',
};

export const StateDisplayer = ({
  isError,
  isLoading,
  isSuccess,
  errorText = 'Ошибка',
  loadingText = 'Загрузка...',
  successText = 'Успешно',
}: StateDisplayerProps) => {
  if (isError) {
    return (
      <Group gap="xs">
        <Loader c={STATE_COLORS.isError} size="xs" type="dots" />
        <Text c={STATE_COLORS.isError} size="sm">
          {errorText}
        </Text>
      </Group>
    );
  }

  if (isLoading) {
    return (
      <Group gap="xs">
        <Loader c={STATE_COLORS.isLoading} size="xs" />
        <Text c={STATE_COLORS.isLoading} size="sm">
          {loadingText}
        </Text>
      </Group>
    );
  }

  if (isSuccess) {
    return (
      <Group gap="xs">
        {/* Для успеха лоадер обычно не нужен, можно оставить только текст */}
        <Text c={STATE_COLORS.isSuccess} size="sm" fw={500}>
          {successText}
        </Text>
      </Group>
    );
  }

  // Если ни один статус не активен, возвращаем null, чтобы React не ругался
  return null;
};
