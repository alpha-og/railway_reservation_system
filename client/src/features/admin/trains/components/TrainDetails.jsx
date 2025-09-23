
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
    <div>
      {train ? (
        <>
          <h2>{train.name} Details</h2>
          <p>Train Number: {train.train_number}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default TrainDetails;