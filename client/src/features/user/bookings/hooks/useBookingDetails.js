import { useGetBookingById } from "../services/bookingService";

export function useBookingDetails(bookingId) {
  const {
    data: booking,
    isLoading,
    isFallback,
    isError,
    resolve,
  } = useGetBookingById(bookingId);

  return { booking, isLoading, isFallback, isError, resolve };
}
