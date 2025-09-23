

import React from 'react';
import { Link } from '@tanstack/react-router';
import { deleteStation } from '../services/stationService';
import '../styles/StationsList.css';

const StationsList = ({ initialStations = [] }) => {
  const [stations, setStations] = React.useState(initialStations);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        await deleteStation(id);
        setStations(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2>Manage Stations</h2>
      <Link to="/admin/stations/new">
        <button>Add New Station</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <tr key={station.id}>
              <td>{station.id}</td>
              <td>{station.name}</td>
              <td>{station.code}</td>
              <td>
                <Link to={`/admin/stations/${station.id}/edit`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => handleDelete(station.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StationsList;