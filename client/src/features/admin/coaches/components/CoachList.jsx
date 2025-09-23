import React, { useEffect, useState } from 'react';
import coachService from '../services/coachService';
import { Link } from '@tanstack/react-router';

const CoachList = ({ trainId }) => {
  const [coaches, setCoaches] = useState([]);
  useEffect(() => {
    const fetchCoaches = async () => {
      const response = await coachService.getCoachesByTrainId(trainId);
      setCoaches(response.data);
    };
    fetchCoaches();
  }, [trainId]);

  const handleDelete = async (id) => {
    await coachService.deleteCoach(id);
    setCoaches(coaches.filter(coach => coach.id !== id));
  };

  return (
    <div>
      <h3>Coaches for Train ID: {trainId}</h3>
      <Link to={`/admin/trains/${trainId}/coaches/new`}>
        <button>Add New Coach</button>
      </Link>
      <ul>
        {coaches.map(coach => (
          <li key={coach.id}>
            Coach {coach.number} ({coach.type})
            <Link to={`/admin/trains/${trainId}/coaches/${coach.id}/edit`}>Edit</Link>
            <button onClick={() => handleDelete(coach.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CoachList;