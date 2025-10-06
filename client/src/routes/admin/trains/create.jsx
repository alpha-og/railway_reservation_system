import { createFileRoute } from '@tanstack/react-router';
import TrainCreate from '../../../features/admin/trains/components/TrainCreate';

export const Route = createFileRoute('/admin/trains/create')({
  component: TrainCreate,
});
