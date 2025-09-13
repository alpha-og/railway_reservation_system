import express from "express";
import {
  searchTrains,
  getSchedule,
  getAvailability,
} from "../controllers/trainController_user.js";

const router = express.Router();

router.get("/search", searchTrains);
router.get("/:trainId/schedule", getSchedule);
router.get("/:trainId/availability", getAvailability);

export default router;
