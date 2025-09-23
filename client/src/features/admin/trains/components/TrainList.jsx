

import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import trainService from '../services/trainService';

const TrainList = () => {
  const [trains, setTrains] = useState([]);
  useEffect(() => {
    const fetchTrains = async () => {
      const response = await trainService.getAllTrains();
      setTrains(response.data);
    };
    fetchTrains();
  }, []);

  const handleDelete = async (id) => {
    await trainService.deleteTrain(id);
    setTrains(trains.filter(train => train.id !== id));
  };

  return (
    <div>
      <h2>Train Management</h2>
      <Link to="/admin/trains/new">
        <button>Add New Train</button>
      </Link>
      <table>
        <tbody>
          {trains.map(train => (
            <tr key={train.id}>
              <td>{train.name}</td>
              <td>
                <Link to={`/admin/trains/${train.id}`}>View</Link>
                <Link to={`/admin/trains/${train.id}/edit`}>Edit</Link>
                <button onClick={() => handleDelete(train.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TrainList;