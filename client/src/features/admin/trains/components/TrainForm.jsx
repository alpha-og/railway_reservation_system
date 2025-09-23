import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import trainService from '../services/trainService';

const TrainForm = ({ trainId }) => {
  const navigate = useNavigate();
  const isEdit = !!trainId;

  const [formData, setFormData] = useState({
    train_number: '',
    name: '',
    source: '',
    destination: '',
    departure_time: '',
    coaches: [], // array of coach types
  });

  useEffect(() => {
    if (isEdit) {
      const fetchTrain = async () => {
        const response = await trainService.getTrainById(trainId);
        setFormData(response.data);
      };
      fetchTrain();
    }
  }, [trainId, isEdit]);

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCoachChange = (index, value) => {
    const updatedCoaches = [...formData.coaches];
    updatedCoaches[index] = value;
    setFormData(prev => ({ ...prev, coaches: updatedCoaches }));
  };

  const addCoach = () => {
    setFormData(prev => ({ ...prev, coaches: [...prev.coaches, ''] }));
  };

  const removeCoach = (index) => {
    const updatedCoaches = formData.coaches.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, coaches: updatedCoaches }));
  };

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
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Train' : 'Add New Train'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Train Name"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="train_number"
          value={formData.train_number}
          onChange={handleChange}
          placeholder="Train Number"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="source"
          value={formData.source}
          onChange={handleChange}
          placeholder="Source Station"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Destination Station"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="departure_time"
          value={formData.departure_time}
          onChange={handleChange}
          placeholder="Departure Time"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Coaches Section */}
        <div className="space-y-2">
          <label className="font-semibold">Coaches:</label>
          {formData.coaches.map((coach, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={coach}
                onChange={(e) => handleCoachChange(index, e.target.value)}
                placeholder={`Coach type #${index + 1}`}
                className="flex-1 border px-3 py-2 rounded"
              />
              <button
                type="button"
                onClick={() => removeCoach(index)}
                className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCoach}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Coach
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isEdit ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default TrainForm;
