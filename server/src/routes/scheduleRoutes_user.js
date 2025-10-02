import { Router } from "express";
import { scheduleController } from "../controllers/index.js";

const router = Router();

router.get("/:scheduleId", scheduleController.getScheduleSummaryByScheduleId);
router.get(
  "/:scheduleId/availability",
  scheduleController.getAvailabilityByScheduleId,
);

export default router;
