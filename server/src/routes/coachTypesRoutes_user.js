import { Router } from "express";
import { coachTypeController } from "../controllers/index.js";

const router = Router();

router.get("/", coachTypeController.get);
router.get("/:id", coachTypeController.getById);

export default router;
