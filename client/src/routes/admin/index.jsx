import { createFileRoute } from '@tanstack/react-router';
import TrainList from '../../features/admin/trains/components/TrainList';

export const Route = createFileRoute('/admin/')({
  component: TrainList,
});