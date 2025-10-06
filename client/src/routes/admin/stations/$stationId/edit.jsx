import { createFileRoute, useParams } from '@tanstack/react-router';
import StationEdit from '../../../../features/admin/stations/components/StationEdit';

export const Route = createFileRoute('/admin/stations/$stationId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { stationId } = useParams({ from: '/admin/stations/$stationId/edit' });
  return <div><StationEdit stationId={stationId}/></div>
}
