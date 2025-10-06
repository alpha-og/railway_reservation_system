// Adjust the import below according to your project structure if needed!
import client from "../../../../services/config/axiosClient.js";

// Fetch all trains
async function getTrains() {
  // Assume backend returns { data: { trains: [...] } }
  const res = await client.get("/admin/trains");
  // Adjust depending on your backend response format
  return res.data.data?.trains || res.data.trains || res.data;
}

// Fetch a single train by ID
async function getTrain(trainId) {
  const res = await client.get(`/admin/trains/${trainId}`);
  return res.data.data?.train || res.data.train || res.data;
}

// Fetch all coach types
async function getCoachTypes() {
  const res = await client.get("/admin/coach-types");
  return res.data.data?.coachTypes || res.data.coachTypes || res.data;
}

// Fetch all seat types
async function getSeatTypes() {
  const res = await client.get("/admin/seat-types");
  return res.data.data?.seatTypes || res.data.seatTypes || res.data;
}

// Create a new train
async function createTrain(trainData) {
  const res = await client.post("/admin/trains", trainData);
  return res.data;
}

// Update a train
async function updateTrain(trainId, trainData) {
  const res = await client.patch(`/admin/trains/${trainId}`, trainData);
  return res.data;
}

// Delete a train
async function deleteTrain(trainId) {
  const res = await client.delete(`/admin/trains/${trainId}`);
  return res.data;
}

export default {
  getTrains,
  getTrain,
  getCoachTypes,
  getSeatTypes,
  createTrain,
  updateTrain,
  deleteTrain,
};
