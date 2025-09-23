import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/trains/coaches/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/trains/coaches/"!</div>
}
