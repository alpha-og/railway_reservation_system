import { useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import scheduleService from "../services/schedule.service";

export const useScheduleSummary = (scheduleStopId) => {
  const {
    data: scheduleSummary,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: scheduleService.getScheduleByScheduleStopId,
    onSuccess: (responseBody) => {
      return responseBody.data;
    },
  });

  useEffect(() => {
    if (scheduleStopId) {
      resolve(scheduleStopId);
    }
  }, [scheduleStopId, resolve]);

  return {
    scheduleSummary,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    refetch: resolve,
  };
};
