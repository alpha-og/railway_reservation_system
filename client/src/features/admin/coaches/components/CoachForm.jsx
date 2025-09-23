import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import coachService from '../services/coachService';

const CoachForm = ({ trainId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ train_id: parseInt(trainId), type: '', number: '', seats: '' });
  const handleChange = (e) => setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    await coachService.createCoach(formData);
    navigate({ to: `/admin/trains/${trainId}/coaches` });
  };
  return (
    <div>
      <h2>Add Coach to Train ID: {trainId}</h2>
      <form onSubmit={handleSubmit}>
        <input name="number" onChange={handleChange} placeholder="Coach Number" required />
        <button type="submit">Add Coach</button>
      </form>
    </div>
  );
};
export default CoachForm;