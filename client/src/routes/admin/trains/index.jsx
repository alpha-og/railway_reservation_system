import { createFileRoute } from '@tanstack/react-router';
import TrainList from '../../../features/admin/trains/components/TrainList';

export const Route = createFileRoute('/admin/trains/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><TrainList/></div>
}
