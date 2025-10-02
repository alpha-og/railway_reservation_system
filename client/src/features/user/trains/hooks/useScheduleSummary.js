import { useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import scheduleService from "../services/schedule.service";

export const useScheduleSummary = (scheduleId) => {
  const {
    data: scheduleSummary,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: scheduleService.getScheduleSummaryByScheduleId,
    onSuccess: (responseBody) => {
      return responseBody.data;
    },
  });

  useEffect(() => {
    if (scheduleId) {
      resolve(scheduleId);
    }
  }, [scheduleId, resolve]);

  useEffect(() => {
    if (scheduleSummary) {
      console.log(scheduleSummary);
    }
  }, [scheduleSummary]);

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
