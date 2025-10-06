import { useState, useCallback, useEffect } from "react";
import { useGetSavedPassengers } from "../services/passengersService";
import { validatePassenger, validatePassengerList } from "../../../../lib/validationUtils";

export function useSavedPassengers() {
  const {
    data: savedPassengers,
    isLoading,
    isError,
    isFallback,
  } = useGetSavedPassengers();

  return { 
    savedPassengers: Array.isArray(savedPassengers) ? savedPassengers : [], 
    isLoading, 
    isError, 
    isFallback 
  };
}

export function usePassengerForm(initialPassengers = [], availableCoachTypes = []) {
  const defaultCoachType = availableCoachTypes.length > 0 ? availableCoachTypes[0].value : '';
  
  const [passengers, setPassengers] = useState(initialPassengers);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Update passengers' coach types when available coach types become available
  useEffect(() => {
    if (availableCoachTypes.length > 0) {
      setPassengers(prev => prev.map(passenger => {
        const hasValidCoachType = passenger.coachType && 
          availableCoachTypes.some(option => option.value === passenger.coachType);
        
        if (!hasValidCoachType) {
          return { ...passenger, coachType: availableCoachTypes[0].value };
        }
        return passenger;
      }));
    }
  }, [availableCoachTypes]);

  const addPassenger = useCallback(() => {
    const defaultCoachType = availableCoachTypes.length > 0 ? availableCoachTypes[0].value : '';
    setPassengers(prev => [...prev, { name: "", email: "", age: "", gender: "Male", coachType: defaultCoachType }]);
    const newErrors = { ...errors };
    delete newErrors.general;
    setErrors(newErrors);
  }, [errors, availableCoachTypes]);

  const removePassenger = useCallback((index) => {
    setPassengers(prev => prev.filter((_, i) => i !== index));
    
    const newErrors = { ...errors };
    delete newErrors[index];
    
    // Reindex remaining passenger errors
    const reindexedErrors = {};
    Object.keys(newErrors).forEach(key => {
      if (key !== 'general' && parseInt(key) > index) {
        reindexedErrors[parseInt(key) - 1] = newErrors[key];
      } else if (key !== 'general' && parseInt(key) < index) {
        reindexedErrors[key] = newErrors[key];
      } else if (key === 'general') {
        reindexedErrors[key] = newErrors[key];
      }
    });
    setErrors(reindexedErrors);
  }, [errors]);

  const updatePassenger = useCallback((index, field, value) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
    
    // Real-time validation
    const passengerErrors = validatePassenger(passengers[index] ? { ...passengers[index], [field]: value } : { [field]: value });
    const newErrors = { ...errors };
    
    if (Object.keys(passengerErrors).length === 0) {
      delete newErrors[index];
    } else {
      newErrors[index] = passengerErrors;
    }
    
    setErrors(newErrors);
  }, [passengers, errors]);

  const autofillPassenger = useCallback((index, savedPassenger) => {
    if (!savedPassenger) return;
    
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        name: savedPassenger.name,
        age: savedPassenger.age,
        gender: savedPassenger.gender,
        ...(savedPassenger.email && { email: savedPassenger.email })
      };
      return updated;
    });
  }, []);

  const validateForm = useCallback(() => {
    const validationErrors = validatePassengerList(passengers);
    setErrors(validationErrors || {});
    return !validationErrors;
  }, [passengers]);

  const setSubmitting = useCallback((submitting) => {
    setIsSubmitting(submitting);
  }, []);

  const setSuccess = useCallback((success) => {
    setShowSuccess(success);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    passengers,
    setPassengers,
    errors,
    isSubmitting,
    showSuccess,
    addPassenger,
    removePassenger,
    updatePassenger,
    autofillPassenger,
    validateForm,
    setSubmitting,
    setSuccess,
    clearErrors,
  };
}