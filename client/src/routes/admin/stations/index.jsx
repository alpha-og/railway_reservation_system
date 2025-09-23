import { createFileRoute } from '@tanstack/react-router';
import StationsList from '../../../features/admin/stations/components/StationsList';
import { getStations } from '../../../features/admin/stations/services/stationService';

export const Route = createFileRoute('/admin/stations/')({
  component: StationsComponent,
  loader: async () => {
    return {
      stations: await getStations(),
    };
  },
});

function StationsComponent() {
  const { stations } = Route.useLoaderData();
  return <StationsList initialStations={stations} />;
}