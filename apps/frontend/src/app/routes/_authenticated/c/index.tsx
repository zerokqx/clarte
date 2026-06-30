import { authStore } from '@/entities/session';
import { ClarteEditor } from '@/widgets/editor';
import { Button } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';

export const Route = createFileRoute('/_authenticated/c/')({
  component: () => <RouteComponent />,
});

const RouteComponent = observer(() => {
  return <ClarteEditor documentId='8e4f995f-e396-4a55-aeaa-1ae6693a21c7'/>
});
