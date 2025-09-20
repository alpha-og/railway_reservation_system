import { useEffect } from "react";
import { useGetBookingsByUserId } from "../services/bookingService";

export function useUserBookings(userId) {
  const {
    resolve,
    data: bookings = [],
    isLoading,
    isError,
    isFallback,
  } = useGetBookingsByUserId(userId);

  useEffect(() => {
    if (userId) resolve();
  }, [userId, resolve]);

  return { bookings, isLoading, isError, isFallback };
}
