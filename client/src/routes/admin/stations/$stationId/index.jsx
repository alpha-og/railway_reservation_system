/*import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/stations/$stationId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/stations/$stationId/"!</div>
}
*/
/*
import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { getStation } from '../../../../features/admin/stations/services/stationService';

export const Route = createFileRoute('/admin/stations/$stationId/')({
  component: StationDetailsComponent,
});

function StationDetailsComponent() {
  const { stationId } = Route.useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getStation(stationId)
      .then(data => {
        setStation(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [stationId]);

  if (loading) return <div>Loading station details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!station) return <div>Station not found.</div>;

  return (
    <div>
      <h2>Station Details: {station.name}</h2>
      <p>ID: {station.id}</p>
      <p>Code: {station.code}</p>
    </div>
  );
}*/

import { createFileRoute } from '@tanstack/react-router';
import StationDetails from '../../../../features/admin/stations/$stationId/index';

export const Route = createFileRoute('/admin/stations/$stationId/')({
  component: StationDetails,
});