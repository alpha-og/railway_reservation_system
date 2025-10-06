import * as z from "zod";
import { Booking } from "../models/index.js";
import { AppError, asyncErrorHandler } from "../utils/errors.js";
import { queryDB } from "../utils/db.js";
import { bookingScheduler } from "../services/bookingScheduler.js";

const getAllBookings = asyncErrorHandler(async (req, res) => {
  const bookings = await Booking.findAllByUser(req.userId);

  // Format bookings for frontend consumption
  const formattedBookings = await Promise.all(
    bookings.map(async (booking) => {
      // Get passengers and seats for this booking
      const passengers = await Booking.getBookedPassengers(booking.id);
      const seats = await Booking.getBookedSeats(booking.id);

      // Create a map of passenger ID to seat info
      const seatMap = {};
      seats.forEach((seat) => {
        if (seat.booked_passenger_id) {
          seatMap[seat.booked_passenger_id] = {
            seatNumber: seat.seat_number,
            coachCode: seat.coach_code,
          };
        }
      });

      return {
        bookingId: booking.id,
        pnr: booking.pnr,
        train: {
          name: booking.train_name || "Unknown Train",
          code: booking.train_code || "N/A",
        },
        source: booking.source_station || "Unknown",
        destination: booking.destination_station || "Unknown",
        departureDate:
          booking.departure_date || booking.booking_date?.split("T")[0],
        departureTime: booking.from_departure_time || booking.departure_time,
        arrivalTime: booking.to_arrival_time,
        status: booking.booking_status || "PENDING",
        totalAmount: parseFloat(booking.total_amount) || 0,
        bookingDate: booking.booking_date,
        passengers: passengers.map((p) => {
          const seatInfo = seatMap[p.id];
          return {
            name: p.name,
            age: p.age,
            gender: p.gender,
            seat: seatInfo
              ? `${seatInfo.coachCode}-${seatInfo.seatNumber}`
              : "Not assigned",
          };
        }),
      };
    }),
  );

  return res.success(
    { bookings: formattedBookings },
    { count: formattedBookings.length },
  );
});

const getBookingByPnr = asyncErrorHandler(async (req, res) => {
  const schema = z.object({ pnr: z.string().min(1).max(10).regex(/^[A-Z0-9]+$/, "Invalid PNR format") });
  const { pnr } = schema.parse(req.params);

  // For regular users, restrict to their own bookings. For admins, allow any booking.
  const userId = req.role === "admin" ? null : req.userId;
  
  const booking = await Booking.findByPnr(pnr, userId);
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  // Get passengers and seats for this booking
  const passengers = await Booking.getBookedPassengers(booking.id);
  const seats = await Booking.getBookedSeats(booking.id);

  // Create a map of passenger ID to seat info
  const seatMap = {};
  seats.forEach((seat) => {
    if (seat.booked_passenger_id) {
      seatMap[seat.booked_passenger_id] = {
        seatNumber: seat.seat_number,
        coachCode: seat.coach_code,
        seatType: seat.seat_type,
      };
    }
  });

  // Format booking for frontend consumption
  const formattedBooking = {
    bookingId: booking.id,
    pnr: booking.pnr,
    train: {
      name: booking.train_name || "Unknown Train",
      code: booking.train_code || "N/A",
    },
    source: booking.source_station || "Unknown",
    sourceCode: booking.source_station_code || "N/A",
    destination: booking.destination_station || "Unknown",
    destinationCode: booking.destination_station_code || "N/A",
    departureDate:
      booking.departure_date || booking.booking_date?.split("T")[0],
    departureTime: booking.from_departure_time || booking.departure_time,
    arrivalTime: booking.to_arrival_time,
    status: booking.booking_status || "PENDING",
    totalAmount: parseFloat(booking.total_amount) || 0,
    bookingDate: booking.booking_date,
    distance: booking.journey_distance
      ? parseFloat(booking.journey_distance)
      : null,
    passengers: passengers.map((p) => {
      const seatInfo = seatMap[p.id];
      return {
        name: p.name,
        age: p.age,
        gender: p.gender,
        seat: seatInfo
          ? `${seatInfo.coachCode}-${seatInfo.seatNumber}`
          : "Not assigned",
        coachType: p.coach_type_name || "Unknown",
        seatType: seatInfo?.seatType || "Unknown",
      };
    }),
  };

  return res.success({ booking: formattedBooking });
});

