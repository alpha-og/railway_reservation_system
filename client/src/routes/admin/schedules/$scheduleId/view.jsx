import { createFileRoute, useParams } from '@tanstack/react-router';
import ScheduleView from '../../../../features/admin/schedules/components/ScheduleView';

export const Route = createFileRoute('/admin/schedules/$scheduleId/view')({
  component: RouteComponent,
});

function RouteComponent() {
  const { scheduleId } = useParams({ from: '/admin/schedules/$scheduleId/view' });
  return <ScheduleView scheduleId={scheduleId} />;
}