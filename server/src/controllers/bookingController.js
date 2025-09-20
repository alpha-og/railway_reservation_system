import * as z from "zod";
import { Booking } from "../models/index.js"; 
import { AppError, asyncErrorHandler } from "../utils/errors.js";

const getAllBookings = asyncErrorHandler(async (req, res) => {
  const bookings = await Booking.findAllByUser(req.userId);
  return res.success({ bookings }, { count: bookings.length });
});

const getBookingById = asyncErrorHandler(async (req, res) => {
  const schema = z.object({ bookingId: z.string().uuid() });
  const { bookingId } = schema.parse(req.params);

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError(404, "Booking not found");

  if (booking.user_id !== req.userId) {
    throw new AppError(403, "Not authorized to access this booking");
  }

  return res.success({ booking });
});

const createBooking = asyncErrorHandler(async (req, res) => {
  const schema = z.object({
    scheduleId: z.string().uuid(),
    fromStationId: z.string().uuid(),
    toStationId: z.string().uuid(),
    statusId: z.string().uuid(),
    totalAmount: z.number(),
  });

  const { scheduleId, fromStationId, toStationId, statusId, totalAmount } =
    schema.parse(req.body);

  const booking = await Booking.create(
    req.userId,
    scheduleId,
    fromStationId,
    toStationId,
    statusId,
    totalAmount
  );

  return res.success({ booking }, { status: 201 });
});

const confirmBooking = asyncErrorHandler(async (req, res) => {
  const schema = z.object({ bookingId: z.string().uuid() });
  const { bookingId } = schema.parse(req.params);

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError(404, "Booking not found");

  if (booking.user_id !== req.userId) {
    throw new AppError(403, "Not authorized to confirm this booking");
  }

  const updated = await Booking.confirmBooking(bookingId);
  return res.success({ booking: updated });
});

const cancelBooking = asyncErrorHandler(async (req, res) => {
  const schema = z.object({ bookingId: z.string().uuid() });
  const { bookingId } = schema.parse(req.params);

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError(404, "Booking not found");

  if (booking.user_id !== req.userId) {
    throw new AppError(403, "Not authorized to cancel this booking");
  }

  const updated = await Booking.cancelBooking(bookingId);
  return res.success({ booking: updated });
});


export default {
  getAllBookings,
  getBookingById,
  createBooking,
  confirmBooking,
  cancelBooking,
};
