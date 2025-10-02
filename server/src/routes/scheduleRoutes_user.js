import { Router } from "express";
import { scheduleController } from "../controllers/index.js";

const router = Router();

router.get("/:scheduleStopId", scheduleController.getByScheduleStopId);
router.get(
  "/:scheduleId/availability",
  scheduleController.getAvailabilityByScheduleId,
);

export default router;
