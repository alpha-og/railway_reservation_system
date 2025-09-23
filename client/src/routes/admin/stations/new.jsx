/*import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/stations/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/stations/new"!</div>
}*/

import { createFileRoute } from '@tanstack/react-router';
import StationForm from '../../../features/admin/stations/components/StationForm';

export const Route = createFileRoute('/admin/stations/new')({
  component: NewStationPage,
});

function NewStationPage() {
  return <StationForm isEditing={false} />;
}
