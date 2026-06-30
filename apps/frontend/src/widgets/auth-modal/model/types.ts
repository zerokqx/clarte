import { useModalsStack } from '@mantine/core';

export type AuthModalStack = ReturnType<typeof useModalsStack<'login' | 'register'>>;
