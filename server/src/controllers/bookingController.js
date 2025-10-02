import * as z from "zod";
import { Booking } from "../models/index.js"; 
import { AppError, asyncErrorHandler } from "../utils/errors.js";

const getAllBookings = asyncErrorHandler(async (req, res) => {
  const bookings = await Booking.findAllByUser(req.userId);
  
  // Format bookings for frontend consumption
  const formattedBookings = await Promise.all(
    bookings.map(async (booking) => {
      // Get passengers for this booking
      const passengers = await Booking.getBookedPassengers(booking.id);
      
      return {
        bookingId: booking.id,
        pnr: booking.pnr,
        train: {
          name: booking.train_name || "Unknown Train",
          code: booking.train_code || "N/A"
        },
        source: booking.source_station || "Unknown",
        destination: booking.destination_station || "Unknown",
        departureDate: booking.departure_date || booking.booking_date?.split('T')[0],
        departureTime: booking.from_departure_time || booking.departure_time,
        arrivalTime: booking.to_arrival_time,
        status: booking.booking_status || "PENDING",
        totalAmount: parseFloat(booking.total_amount) || 0,
        bookingDate: booking.booking_date,
        passengers: passengers.map(p => ({
          name: p.name,
          age: p.age,
          gender: p.gender,
          seat: p.seat_number || "Not assigned"
        }))
      };
    })
  );
  
  return res.success({ bookings: formattedBookings }, { count: formattedBookings.length });
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
