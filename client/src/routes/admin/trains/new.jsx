

import { createFileRoute } from '@tanstack/react-router';
import TrainForm from '../../../features/admin/trains/components/TrainForm';

export const Route = createFileRoute('/admin/trains/new')({
  component: TrainForm,
});