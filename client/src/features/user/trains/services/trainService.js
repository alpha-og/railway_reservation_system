import client from "../../../../services/config/axiosClient.js";

async function searchTrains(from, to, coachClass, date) {
  const params = { from, to, date };
  if (coachClass) params.class = coachClass;

  return (await client.get("/trains/search", { params })).data;
}

async function getTrainOverview(trainId) {
  return (await client.get(`/trains/${trainId}`)).data;
}

export default {
  searchTrains,
  getTrainOverview,
};
