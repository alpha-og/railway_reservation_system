import { useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import bookingService from "../services/bookingService";

export function useUserBookings() {
  const {
    resolve,
    data: bookings,
    isLoading,
    isError,
    isSuccess,
  } = useApi({
    endpoint: bookingService.getUserBookings,
    onSuccess: (data) => {
      // Extract bookings array from response
      const bookingsArray = data?.data.bookings || [];
      return Array.isArray(bookingsArray) ? bookingsArray : [];
    },
    onError: (error) => {
      console.error("Failed to fetch user bookings:", error);
    },
  });

  useEffect(() => {
    resolve();
  }, [resolve]);

  return {
    bookings: bookings || [],
    isLoading,
    isError,
    isSuccess,
  };
}
