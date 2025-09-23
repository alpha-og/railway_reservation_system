

import React from 'react';
import { useParams } from 'react-router-dom'; // or '@tanstack/react-router'
import StationForm from '../components/StationForm';

const EditStationPage = () => {
  const { stationId } = useParams();
  
  return <StationForm isEditing={true} stationId={stationId} />;
};

export default EditStationPage;