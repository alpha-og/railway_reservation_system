import { z } from "zod";
import * as trainModel from "../models/trainModel_user.js";

const searchSchema = z.object({
  from: z.string().min(1, "from is required"),
  to: z.string().min(1, "to is required"),
  class: z.string().optional(),
  date: z.string().min(1, "date is required"),
});

const scheduleSchema = z.object({
  trainId: z.string().min(1, "trainId is required"),
});

const availabilitySchema = z.object({
  trainId: z.string().min(1, "trainId is required"),
  date: z.string().min(1, "date is required"),
});



// GET /trains/search
export async function searchTrains(req, res, next) {
  try {
    const { from, to, class: coachClass, date } = searchSchema.parse(req.query);
    const trains = await trainModel.searchTrains(from, to, coachClass, date);

    return res.success(
      { from, to, coachClass, date, trains },
      { count: trains.length }
    );
  } catch (err) {
    next(err);
  }
}

// GET /trains/:trainId/schedule
export async function getSchedule(req, res, next) {
  try {
    const { trainId } = scheduleSchema.parse(req.params);
    const schedule = await trainModel.getSchedule(trainId);

    return res.success({ trainId, schedule });
  } catch (err) {
    next(err);
  }
}

// GET /trains/:trainId/availability
export async function getAvailability(req, res, next) {
  try {
    const { trainId, date } = availabilitySchema.parse({
      trainId: req.params.trainId,
      date: req.query.date,
    });

    const availability = await trainModel.getAvailability(trainId, date);
    return res.success({ trainId, date, availability });
  } catch (err) {
    next(err);
  }
}
