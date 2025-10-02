import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, Button, FormInput } from '../../../../components/ui';
import trainService from '../services/trainService';

const TrainForm = ({ trainId }) => {
  const navigate = useNavigate();
  const isEdit = !!trainId;
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        try {
          const response = await trainService.getTrainById(trainId);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching train:', error);
        } finally {
          setIsLoading(false);
        }
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
    setIsLoading(true);
    
    try {
      if (isEdit) {
        await trainService.updateTrain(trainId, formData);
      } else {
        await trainService.createTrain(formData);
      }
      navigate({ to: '/admin/trains' });
    } catch (error) {
      console.error('Error saving train:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card shadow="xl">
        <Card.Title className="mb-6">
          {isEdit ? 'Edit Train' : 'Add New Train'}
        </Card.Title>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Train Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter train name"
              required
              disabled={isLoading}
            />
            
            <FormInput
              label="Train Number"
              name="train_number"
              value={formData.train_number}
              onChange={handleChange}
              placeholder="Enter train number"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Source Station"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="Enter source station"
              disabled={isLoading}
            />
            
            <FormInput
              label="Destination Station"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination station"
              disabled={isLoading}
            />
          </div>

          <FormInput
            label="Departure Time"
            name="departure_time"
            type="time"
            value={formData.departure_time}
            onChange={handleChange}
            disabled={isLoading}
          />

          {/* Coaches Section */}
          <div className="space-y-4">
            <label className="label">
              <span className="label-text font-semibold">Coaches</span>
            </label>
            
            <div className="space-y-3">
              {formData.coaches.map((coach, index) => (
                <CoachInput
                  key={index}
                  index={index}
                  value={coach}
                  onChange={handleCoachChange}
                  onRemove={removeCoach}
                  disabled={isLoading}
                />
              ))}
            </div>
            
            <Button
              type="button"
              onClick={addCoach}
              variant="success"
              size="sm"
              disabled={isLoading}
            >
              Add Coach
            </Button>
          </div>

          <Card.Actions>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate({ to: '/admin/trains' })}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              fullWidth
            >
              {isEdit ? 'Update Train' : 'Create Train'}
            </Button>
          </Card.Actions>
        </form>
      </Card>
    </div>
  );
};

// Single-use component extracted within the same file
const CoachInput = ({ index, value, onChange, onRemove, disabled }) => (
  <div className="flex gap-2 items-end">
    <div className="flex-1">
      <FormInput
        label={`Coach Type #${index + 1}`}
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Enter coach type`}
        disabled={disabled}
      />
    </div>
    <Button
      type="button"
      onClick={() => onRemove(index)}
      variant="error"
      size="sm"
      disabled={disabled}
      className="mb-2"
    >
      Remove
    </Button>
  </div>
);

export default TrainForm;
