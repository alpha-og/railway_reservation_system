import { createFileRoute, useParams } from '@tanstack/react-router';
import TrainView from '../../../../features/admin/trains/components/TrainView';

export const Route = createFileRoute('/admin/trains/$trainId/view')({
  component: RouteComponent,
})

function RouteComponent() {
  const { trainId } = useParams({ from: '/admin/trains/$trainId/view' });
  return <div><TrainView trainId={trainId}/></div>
}
