import { useState, useEffect } from "react";
import { useApi } from "../../../../services/useApi";
import trainService from "../services/train.service";

// Create
export const useCreateTrain = () => {
  const [trainData, setTrainData] = useState(null);
  const { data, error, isLoading, isSuccess, resolve } = useApi({
    endpoint: () => trainService.createTrain(trainData),
  });

  const createTrain = (data) => {
    setTrainData(data);
    return resolve();
  };

  const reset = () => setTrainData(null);

  return { train: data, error, isLoading, isSuccess, createTrain, reset };
};

// Get all
export const useTrains = () => {
  const { data, error, isLoading, isSuccess, resolve } = useApi({
    endpoint: trainService.getAllTrains,
  });

  useEffect(() => {
    resolve();
  }, [resolve]);

  return { trains: data, error, isLoading, isSuccess, refetch: resolve };
};

// Get by id
export const useTrain = (trainId) => {
  const { data, error, isLoading, isSuccess, resolve } = useApi({
    endpoint: () => trainService.getTrainById(trainId),
  });

  useEffect(() => {
    if (trainId) resolve();
  }, [trainId, resolve]);

  return { train: data, error, isLoading, isSuccess, refetch: resolve };
};

// Update
export const useUpdateTrain = (trainId) => {
  const [trainData, setTrainData] = useState(null);
  const { data, error, isLoading, isSuccess, resolve } = useApi({
    endpoint: () => trainService.updateTrain(trainId, trainData),
  });

  const updateTrain = (data) => {
    setTrainData(data);
    return resolve();
  };

  return { train: data, error, isLoading, isSuccess, updateTrain };
};

// Delete
export const useDeleteTrain = () => {
  const [trainId, setTrainId] = useState(null);
  const { data, error, isLoading, isSuccess, resolve } = useApi({
    endpoint: () => trainService.deleteTrain(trainId),
  });

  const deleteTrain = (id) => {
    setTrainId(id);
    return resolve();
  };

  return { result: data, error, isLoading, isSuccess, deleteTrain };
};
