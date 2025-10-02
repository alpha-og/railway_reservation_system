import { useState, useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import bookingService from "../services/booking.service";

export const useTrainBooking = () => {
  const [bookingData, setBookingData] = useState(null);

  const {
    data: bookingResult,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: () => bookingService.createBooking(bookingData),
    onSuccess: (responseBody) => {
      return responseBody.data.booking;
    },
  });

  const createBooking = (data) => {
    setBookingData(data);
    return resolve();
  };

  const resetBooking = () => {
    setBookingData(null);
  };

  return { 
    booking: bookingResult,
    error, 
    isSuccess, 
    isLoading, 
    isError, 
    isFallback,
    createBooking,
    resetBooking
  };
};

export const useBookingDetails = (bookingId) => {
  const {
    data: booking,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: () => bookingService.getBookingDetails(bookingId),
    onSuccess: (responseBody) => {
      return responseBody.data.booking;
    },
  });

  useEffect(() => {
    if (bookingId) {
      resolve();
    }
  }, [bookingId, resolve]);

  return { booking, error, isSuccess, isLoading, isError, isFallback, refetch: resolve };
};

export const useUserBookings = () => {
  const {
    data: bookings,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: bookingService.getUserBookings,
    onSuccess: (responseBody) => {
      return responseBody.data.bookings;
    },
  });

  useEffect(() => {
    resolve();
  }, [resolve]);

  return { bookings, error, isSuccess, isLoading, isError, isFallback, refetch: resolve };
};