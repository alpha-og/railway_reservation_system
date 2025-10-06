import React from 'react';
import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router';
import { EditStationComponent } from '../../../features/admin/stations/components/edit';

export const Route = createFileRoute('/admin/stations/$stationId/edit')({
  component: EditStationRoute,
});

function EditStationRoute() {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: '/admin/stations' });
  };

  return (
    <EditStationComponent 
      stationId={stationId} 
      onUpdateSuccess={handleSuccess} 
      onCancel={handleSuccess}
    />
  );
}
