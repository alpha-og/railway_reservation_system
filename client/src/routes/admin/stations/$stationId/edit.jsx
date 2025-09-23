/*import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/stations/$stationId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/stations/$stationId/edit"!</div>
}*/

import { createFileRoute } from '@tanstack/react-router';
import StationForm from '../../../../features/admin/stations/components/StationForm';

export const Route = createFileRoute('/admin/stations/$stationId/edit')({
  component: EditStationPage,
});

function EditStationPage() {
  const { stationId } = Route.useParams();
  return <StationForm isEditing={true} stationId={stationId} />;
}
