import express from "express";
import { trainControllerUser } from "../controllers/index.js";


const router = express.Router();

router.get("/search", trainControllerUser.searchTrains);
router.get("/:trainId/schedule", trainControllerUser.getSchedule);
router.get("/:trainId/availability", trainControllerUser.getAvailability);

export default router;