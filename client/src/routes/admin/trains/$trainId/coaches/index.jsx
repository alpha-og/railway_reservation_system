/*import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/trains/$trainId/coaches/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/trains/$trainId/coaches/"!</div>
}*/

import { createFileRoute } from '@tanstack/react-router';
import CoachList from '../../../../../features/admin/coaches/components/CoachList';

export const Route = createFileRoute('/admin/trains/$trainId/coaches/')({
  component: () => {
    const { trainId } = Route.useParams();
    return <CoachList trainId={trainId} />;
  },
});
