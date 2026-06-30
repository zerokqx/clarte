import { Box, Group, Stack, Text, Title, ThemeIcon } from '@mantine/core';
import { AUTH_FEATURES, AUTH_WELCOME_TEXTS } from '../config';

export const GreetingCard = () => (
  <Box
    p="xl"
    bg="linear-gradient(135deg, var(--mantine-color-violet-9) 0%, var(--mantine-color-violet-7) 100%)"
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: '#fff',
      height: '100%',
    }}
  >
    <Stack gap="lg" p={{ base: 'xs', md: 'md' }}>
      <Stack gap="xs">
        <Title order={2} style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem' }}>
          {AUTH_WELCOME_TEXTS.brand}
        </Title>
        <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
          {AUTH_WELCOME_TEXTS.tagline}
        </Text>
      </Stack>

      <Stack gap="sm" visibleFrom="sm">
        {AUTH_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Group key={feature.label} gap="sm" wrap="nowrap" align="center">
              <ThemeIcon
                size="lg"
                radius="md"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
              >
                <Icon size={24} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={600} style={{ color: '#fff' }}>
                  {feature.title}
                </Text>
                <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
