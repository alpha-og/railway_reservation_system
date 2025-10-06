
// client/src/features/admin/stations/hooks/useStations.js

import { useState, useEffect, useCallback } from "react";
import stationService from "../services/stationService.js";

export function useStations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    city: "",
  });

  // Fetch stations with filters
  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filterParams = {};
      if (filters.search) filterParams.search = filters.search;
      if (filters.city) filterParams.city = filters.city;

      const response = await stationService.getAllStations(filterParams);

      if (response.success) {
        setStations(response.data.stations || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch stations");
      console.error("Error fetching stations:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  const handleCityFilter = (city) => {
    setFilters((prev) => ({ ...prev, city }));
  };

  const resetFilters = () => {
    setFilters({ search: "", city: "" });
  };

  const handleDelete = async (stationId) => {
    try {
      const response = await stationService.deleteStation(stationId);

      if (response.success) {
        setStations((prev) => prev.filter((station) => station.id !== stationId));
        return { success: true, message: response.message || "Station deleted successfully" };
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to delete station";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const refresh = () => {
    fetchStations();
  };

  return {
    stations,
    loading,
    error,
    filters,
    handleSearch,
    handleCityFilter,
    resetFilters,
    handleDelete,
    refresh,
  };
}

export default useStations;