import express from "express";
import { bookingController } from "../controllers/index.js";

const router = express.Router();

router.get("/", bookingController.getAllBookings);
router.get("/pnr/:pnr", bookingController.getBookingByPnr);
router.get("/:bookingId", bookingController.getBookingById);
router.post("/", bookingController.createBooking);
router.patch("/:bookingId/confirm", bookingController.confirmBooking);
router.patch("/:bookingId/cancel", bookingController.cancelBooking);

export default router;