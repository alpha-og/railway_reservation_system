/*import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/coaches/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/coaches/"!</div>
}*/


import { createFileRoute } from '@tanstack/react-router';
import CoachList from '../../../features/admin/coaches/components/CoachList';

export const Route = createFileRoute('/admin/coaches/')({
  component: CoachList,
});