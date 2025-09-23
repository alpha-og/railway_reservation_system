/*import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/index"!</div>
}*/


import { createFileRoute } from '@tanstack/react-router';
import TrainList from '../../../features/admin/trains/components/TrainList';

export const Route = createFileRoute('/admin/')({
  component: TrainList,
});