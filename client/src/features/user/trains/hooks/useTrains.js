import { useEffect, useState } from "react";
import { useApi } from "../../../../services/useApi";
import trainService from "../services/trainService";

export const useTrains = (searchParams) => {
  const [searchFilters, setSearchFilters] = useState(searchParams || {});

  const {
    data: searchResult,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: () =>
      trainService.searchTrains(
        searchFilters.from,
        searchFilters.to,
        searchFilters.class,
        searchFilters.date,
      ),
    onSuccess: (responseBody) => {
      return responseBody.data;
    },
  });

  useEffect(() => {
    if (searchFilters.from && searchFilters.to && searchFilters.date) {
      resolve();
    }
  }, [searchFilters, resolve]);

  return {
    trains: searchResult?.trains || [],
    searchFilters: searchResult || {},
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    setSearchFilters,
  };
};

export const useAllTrains = () => {
  const {
    data: trains,
    error,
    isSuccess,
    isLoading,
    isError,
    isFallback,
    resolve,
  } = useApi({
    endpoint: trainService.getAllTrains,
    onSuccess: (responseBody) => {
      return responseBody.data.trains;
    },
  });

  useEffect(() => {
    resolve();
  }, [resolve]);

  return { trains, error, isSuccess, isLoading, isError, isFallback };
};

