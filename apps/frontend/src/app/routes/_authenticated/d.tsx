import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/d')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/authenticated/d"!</div>;
}
