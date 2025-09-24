import { Router } from "express";
import { stationController } from "../controllers/index.js";

const router = Router();

router.get("/", stationController.getAllStations);
router.get("/:stationId", stationController.getStationById);

export default router;
