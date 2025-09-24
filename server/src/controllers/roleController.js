import { Role } from "../models/index.js";
import { asyncErrorHandler, AppError } from "../utils/errors.js";
import * as z from "zod";

const getRoleById = asyncErrorHandler(async (req, res, next) => {
  // Validate UUID parameter
  const paramSchema = z.object({
    id: z.uuid("Invalid role ID format"),
  });

  const { id } = await paramSchema.parseAsync(req.params);

  // Use the existing find method with ID filter
  const roles = await Role.find({ id });

  if (roles.length === 0) {
    throw new AppError(404, "Role not found");
  }

  const role = roles[0];

  res.success({
    id: role.id,
    name: role.name,
    created_at: role.created_at,
    updated_at: role.updated_at,
  });
});

const getAllRoles = asyncErrorHandler(async (req, res, next) => {
  // Optional query parameters validation
  const querySchema = z
    .object({
      sortBy: z.enum(["name"]).optional(),
      sortOrder: z.enum(["ASC", "DESC"]).optional(),
      limit: z.coerce.number().int().positive().max(100).optional(),
      page: z.coerce.number().int().positive().optional(),
    })
    .optional();

  const query = await querySchema.parseAsync(req.query);

  // Prepare filter and sort options
  const filter = {};
  const sort = {};

  if (query?.limit) {
    filter.limit = query.limit;
  }
  if (query?.page) {
    filter.page = query.page;
  }
  if (query?.sortBy) {
    sort.sortBy = query.sortBy;
    sort.sortOrder = query.sortOrder || "ASC";
  }

  // Use the existing find method
  const roles = await Role.find(filter, sort);

  res.success(
    roles.map((role) => ({
      id: role.id,
      name: role.name,
      created_at: role.created_at,
      updated_at: role.updated_at,
    })),
  );
});

export default {
  getRoleById,
  getAllRoles,
};

