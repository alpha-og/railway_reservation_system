import express from "express";
import { bookingController } from "../controllers/index.js";

const router = express.Router();

// Admin endpoints for booking management
router.get("/pnr/:pnr", bookingController.getBookingByPnr);
router.post("/auto-cancel-expired", bookingController.autoCancelExpiredBookings);
router.get("/scheduler/status", bookingController.getSchedulerStatus);

export default router;