

import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getStation, addStation, updateStation } from '../services/stationService';
import '../styles/StationForm.css';

const StationForm = ({ isEditing, stationId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && stationId) {
      getStation(stationId)
        .then(data => {
          setFormData(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [isEditing, stationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateStation(formData);
      } else {
        await addStation(formData);
      }
      navigate({ to: '/admin/stations' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading form...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Station' : 'Add New Station'}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <label>
        Station Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Station Code:
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
      <button type="button" onClick={() => navigate({ to: '/admin/stations' })}>
        Cancel
      </button>
    </form>
  );
};

export default StationForm;