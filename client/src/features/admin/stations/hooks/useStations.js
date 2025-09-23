// src/features/admin/stations/hooks/useStations.js
import { useApiWithFallback } from "../../../../services/useApiWithFallback";
import {
  getStations as fetchStations,
  getStation as fetchStation,
} from "../services/stationService";

// --- Demo / fallback stations ---
const demoStations = [
  { id: 1, name: "Mumbai Central", code: "BCT" },
  { id: 2, name: "New Delhi", code: "NDLS" },
  { id: 3, name: "Bangalore City", code: "SBC" },
];

// --- Hook: Get all stations ---
export const useStations = () => {
  return useApiWithFallback({
    fallbackKey: "stations",
    endpoint: fetchStations,
    fallbackData: demoStations,
  });
};

// --- Hook: Get single station by ID ---
export const useStationById = (stationId) => {
  const fallbackStation =
    stationId && demoStations.find((s) => s.id === parseInt(stationId));

  return useApiWithFallback({
    fallbackKey: `station_${stationId || "fallback"}`,
    endpoint: async () => {
      if (!stationId) return fallbackStation || null;
      return fetchStation(stationId);
    },
    fallbackData: fallbackStation || null,
  });
};
