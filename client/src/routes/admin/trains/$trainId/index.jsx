import { createFileRoute } from '@tanstack/react-router';
import TrainDetails from '../../../../features/admin/trains/components/TrainDetails';

function TrainDetailsPage() {
  const { trainId } = Route.useParams();
  return <TrainDetails trainId={trainId} />;
}

export const Route = createFileRoute('/admin/trains/$trainId/')({
  component: TrainDetailsPage,
});
