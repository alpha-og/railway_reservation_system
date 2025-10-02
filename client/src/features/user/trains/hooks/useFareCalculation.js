import { useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import fareService from "../services/fare.service.js";

export const useFareCalculation = ({ train_id, coach_type_ids, from_station_id, to_station_id, enabled = true }) => {
  const {
    data: fareCalculations,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: () => fareService.calculateMultipleFares({
      train_id,
      coach_type_ids,
      from_station_id,
      to_station_id
    }),
    onSuccess: (responseBody) => {
      return responseBody;
    },
  });

  // Automatically trigger the API call when dependencies change and enabled is true
  useEffect(() => {
    if (enabled && train_id && coach_type_ids?.length > 0 && from_station_id && to_station_id) {
      resolve();
    }
  }, [enabled, train_id, coach_type_ids, from_station_id, to_station_id, resolve]);

  return { 
    fareCalculations, 
    error, 
    isSuccess, 
    isLoading, 
    isError, 
    isFallback, 
    refetch: resolve 
  };
};