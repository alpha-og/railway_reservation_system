import { createFileRoute } from '@tanstack/react-router';
import TrainDetail from '../../../../features/admin/trains/components/TrainDetail';

export const Route = createFileRoute('/admin/trains/$trainId/details')({
  component: TrainDetail,
});
