import client from "../../../../services/config/axiosClient.js";

const getUserBookings = async () => {
  return (await client.get("/bookings")).data;
};

const getBookingById = async (bookingId) => {
  return (await client.get(`/bookings/${bookingId}`)).data;
};

const createBooking = async (bookingData) => {
  return (await client.post("/bookings", bookingData)).data;
};

const confirmBooking = async (bookingId) => {
  return (await client.patch(`/bookings/${bookingId}/confirm`)).data;
};

const cancelBooking = async (bookingId) => {
  return (await client.patch(`/bookings/${bookingId}/cancel`)).data;
};

const getBookingByPnr = async (pnr) => {
  return (await client.get(`/bookings/pnr/${pnr}`)).data;
};

export default {
  getUserBookings,
  getBookingById,
  getBookingByPnr,
  createBooking,
  confirmBooking,
  cancelBooking,
};
