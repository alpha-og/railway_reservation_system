import { createFileRoute } from '@tanstack/react-router';
import StationCreate from '../../../features/admin/stations/components/StationCreate';

export const Route = createFileRoute('/admin/stations/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><StationCreate/></div>
}