

import React from 'react';
import { useParams } from 'react-router-dom';

const StationSearchPage = () => {
  const { stationId } = useParams();

  return (
    <div>
      <h2>Search from Station ID: {stationId}</h2>
      <p>This page would contain a search form and logic specific to this station.</p>
    </div>
  );
};

export default StationSearchPage;