import { useState, useCallback, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetSavedPassengers } from "../services/passengersService";
import { passengerListSchema } from "../../../../schemas/passenger";

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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize form with default values
  const defaultValues = {
    passengers: initialPassengers.length > 0 
      ? initialPassengers.map(p => ({
          name: p.name || '',
          email: p.email || '',
          age: p.age || '',
          gender: p.gender || 'Male',
          coachType: p.coachType || defaultCoachType
        }))
      : [{ 
          name: '', 
          email: '', 
          age: '', 
          gender: 'Male', 
          coachType: defaultCoachType 
        }]
  };

  const form = useForm({
    resolver: zodResolver(passengerListSchema),
    defaultValues,
    mode: 'onBlur'
  });

  const { append, remove } = useFieldArray({
    control: form.control,
    name: "passengers"
  });

  // Update passengers' coach types when available coach types become available
  useEffect(() => {
    if (availableCoachTypes.length > 0) {
      const currentPassengers = form.getValues('passengers');
      const updatedPassengers = currentPassengers.map(passenger => {
        const hasValidCoachType = passenger.coachType && 
          availableCoachTypes.some(option => option.value === passenger.coachType);
        
        if (!hasValidCoachType) {
          return { ...passenger, coachType: availableCoachTypes[0].value };
        }
        return passenger;
      });
      
      form.setValue('passengers', updatedPassengers);
    }
  }, [availableCoachTypes, form]);

  const addPassenger = useCallback(() => {
    const defaultCoachType = availableCoachTypes.length > 0 ? availableCoachTypes[0].value : '';
    append({ 
      name: "", 
      email: "", 
      age: "", 
      gender: "Male", 
      coachType: defaultCoachType 
    });
    
    // Clear any general errors when adding a passenger
    form.clearErrors('passengers');
  }, [append, availableCoachTypes, form]);

  const removePassenger = useCallback((index) => {
    remove(index);
    form.clearErrors(`passengers.${index}`);
  }, [remove, form]);

  const updatePassenger = useCallback((index, field, value) => {
    form.setValue(`passengers.${index}.${field}`, value);
    form.trigger(`passengers.${index}.${field}`);
  }, [form]);

  const autofillPassenger = useCallback((index, savedPassenger) => {
    if (!savedPassenger) return;
    
    const currentPassenger = form.getValues(`passengers.${index}`);
    const updatedPassenger = {
      ...currentPassenger,
      name: savedPassenger.name,
      age: savedPassenger.age,
      gender: savedPassenger.gender,
      ...(savedPassenger.email && { email: savedPassenger.email })
    };
    
    form.setValue(`passengers.${index}`, updatedPassenger);
    form.trigger(`passengers.${index}`);
  }, [form]);

  const validateForm = useCallback(() => {
    return form.trigger();
  }, [form]);

  const setSubmitting = useCallback((submitting) => {
    setIsSubmitting(submitting);
  }, []);

  const setSuccess = useCallback((success) => {
    setShowSuccess(success);
  }, []);

  const clearErrors = useCallback(() => {
    form.clearErrors();
  }, [form]);

  // Get passengers data and errors
  const passengers = form.watch('passengers');
  const errors = form.formState.errors;

  // Transform form errors to match the old API for backward compatibility
  const transformedErrors = {};
  if (errors.passengers) {
    if (Array.isArray(errors.passengers)) {
      errors.passengers.forEach((passengerError, index) => {
        if (passengerError) {
          transformedErrors[index] = passengerError;
        }
      });
    } else if (errors.passengers.message) {
      transformedErrors.general = errors.passengers.message;
    }
  }

  return {
    passengers,
    setPassengers: (newPassengers) => form.setValue('passengers', newPassengers),
    errors: transformedErrors,
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
    // Expose form methods for direct access if needed
    register: form.register,
    control: form.control,
    formState: form.formState
  };
}