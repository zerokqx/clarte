import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_not-authenticated/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_not-authenticated/login"!</div>
}
