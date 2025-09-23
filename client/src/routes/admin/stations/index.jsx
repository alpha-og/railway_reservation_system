/*import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/stations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/stations/"!</div>
}
*/
import { createFileRoute } from '@tanstack/react-router';
import StationsList from '../../../features/admin/stations/components/StationsList';
import { getStations } from '../../../features/admin/stations/services/stationService';

export const Route = createFileRoute('/admin/stations/')({
  component: StationsComponent,
  loader: async () => {
    // This loader fetches ALL stations for the list page.
    return {
      stations: await getStations(),
    };
  },
});

function StationsComponent() {
  const { stations } = Route.useLoaderData();
  return <StationsList initialStations={stations} />;
}