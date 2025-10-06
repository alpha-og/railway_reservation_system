import { createFileRoute, useParams } from '@tanstack/react-router';
import ScheduleEdit from '../../../../features/admin/schedules/components/ScheduleEdit';

export const Route = createFileRoute('/admin/schedules/$scheduleId/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  const { scheduleId } = useParams({ from: '/admin/schedules/$scheduleId/edit' });
  return <ScheduleEdit scheduleId={scheduleId} />;
}