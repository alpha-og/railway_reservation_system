import { z } from "zod";
import { Train } from "../models/index.js";
import { asyncErrorHandler } from "../utils/errors.js";

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

const searchTrains = asyncErrorHandler(async (req, res) => {
  const { from, to, class: coachClass, date } = searchSchema.parse(req.query);
  const trains = await Train.searchTrains(from, to, coachClass, date);

  return res.success(
    { from, to, coachClass, date, trains },
    { count: trains.length }
  );
});

const getSchedule = asyncErrorHandler(async (req, res) => {
  const { trainId } = scheduleSchema.parse(req.params);
  const schedule = await Train.getSchedule(trainId);

  return res.success({ trainId, schedule });
});

const getAvailability = asyncErrorHandler(async (req, res) => {
  const { trainId, date } = availabilitySchema.parse({
    trainId: req.params.trainId,
    date: req.query.date,
  });

  const availability = await Train.getAvailability(trainId, date);
  return res.success({ trainId, date, availability });
});


export default { searchTrains, getSchedule, getAvailability };
