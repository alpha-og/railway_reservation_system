import { createFileRoute } from '@tanstack/react-router';
import TrainView from '../../../../features/admin/trains/components/TrainView';

export const Route = createFileRoute('/admin/trains/$trainId/view')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><TrainView/></div>
}
