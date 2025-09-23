import { createFileRoute } from '@tanstack/react-router';
import TrainForm from '../../../../features/admin/trains/components/TrainForm';

function EditTrain() {
  const { trainId } = Route.useParams();
  return <TrainForm trainId={trainId} />;
}

export const Route = createFileRoute('/admin/trains/$trainId/edit')({
  component: EditTrain,
});
