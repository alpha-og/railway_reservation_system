import { createFileRoute } from '@tanstack/react-router';
import TrainEdit from '../../../../features/admin/trains/components/TrainEdit';

export const Route = createFileRoute('/admin/trains/$trainId/edit')({
  component: TrainEdit,
});
