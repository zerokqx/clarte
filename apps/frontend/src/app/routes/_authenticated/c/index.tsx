import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/c/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/c/"!</div>
}
