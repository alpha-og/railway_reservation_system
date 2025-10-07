import { createFileRoute, useParams } from '@tanstack/react-router';
import StationView from '../../../../features/admin/stations/components/StationView';

export const Route = createFileRoute('/admin/stations/$stationId/view')({
  component: RouteComponent,
})

function RouteComponent() {
  const { stationId } = useParams({ from: '/admin/stations/$stationId/view' });
  return <div><StationView stationId={stationId}/></div>
}
