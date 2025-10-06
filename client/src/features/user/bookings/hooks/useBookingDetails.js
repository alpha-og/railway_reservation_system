import { useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import bookingService from "../services/bookingService";

export function useBookingDetails(bookingId) {
  const {
    data: booking,
    isLoading,
    isError,
    resolve,
  } = useApi({
    endpoint: bookingService.getBookingById,
    onSuccess: (response) => {
      return response.data.booking;
    },
    onError: (error) => {
      console.error("Failed to fetch booking details:", error);
    },
  });

  useEffect(() => {
    // Only make API call if bookingId is defined and not empty
    if (bookingId && bookingId !== "undefined" && bookingId.trim() !== "") {
      resolve(bookingId);
    }
  }, [bookingId, resolve]);

  return { booking, isLoading, isError, resolve };
}
