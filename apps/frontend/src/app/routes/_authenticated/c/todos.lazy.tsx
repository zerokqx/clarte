import { TodosPage } from '@/pages/todos'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/c/todos')({
  component: TodosPage,
})

