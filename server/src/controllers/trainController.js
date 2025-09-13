import Train from "../models/trainModel.js";
import { asyncErrorHandler } from "../utils/errors.js";
import { AppError } from "../utils/errors.js";
import * as z from "zod";

const createTrain = asyncErrorHandler(async (req, res, next) => {
  const schema = z.object({
    name: z.string().min(3).max(100),
    code: z.string().min(2).max(20),
  });

  const { name, code } = await schema.parseAsync(req.body);

  const train = await Train.create(name, code);

  res.success({ train }, { status: 201 });
});

const getAllTrains = asyncErrorHandler(async (req, res, next) => {
  const trains = await Train.findAll();
  res.success({ trains });
});

const getTrainById = asyncErrorHandler(async (req, res, next) => {
  const schema = z.object({
    trainId: z.string().uuid(),
  });
  const { trainId } = await schema.parseAsync(req.params);
  const train = await Train.findById(trainId);

  if (!train) {
    throw new AppError(404, "Train not found");
  }

  res.success({ train });
});

const updateTrain = asyncErrorHandler(async (req, res, next) => {
  const paramSchema = z.object({
    trainId: z.string().uuid(),
  });
  const bodySchema = z.object({
    name: z.string().min(3).max(100),
    code: z.string().min(2).max(20),
  });

  const { trainId } = await paramSchema.parseAsync(req.params);
  const { name, code } = await bodySchema.parseAsync(req.body);

  const train = await Train.update(trainId, name, code);
  if (!train) {
    throw new AppError(404, "Train not found");
  }
  res.success({ train });
});

const deleteTrain = asyncErrorHandler(async (req, res, next) => {
  const schema = z.object({
    trainId: z.string().uuid(),
  });
  const { trainId } = await schema.parseAsync(req.params);
  const train = await Train.delete(trainId);

  if (!train) {
    throw new AppError(404, "Train not found");
  }

  res.success({ message: "Train deleted successfully" });
});

export default {
  createTrain,
  getAllTrains,
  getTrainById,
  updateTrain,
  deleteTrain,
};

