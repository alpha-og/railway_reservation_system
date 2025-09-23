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
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Train Management</h2>
      <Link to="/admin/trains/new">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">
          Add New Train
        </button>
      </Link>
      <table className="min-w-full bg-white border border-gray-200 rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Coaches</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trains.map(train => (
            <tr key={train.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{train.name}</td>
              <td className="py-2 px-4 border-b">
                {train.coaches && train.coaches.length > 0
                  ? train.coaches.join(', ')
                  : 'No coaches'}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <Link
                  className="text-blue-600 hover:underline"
                  to={`/admin/trains/${train.id}`}
                >
                  View
                </Link>
                <Link
                  className="text-yellow-600 hover:underline"
                  to={`/admin/trains/${train.id}/edit`}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(train.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainList;
