import client from "../../../../services/config/axiosClient.js";

async function createTrain(trainData) {
  return (await client.post("/admin/trains", trainData)).data;
}

async function getAllTrains() {
  return (await client.get("/admin/trains")).data;
}

async function getTrainById(trainId) {
  return (await client.get(`/admin/trains/${trainId}`)).data;
}

async function updateTrain(trainId, trainData) {
  return (await client.patch(`/admin/trains/${trainId}`, trainData)).data;
}

async function deleteTrain(trainId) {
  return (await client.delete(`/admin/trains/${trainId}`)).data;
}

export default {
  createTrain,
  getAllTrains,
  getTrainById,
  updateTrain,
  deleteTrain,
};
