/*import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/trains/$trainId/coaches/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/trains/$trainId/coaches/new"!</div>
}*/

import { createFileRoute } from '@tanstack/react-router';
import CoachForm from '../../../../../features/admin/coaches/components/CoachForm';

export const Route = createFileRoute('/admin/trains/$trainId/coaches/new')({
  component: () => {
    const { trainId } = Route.useParams();
    return <CoachForm trainId={trainId} />;
  },
});
