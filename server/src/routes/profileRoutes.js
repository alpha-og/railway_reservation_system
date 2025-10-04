import express from "express";
import authenticate from "../middleware/authenticate.js";
import { profileController } from "../controllers/index.js";

const router = express.Router();

// ------------------- Profile Routes -------------------

router.get("/", profileController.getProfile);

router.patch("/update", profileController.updateProfile);

// ------------------- Passenger Routes -------------------

router.get("/passengers", profileController.listPassengers);

router.post("/passengers", profileController.addPassenger);

router.patch("/passengers/:passengerId", profileController.updatePassenger);

router.delete("/passengers/:passengerId", profileController.deletePassenger);

export default router;

