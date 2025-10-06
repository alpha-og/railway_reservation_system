import { createFileRoute } from '@tanstack/react-router';
import ScheduleList from '../../../features/admin/schedules/components/ScheduleList';

export const Route = createFileRoute('/admin/schedules/')({
  component: () => <ScheduleList />
});