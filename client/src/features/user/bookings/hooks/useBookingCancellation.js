import { useApi } from "../../../../services/useApi";
import bookingService from "../services/bookingService";

export function useBookingCancellation() {
  const {
    isLoading,
    isError,
    isSuccess,
    error,
    resolve,
  } = useApi({
    endpoint: bookingService.cancelBooking,
    onSuccess: (response) => {
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to cancel booking:", error);
    },
  });

  const cancelBooking = async (bookingId) => {
    await resolve(bookingId);
  };

  return { 
    cancelBooking, 
    isLoading, 
    isError, 
    isSuccess, 
    error 
  };
}