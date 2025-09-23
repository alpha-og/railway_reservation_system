/*import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/trains/$trainId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/trains/$trainId/edit"!</div>
}*/

/*
import { createFileRoute } from '@tanstack/react-router';
import TrainForm from '../../../../features/admin/trains/components/TrainForm';

export const Route = createFileRoute('/admin/trains/$trainId/edit')({
  component: () => {
    const { trainId } = Route.useParams();
    return <TrainForm trainId={trainId} />;
  },
});*/

import { createFileRoute } from '@tanstack/react-router';
import TrainForm from '../../../../features/admin/trains/components/TrainForm';

export const Route = createFileRoute('/admin/trains/$trainId/edit')({
  component: () => {
    const { trainId } = Route.useParams();
    return <TrainForm trainId={trainId} />;
  },
});