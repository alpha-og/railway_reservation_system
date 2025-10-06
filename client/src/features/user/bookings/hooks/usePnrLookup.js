import { useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import bookingService from "../services/bookingService";

export const usePnrLookup = () => {
  const {
    resolve: lookupPnr,
    isLoading,
    isError,
    isSuccess,
    error,
    data: booking,
  } = useApi({
    endpoint: bookingService.getBookingByPnr,
    onSuccess: (response) => response.data.booking,
  });

  return {
    lookupPnr,
    booking,
    isLoading,
    isError,
    isSuccess,
    error,
  };
};

