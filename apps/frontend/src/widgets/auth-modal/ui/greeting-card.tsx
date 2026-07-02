import { Box, Group, Stack, Text, Title, ThemeIcon, rem, darken } from '@mantine/core';
import { AUTH_FEATURES, AUTH_WELCOME_TEXTS } from '../config';
import { M } from '@/shared/lib/mantine';

export const GreetingCard = () => (
  <Box
    p="xl"
    bg={M.gradient(M.primary(7))('to bottom left')(M.primary(6))}
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: M.white(),
      height: '100%',
    }}
  >
    <Stack gap="xl" p={{ base: 'xs', md: 'md' }}>
      <Stack gap="xs">
        <Title order={2} fw={800} lts={rem(-0.5)} style={{ color: 'inherit' }}>
          {AUTH_WELCOME_TEXTS.brand}
        </Title>
        <Text size="sm" lh={1.6}>
          {AUTH_WELCOME_TEXTS.tagline}
        </Text>
      </Stack>

      {/* Перенесли скрытие на уровень Stack, у Mantine для этого есть пропс visibleFrom */}
      <Stack gap="md" visibleFrom="sm">
        {AUTH_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Group key={feature.label} gap="md" wrap="nowrap" align="flex-start">
              <ThemeIcon
                size="xl" // Увеличил до xl, чтобы иконка 24px не смотрелась зажатой
                radius="md"
                // Прозрачный белый фон, который мягко накладывается на любой оттенок primary
                bg="rgba(255, 255, 255, 0.12)"
                c={M.white()}
              >
                <Icon size={24} />
              </ThemeIcon>

              <Stack gap={2}>
                <Text size="sm" fw={600} style={{ color: 'inherit' }}>
                  {feature.title}
                </Text>
                <Text size="xs" c="rgba(255, 255, 255, 0.7)">
                  {feature.description}
                </Text>
              </Stack>
            </Group>
          );
        })}
      </Stack>
    </Stack>
  </Box>
);
