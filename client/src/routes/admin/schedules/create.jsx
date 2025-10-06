import { createFileRoute } from '@tanstack/react-router';
import ScheduleCreate from '../../../features/admin/schedules/components/ScheduleCreate';

export const Route = createFileRoute('/admin/schedules/create')({
  component: () => <ScheduleCreate />
});