import { useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import stationService from "../services/station.service";

export const useStations = () => {
  const {
    data: stations,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: stationService.getStations,
    onSuccess: (responseBody) => {
      return responseBody.data.stations;
    },
  });

  useEffect(() => {
    resolve();
  }, [resolve]);

  return { stations, error, isSuccess, isLoading, isError, isFallback };
};
