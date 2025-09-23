
import { createFileRoute } from '@tanstack/react-router';
import TrainDetails from '../../../../features/admin/trains/components/TrainDetails';

export const Route = createFileRoute('/admin/trains/$trainId/')({
  component: () => {
    const { trainId } = Route.useParams();
    return <TrainDetails trainId={trainId} />;
  },
});