// client/src/features/admin/stations/services/stationService.js

import client from "../../../../services/config/axiosClient.js";

// ============================================
// Get all stations with optional filters
// ============================================
async function getAllStations(filters = {}) {
  return (
    await client.get("/admin/stations", {
      params: filters, // { search, city }
    })
  ).data;
}

// ============================================
// Get single station by ID
// ============================================
async function getStationById(stationId) {
  return (await client.get(`/admin/stations/${stationId}`)).data;
}

// ============================================
// Create new station
// ============================================
async function createStation(stationData) {
  return (await client.post("/admin/stations", stationData)).data;
}

// ============================================
// Update existing station
// ============================================
async function updateStation(stationId, stationData) {
  return (await client.patch(`/admin/stations/${stationId}`, stationData)).data;
}

// ============================================
// Delete station
// ============================================
async function deleteStation(stationId) {
  return (await client.delete(`/admin/stations/${stationId}`)).data;
}

export default {
  getAllStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation,
};