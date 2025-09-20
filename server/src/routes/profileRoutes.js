import express from "express";
import authenticate from "../middleware/authenticate.js";
import { profileController } from "../controllers/index.js";;

const router = express.Router();

// ------------------- Profile Routes -------------------

router.get("/", authenticate("customer"), profileController.getProfile);

router.patch("/update", authenticate("customer"), profileController.updateProfile);

// ------------------- Passenger Routes -------------------

router.get("/passengers", authenticate("customer"), profileController.listPassengers);

router.post("/passengers", authenticate("customer"), profileController.addPassenger);

router.patch("/passengers/:passengerId", authenticate("customer"), profileController.updatePassenger);

router.delete("/passengers/:passengerId", authenticate("customer"), profileController.deletePassenger);

export default router;