const getBookingById = asyncErrorHandler(async (req, res) => {
  const schema = z.object({ bookingId: z.uuid() });
  const { bookingId } = schema.parse(req.params);

  const booking = await Booking.findByIdWithDetails(bookingId);
  if (!booking) throw new AppError(404, "Booking not found");

  if (booking.user_id !== req.userId) {
    throw new AppError(403, "Not authorized to access this booking");
  }

  // Get passengers and seats for this booking
  const passengers = await Booking.getBookedPassengers(booking.id);
  const seats = await Booking.getBookedSeats(booking.id);

  // Create a map of passenger ID to seat info
  const seatMap = {};
  seats.forEach((seat) => {
    if (seat.booked_passenger_id) {
      seatMap[seat.booked_passenger_id] = {
        seatNumber: seat.seat_number,
        coachCode: seat.coach_code,
        seatType: seat.seat_type,
      };
    }
  });

  // Format booking for frontend consumption
  const formattedBooking = {
    bookingId: booking.id,
    pnr: booking.pnr,
    train: {
      name: booking.train_name || "Unknown Train",
      code: booking.train_code || "N/A",
    },
    source: booking.source_station || "Unknown",
    sourceCode: booking.source_station_code || "N/A",
    destination: booking.destination_station || "Unknown",
    destinationCode: booking.destination_station_code || "N/A",
    departureDate:
      booking.departure_date || booking.booking_date?.split("T")[0],
    departureTime: booking.from_departure_time || booking.departure_time,
    arrivalTime: booking.to_arrival_time,
    status: booking.booking_status || "PENDING",
    totalAmount: parseFloat(booking.total_amount) || 0,
    bookingDate: booking.booking_date,
    distance: booking.journey_distance
      ? parseFloat(booking.journey_distance)
      : null,
    passengers: passengers.map((p) => {
      const seatInfo = seatMap[p.id];
      return {
        name: p.name,
        age: p.age,
        gender: p.gender,
        seat: seatInfo
          ? `${seatInfo.coachCode}-${seatInfo.seatNumber}`
          : "Not assigned",
        coachType: p.coach_type_name || "Unknown",
        seatType: seatInfo?.seatType || "Unknown",
      };
    }),
  };

  return res.success({ booking: formattedBooking });
});

const createBooking = asyncErrorHandler(async (req, res) => {
  const schema = z.object({
    scheduleId: z.uuid(),
    fromStationId: z.uuid(),
    toStationId: z.uuid(),
    statusId: z.uuid().optional(),
    totalAmount: z.number().positive(),
    passengers: z
      .array(
        z.object({
          name: z.string().min(1).max(100),
          age: z.number().min(1).max(120),
          gender: z.enum(["Male", "Female", "Other"]),
          coachType: z.string().uuid(),
          email: z.string().email().optional(),
        }),
      )
      .min(1)
      .max(6) // Limit to 6 passengers per booking
      .optional(),
  });

  const {
    scheduleId,
    fromStationId,
    toStationId,
    statusId,
    totalAmount,
    passengers,
  } = schema.parse(req.body);

  // Validate that from and to stations are different
  if (fromStationId === toStationId) {
    throw new AppError(400, "From and to stations cannot be the same");
  }

  // Get default status if not provided
  const defaultStatusId = statusId || (await Booking.getStatusId("Pending"));

  let booking;

  try {
    if (passengers && passengers.length > 0) {
      // Create booking with passengers (includes comprehensive dependency validation)
      booking = await Booking.createWithPassengers(
        req.userId,
        scheduleId,
        fromStationId,
        toStationId,
        defaultStatusId,
        totalAmount,
        passengers,
      );
    } else {
      // Fallback to original booking creation (for backward compatibility)
      // Still need to validate basic dependencies for simple booking
      await Booking.validateBasicDependencies(
        req.userId,
        scheduleId,
        fromStationId,
        toStationId,
        defaultStatusId,
      );

      booking = await Booking.create(
        req.userId,
        scheduleId,
        fromStationId,
        toStationId,
        defaultStatusId,
        totalAmount,
      );
    }
  } catch (error) {
    // Handle dependency validation errors with specific messages
    if (
      error.message.includes("does not exist") ||
      error.message.includes("not available") ||
      error.message.includes("Train does not have")
    ) {
      throw new AppError(400, error.message);
    }
    // Re-throw other errors as-is
    throw error;
  }

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
  return res.success({ 
    booking: updated,
    message: "Booking cancelled successfully. Seats have been freed and refund will be processed if applicable."
  });
});

// Admin endpoint to manually trigger auto-cancellation
const autoCancelExpiredBookings = asyncErrorHandler(async (req, res) => {
  const cancelledCount = await bookingScheduler.triggerNow();
  
  return res.success({
    cancelledCount,
    message: `Auto-cancelled ${cancelledCount} expired booking(s)`
  });
});

// Admin endpoint to get scheduler status
const getSchedulerStatus = asyncErrorHandler(async (req, res) => {
  const status = bookingScheduler.getStatus();
  
  return res.success({
    scheduler: status
  });
});

export default {
  getAllBookings,
  getBookingById,
  getBookingByPnr,
  createBooking,
  confirmBooking,
  cancelBooking,
  autoCancelExpiredBookings,
  getSchedulerStatus,
};
