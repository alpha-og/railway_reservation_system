import client from "../../../../services/config/axiosClient.js";

async function getAllStations(filters = {}) {
  return (await client.get("/admin/stations", { params: filters })).data;
}

async function getStationById(stationId) {
  return (await client.get(`/admin/stations/${stationId}`)).data;
}

async function createStation(stationData) {
  return (await client.post("/admin/stations", stationData)).data;
}

async function updateStation(stationId, stationData) {
  return (await client.patch(`/admin/stations/${stationId}`, stationData)).data;
}

async function deleteStation(stationId) {
  return (await client.delete(`/admin/stations/${stationId}`)).data;
}

// Always returns ALL distances; filter in frontend
async function getStationDistances() {
  return (await client.get("/admin/station-distances")).data;
}

async function createStationDistance(from_station_id, to_station_id, distance) {
  return (
    await client.post("/admin/station-distances", {
      from_station_id,
      to_station_id,
      distance,
    })
  ).data;
}

async function updateStationDistance(id, distance) {
  return (await client.patch(`/admin/station-distances/${id}`, { distance }))
    .data;
}

async function deleteStationDistance(id) {
  return (await client.delete(`/admin/station-distances/${id}`)).data;
}

export default {
  getAllStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation,
  getStationDistances,
  createStationDistance,
  updateStationDistance,
  deleteStationDistance,
};
