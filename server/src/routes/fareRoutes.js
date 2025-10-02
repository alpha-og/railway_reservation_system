import { Router } from "express";
import FareController from "../controllers/fareController.js";

const fareRouter = Router();

// Calculate fare for a single journey
fareRouter.post("/calculate", FareController.calculateFare);

// Calculate fares for multiple coach types
fareRouter.post("/calculate-multiple", FareController.calculateMultipleFares);

// Get fare rates for a specific train
fareRouter.get("/rates/:train_id", FareController.getFareRatesByTrain);

export default fareRouter;