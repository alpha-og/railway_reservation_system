import { z } from "zod";
import { Profile, Passenger } from "../models/index.js";
import { asyncErrorHandler, AppError } from "../utils/errors.js";

const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

const createPassengerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().min(0, "Age must be valid"),
  gender: z.string().min(1, "Gender is required"),
});

const updatePassengerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  age: z.number().min(0).optional(),
});

const passengerIdSchema = z.object({
  passengerId: z.string().uuid("Invalid passengerId"),
});

const getProfile = asyncErrorHandler(async (req, res) => {
  const profile = await Profile.getProfile(req.userId);
  return res.success({ profile });
});

const updateProfile = asyncErrorHandler(async (req, res) => {
  const data = updateProfileSchema.parse(req.body);
  const updatedProfile = await Profile.updateProfile(req.userId, data);
  return res.success(
    { profile: updatedProfile },
    { message: "Profile updated successfully" }
  );
});

const listPassengers = asyncErrorHandler(async (req, res) => {
  const passengers = await Passenger.listPassengers(req.userId);
  return res.success({ passengers }, { count: passengers.length });
});

const addPassenger = asyncErrorHandler(async (req, res) => {
  const data = createPassengerSchema.parse(req.body);
  const passenger = await Passenger.addPassenger(req.userId, data);
  return res.success(
    { passenger },
    { message: "Passenger added successfully" }
  );
});

const updatePassenger = asyncErrorHandler(async (req, res) => {
  const { passengerId } = passengerIdSchema.parse(req.params);
  const data = updatePassengerSchema.parse(req.body);
  const updatedPassenger = await Passenger.updatePassenger(
    req.userId,
    passengerId,
    data
  );
  
  return res.success(
    { passenger: updatedPassenger },
    { message: "Passenger updated successfully" }
  );
});

const deletePassenger = asyncErrorHandler(async (req, res) => {
  const { passengerId } = passengerIdSchema.parse(req.params);
  const deletedPassenger = await Passenger.deletePassenger(
    req.userId,
    passengerId
  );

  if (!deletedPassenger) {
    throw new AppError(404, "Passenger not found");
  }

  return res.success(
    { passenger: deletedPassenger },
    { message: "Passenger deleted successfully" }
  );
});

export default {
  getProfile,
  updateProfile,
  listPassengers,
  addPassenger,
  updatePassenger,
  deletePassenger,
};
