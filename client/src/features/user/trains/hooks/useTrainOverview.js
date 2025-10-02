import { useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import trainService from "../services/trainService";

export const useTrainOverview = (trainId) => {
  const {
    data: trainResult,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: trainService.getTrainOverview,
    onSuccess: (responseBody) => {
      return responseBody.data;
    },
  });

  useEffect(() => {
    if (trainId) {
      resolve(trainId);
    }
  }, [trainId, resolve]);

  return {
    train: trainResult,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
  };
};
