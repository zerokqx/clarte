import { authStore } from '@/entities/session';
import { Button } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';

export const Route = createFileRoute('/_authenticated/c/')({
  component: () => <RouteComponent />,
});

const RouteComponent = observer(() => {
  return <Button onClick={() => authStore.setAnonymous()}>dawdaw</Button>;
});
