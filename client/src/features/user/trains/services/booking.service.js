import client from "../../../../services/config/axiosClient.js";

async function createBooking(bookingData) {
  return (
    await client.post("/bookings", {
      scheduleId: bookingData.scheduleId,
      fromStationId: bookingData.fromStationId,
      toStationId: bookingData.toStationId,
      totalAmount: bookingData.totalAmount,
      passengers: bookingData.passengers,
    })
  ).data;
}

async function getBookingDetails(bookingId) {
  return (await client.get(`/bookings/${bookingId}`)).data;
}

async function getUserBookings() {
  return (await client.get("/bookings")).data;
}

async function cancelBooking(bookingId) {
  return (await client.patch(`/bookings/${bookingId}/cancel`)).data;
}

async function confirmBooking(bookingId) {
  return (await client.patch(`/bookings/${bookingId}/confirm`)).data;
}

export default {
  createBooking,
  getBookingDetails,
  getUserBookings,
  cancelBooking,
  confirmBooking,
};

