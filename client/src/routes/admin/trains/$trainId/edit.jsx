import { createFileRoute, useParams } from '@tanstack/react-router';
import TrainEdit from '../../../../features/admin/trains/components/TrainEdit';

export const Route = createFileRoute('/admin/trains/$trainId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { trainId } = useParams({ from: '/admin/trains/$trainId/edit' });
  return <div><TrainEdit trainId={trainId}/></div>
}
