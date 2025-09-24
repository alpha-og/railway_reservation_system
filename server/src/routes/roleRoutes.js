import express from "express";
import { roleController } from "../controllers/index.js";

const router = express.Router();

// GET /api/v1/roles - Get all roles
router.get("/", roleController.getAllRoles);

// GET /api/v1/roles/:id - Get role by ID
router.get("/:id", roleController.getRoleById);

export default router;