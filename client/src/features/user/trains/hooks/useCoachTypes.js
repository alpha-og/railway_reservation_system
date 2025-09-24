import { useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import coachTypeService from "../services/coachType.service.js";

export const useCoachTypes = () => {
  const {
    data: coachTypes,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: coachTypeService.getCoachTypes,
    onSuccess: (responseBody) => {
      return responseBody.data.coachTypes;
    },
  });

  useEffect(() => {
    resolve();
  }, [resolve]);

  return { coachTypes, error, isSuccess, isLoading, isError, isFallback };
};
