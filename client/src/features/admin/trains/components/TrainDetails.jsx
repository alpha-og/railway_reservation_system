import React, { useEffect, useState } from 'react';
import trainService from '../services/trainService';

const TrainDetails = ({ trainId }) => {
  const [train, setTrain] = useState(null);

  useEffect(() => {
    const fetchTrain = async () => {
      const response = await trainService.getTrainById(trainId);
      setTrain(response.data);
    };
    fetchTrain();
  }, [trainId]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      {train ? (
        <>
          <h2 className="text-2xl font-bold mb-2">{train.name} Details</h2>
          <p className="mb-1"><strong>Train Number:</strong> {train.train_number}</p>
          <p className="mb-1"><strong>Source:</strong> {train.source}</p>
          <p className="mb-1"><strong>Destination:</strong> {train.destination}</p>
          <p className="mb-1"><strong>Departure Time:</strong> {train.departure_time}</p>
          <div className="mt-4">
            <strong>Coaches:</strong>
            {train.coaches && train.coaches.length > 0 ? (
              <ul className="list-disc list-inside mt-1">
                {train.coaches.map((coach, index) => (
                  <li key={index}>{coach}</li>
                ))}
              </ul>
            ) : (
              <p>No coaches added</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TrainDetails;
