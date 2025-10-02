import { useApiWithFallback } from "../../../../services/useApiWithFallback";
import coachTypeService from "../services/coachType.service";
import availabilityService from "../services/availability.service";
import { useCallback, useMemo } from "react";

export function useCoachTypes() {
  const {
    data: coachTypes,
    isLoading,
    isFallback,
  } = useApiWithFallback({
    endpoint: coachTypeService.getCoachTypes,
    fallbackData: coachTypeService.fallbackCoachTypes,
  });

  const getCoachPrice = useCallback((coachTypeNameOrId) => {
    // If it's a UUID, find the coach type name first
    if (coachTypes && coachTypeNameOrId?.length > 10) { // Assume UUID if longer than 10 chars
      const coachType = coachTypes.find(ct => ct.id === coachTypeNameOrId);
      if (coachType) {
        return coachTypeService.getCoachTypePrice(coachType.name, coachTypes);
      }
    }
    // Otherwise treat as coach type name
    return coachTypeService.getCoachTypePrice(coachTypeNameOrId, coachTypes);
  }, [coachTypes]);

  const getCoachTypeName = useCallback((coachTypeId) => {
    if (!coachTypes || !coachTypeId) return '';
    const coachType = coachTypes.find(ct => ct.id === coachTypeId);
    return coachType?.name || coachTypeId;
  }, [coachTypes]);

  const getCoachTypeOptions = useCallback((availabilityData) => {
    if (!availabilityData?.data?.availableSeats || !coachTypes) return [];

    // Group availability by coach type to avoid duplicates and sum seats
    const coachTypeMap = new Map();
    
    availabilityData.data.availableSeats.forEach(availability => {
      if (availability.available_seats > 0) {
        const existing = coachTypeMap.get(availability.coach_type);
        if (existing) {
          existing.available_seats += parseInt(availability.available_seats, 10);
        } else {
          coachTypeMap.set(availability.coach_type, {
            coach_type: availability.coach_type,
            available_seats: parseInt(availability.available_seats, 10)
          });
        }
      }
    });

    // Convert map to array and create options
    return Array.from(coachTypeMap.values()).map((availability) => {
      // Find the matching coach type data for pricing
      const coachType = coachTypes.find(ct => ct.name === availability.coach_type);
      const price = coachType ? getCoachPrice(availability.coach_type) : 0;
      
      return {
        value: coachType?.id || availability.coach_type, // Use UUID as value
        label: `${coachTypeService.normalizeCoachTypeName(availability.coach_type)} (₹${price}) - ${availability.available_seats} seats available`,
        disabled: false, // All shown options are available
        coachTypeName: availability.coach_type // Keep name for reference
      };
    });
  }, [coachTypes, getCoachPrice]);

  return {
    coachTypes: Array.isArray(coachTypes) ? coachTypes : [],
    isLoading,
    isFallback,
    getCoachPrice,
    getCoachTypeName,
    getCoachTypeOptions,
  };
}

export function useScheduleAvailability(scheduleId) {
  // Memoize the endpoint function to prevent infinite requests
  const endpoint = useMemo(() => {
    return scheduleId
      ? () => availabilityService.getScheduleAvailability(scheduleId)
      : null;
  }, [scheduleId]);

  const {
    data: availabilityData,
    isLoading,
    isFallback,
  } = useApiWithFallback({
    endpoint,
    fallbackData: null,
  });

  return {
    availabilityData,
    isLoading,
    isFallback,
  };
}


