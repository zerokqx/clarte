import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_not-authenticated')({
  beforeLoad(ctx) {
      
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_not-authenticated"!</div>
}
