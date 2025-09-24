import client from "../../../../services/config/axiosClient.js";

async function getStations() {
  return (await client.get("/stations")).data;
}

async function getStation(id) {
  return (await client.get(`/stations/${id}`)).data;
}

export default {
  getStations,
  getStation,
};
