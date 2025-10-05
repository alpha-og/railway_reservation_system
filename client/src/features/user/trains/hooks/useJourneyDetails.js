import { useEffect, useMemo } from "react";
import { useApi } from "../../../../services/useApi";
import stationService from "../services/station.service";
import scheduleService from "../services/schedule.service";

export const useJourneyDetails = (scheduleId, fromStationId, toStationId) => {
  // Fetch schedule data
  const {
    data: scheduleData,
    error: scheduleError,
    isSuccess: scheduleSuccess,
    isLoading: scheduleLoading,
    isError: scheduleIsError,
    resolve: resolveSchedule,
  } = useApi({
    endpoint: scheduleService.getScheduleSummaryByScheduleId,
    onSuccess: (responseBody) => {
      return responseBody.data;
    },
  });

  // Fetch from station data
  const {
    data: fromStationData,
    error: fromStationError,
    isSuccess: fromStationSuccess,
    isLoading: fromStationLoading,
    isError: fromStationIsError,
    resolve: resolveFromStation,
  } = useApi({
    endpoint: stationService.getStation,
    onSuccess: (responseBody) => {
      return responseBody.data.station;
    },
  });

  // Fetch to station data
  const {
    data: toStationData,
    error: toStationError,
    isSuccess: toStationSuccess,
    isLoading: toStationLoading,
    isError: toStationIsError,
    resolve: resolveToStation,
  } = useApi({
    endpoint: stationService.getStation,
    onSuccess: (responseBody) => {
      return responseBody.data.station;
    },
  });

  // Trigger API calls when parameters change
  useEffect(() => {
    if (scheduleId) {
      resolveSchedule(scheduleId);
    }
  }, [scheduleId, resolveSchedule]);

  useEffect(() => {
    if (fromStationId) {
      resolveFromStation(fromStationId);
    }
  }, [fromStationId, resolveFromStation]);

  useEffect(() => {
    if (toStationId) {
      resolveToStation(toStationId);
    }
  }, [toStationId, resolveToStation]);

  // Process the journey details
  const journeyDetails = useMemo(() => {
    if (!scheduleData || !fromStationData || !toStationData) {
      return null;
    }

    const schedule = scheduleData.schedule;
    const train = scheduleData.train;

    if (!schedule || !train) {
      return null;
    }

    // Find departure and arrival times for the journey
    const scheduleStops = schedule.schedule_stops || [];
    const fromStop = scheduleStops.find(stop => stop.station?.id === fromStationId);
    const toStop = scheduleStops.find(stop => stop.station?.id === toStationId);

    return {
      train: {
        name: train.name,
        number: train.code,
      },
      schedule: {
        id: schedule.id,
        departureDate: schedule.departure_date,
        departureTime: schedule.departure_time,
      },
      fromStation: {
        id: fromStationData.id,
        name: fromStationData.name,
        code: fromStationData.code,
        departureTime: fromStop?.departure_time || fromStop?.arrival_time,
      },
      toStation: {
        id: toStationData.id,
        name: toStationData.name,
        code: toStationData.code,
        arrivalTime: toStop?.arrival_time || toStop?.departure_time,
      },
      duration: calculateJourneyDuration(fromStop, toStop),
    };
  }, [scheduleData, fromStationData, toStationData, fromStationId, toStationId]);

  // Aggregate loading and error states
  const isLoading = scheduleLoading || fromStationLoading || toStationLoading;
  const isError = scheduleIsError || fromStationIsError || toStationIsError;
  const error = scheduleError || fromStationError || toStationError;
  const isSuccess = scheduleSuccess && fromStationSuccess && toStationSuccess;

  return {
    journeyDetails,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch: () => {
      if (scheduleId) resolveSchedule(scheduleId);
      if (fromStationId) resolveFromStation(fromStationId);
      if (toStationId) resolveToStation(toStationId);
    },
  };
};

// Helper function to calculate journey duration
const calculateJourneyDuration = (fromStop, toStop) => {
  if (!fromStop || !toStop) return null;

  const fromTime = fromStop.departure_time || fromStop.arrival_time;
  const toTime = toStop.arrival_time || toStop.departure_time;

  if (!fromTime || !toTime) return null;

  // Convert time strings to minutes for calculation
  const fromMinutes = timeToMinutes(fromTime);
  const toMinutes = timeToMinutes(toTime);
  
  let durationMinutes = toMinutes - fromMinutes;
  
  // Handle overnight journeys
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Add 24 hours
  }

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  return `${hours}h ${minutes}m`;
};

// Helper function to convert time string to minutes
const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export default useJourneyDetails;