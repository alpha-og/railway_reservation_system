import { useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import availabilityService from "../services/availability.service";

export const useTrainAvailability = (trainId, date) => {
  const {
    data: availability,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: () => availabilityService.getTrainAvailability(trainId, date),
    onSuccess: (responseBody) => {
      return responseBody.data.availability;
    },
  });

  useEffect(() => {
    if (trainId && date) {
      resolve();
    }
  }, [trainId, date, resolve]);

  return { availability, error, isSuccess, isLoading, isError, isFallback, refetch: resolve };
};