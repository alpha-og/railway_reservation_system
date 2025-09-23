
import { createFileRoute } from '@tanstack/react-router';
import CoachForm from '../../../../../../features/admin/coaches/components/CoachForm';

export const Route = createFileRoute('/admin/trains/$trainId/coaches/$coachId/edit')({
  component: () => {
    const { trainId, coachId } = Route.useParams();
    return <CoachForm trainId={trainId} coachId={coachId} />;
  },
});
