import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import trainService from '../services/trainService';

const TrainForm = ({ trainId }) => {
  const navigate = useNavigate();
  const isEdit = !!trainId;
  const [formData, setFormData] = useState({ train_number: '', name: '', source: '', destination: '', departure_time: '' });
  useEffect(() => {
    if (isEdit) {
      const fetchTrain = async () => {
        const response = await trainService.getTrainById(trainId);
        setFormData(response.data);
      };
      fetchTrain();
    }
  }, [trainId, isEdit]);
  const handleChange = (e) => setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await trainService.updateTrain(trainId, formData);
    } else {
      await trainService.createTrain(formData);
    }
    navigate({ to: '/admin/trains' });
  };
  return (
    <div>
      <h2>{isEdit ? 'Edit Train' : 'Add New Train'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};
export default TrainForm;