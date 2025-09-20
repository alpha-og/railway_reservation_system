// src/features/bookings/services/bookingService.js
import axiosClient from "../../../../services/config/axiosClient";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useApiWithFallback } from "../../../../services/useApiWithFallback";

// --- Demo / fallback bookings ---
const demoBookings = [
  {
    bookingId: "DEMO1",
    pnr: "PNR1A2B3C",
    train: { name: "Express A", code: "12345" },
    source: "Station X",
    destination: "Station Y",
    departureDate: "2025-10-25",
    passengers: [{ name: "John Doe" }],
    totalAmount: 500.0,
    status: "CONFIRMED",
  },
  {
    bookingId: "DEMO2",
    pnr: "PNR4D5E6F",
    train: { name: "Express B", code: "67890" },
    source: "Station P",
    destination: "Station R",
    departureDate: "2025-11-01",
    passengers: [{ name: "Peter Jones", age: 45, seat: "A2-10" }],
    totalAmount: 800.0,
    status: "CONFIRMED",
  },
];

const createAuthHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

// --- Hook: Get all bookings by userId ---
export const useGetBookingsByUserId = (userId) => {
  const token = useAuthStore((state) => state.token);

  return useApiWithFallback({
    fallbackKey: `bookingsByUser_${userId || "fallback"}`,
    endpoint: async () => {
      // Short-circuit to demo data if userId missing
      if (!userId) return demoBookings;

      const res = await axiosClient.get(`/users/${userId}/bookings`, {
        headers: createAuthHeaders(token),
      });
      return res.data;
    },
    fallbackData: demoBookings,
  });
};

// --- Hook: Get single booking by bookingId ---
export const useGetBookingById = (bookingId) => {
  const token = useAuthStore((state) => state.token);

  const fallbackBooking =
    bookingId && demoBookings.find((b) => b.bookingId === bookingId);

  return useApiWithFallback({
    fallbackKey: `bookingById_${bookingId || "fallback"}`,
    endpoint: async () => {
      // Short-circuit to demo data if bookingId missing
      if (!bookingId || fallbackBooking) return fallbackBooking || null;

      const res = await axiosClient.get(`/bookings/${bookingId}`, {
        headers: createAuthHeaders(token),
      });
      return res.data;
    },
    fallbackData: fallbackBooking || null,
  });
};
