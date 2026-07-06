import { useMe } from '../api/me.query';
import { Avatar, Box, Card, Group, Stack, Text, Skeleton } from '@mantine/core';
import { AtIcon } from '@phosphor-icons/react/dist/csr/At';
import { InfoIcon } from '@phosphor-icons/react/dist/csr/Info';
import { IdentificationCardIcon } from '@phosphor-icons/react/dist/csr/IdentificationCard';
import classes from './user-card.module.css';

export const UserCard = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return (
      <Card className={classes.userCard} padding={0}>
        <Box className={classes.header}>
          <Skeleton circle height={120} width={120} />
          <Skeleton height={20} width={150} radius="xl" />
          <Skeleton height={12} width={80} radius="xl" />
        </Box>
        <Stack className={classes.infoSection} gap="xs">
          <Group gap="md" py="sm">
            <Skeleton circle height={20} width={20} />
            <Stack gap="xs" style={{ flex: 1 }}>
              <Skeleton height={14} width="60%" />
              <Skeleton height={10} width="30%" />
            </Stack>
          </Group>
        </Stack>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={classes.userCard} padding="md">
        <Text color="red" size="sm" ta="center">
          Не удалось загрузить данные пользователя
        </Text>
      </Card>
    );
  }

  return (
    <Card className={classes.userCard} padding={0}>
      {/* Шапка в стиле Telegram */}
      <Box className={classes.header}>
        <Avatar
          src={user.avatarUrl}
          size={120}
          radius={120}
          className={classes.avatar}
          color="violet"
          name={user.login}
        />
        <Stack gap={4} align="center">
          <Text className={classes.name}>{user.login}</Text>
          <Text className={classes.status}>в сети</Text>
        </Stack>
      </Box>

      {/* Информация о пользователе */}
      <Box className={classes.infoSection}>
        {/* Имя пользователя / юзернейм */}
        <Box className={classes.infoRow}>
          <Box className={classes.iconWrapper}>
            <AtIcon size={20} weight="regular" />
          </Box>
          <Box className={classes.infoContent}>
            <Text className={classes.value}>@{user.login}</Text>
            <Text className={classes.label}>Имя пользователя</Text>
          </Box>
        </Box>

        {/* ID пользователя */}
        <Box className={classes.infoRow}>
          <Box className={classes.iconWrapper}>
            <IdentificationCardIcon size={20} weight="regular" />
          </Box>
          <Box className={classes.infoContent}>
            <Text className={classes.value}>{user.id}</Text>
            <Text className={classes.label}>Уникальный ID</Text>
          </Box>
        </Box>

        {/* О себе (Опциональное поле) */}
        <Box className={classes.infoRow}>
          <Box className={classes.iconWrapper}>
            <InfoIcon size={20} weight="regular" />
          </Box>
          <Box className={classes.infoContent}>
            <Text className={classes.value}>Пользователь Clarte</Text>
            <Text className={classes.label}>О себе</Text>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};
