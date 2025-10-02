import { useState, useCallback } from "react";

export const useTrainFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    fromStationId: "",
    toStationId: "",
    date: "",
    class: "",
    ...initialFilters
  });

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      from: "",
      to: "",
      fromStationId: "",
      toStationId: "",
      date: "",
      class: "",
      ...initialFilters
    });
  }, [initialFilters]);

  const isValidForSearch = useCallback(() => {
    return filters.from && filters.to && filters.date;
  }, [filters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    isValidForSearch,
  };
};