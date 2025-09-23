import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // or '@tanstack/react-router' if you're using that hook
import { getStation } from '../services/stationService';

const StationDetails = () => {
  const { stationId } = useParams();
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
};

export default StationDetails;