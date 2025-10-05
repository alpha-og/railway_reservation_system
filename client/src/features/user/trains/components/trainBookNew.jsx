import { useParams, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useTrainAvailability } from "../hooks/useTrainAvailability";
import { useCoachTypes } from "../hooks/useCoachTypes";
import { useTrainOverview } from "../hooks/useTrainOverview";

export default function TrainBookNew() {
  const { trainId } = useParams({ from: "/(user)/trains/$trainId/book/new" });
  const search = useSearch({ from: "/(user)/trains/$trainId/book/new" });
  const { coachTypes, isLoading: coachTypesLoading } = useCoachTypes();
  const { train, isLoading: trainLoading, error: trainError } = useTrainOverview(trainId);
  const [selectedDate, setSelectedDate] = useState(
    search.date || new Date().toISOString().split("T")[0],
  );
  const { availability, isLoading: availabilityLoading } = useTrainAvailability(
    trainId,
    selectedDate,
  );
  const [selectedCoach, setSelectedCoach] = useState(null);
  const navigate = useNavigate();

  const isLoading = trainLoading || coachTypesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-2">Loading booking page...</span>
      </div>
    );
  }

  if (trainError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="alert alert-error">
          <span>Error loading train details: {trainError.message}</span>
        </div>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="alert alert-warning">
          <span>Train not found!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6">
      <div className="card w-full max-w-2xl bg-base-100 shadow-2xl">
        <div className="card-body">
          {/* Header */}
          <h2 className="card-title text-3xl font-bold mb-4">
            {train.train_name || train.name}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Train No: {train.train_number || train.code}
          </p>

          {/* Train Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <span className="font-semibold">Source:</span>{" "}
                {train.source_station || train.source}
              </p>
              <p>
                <span className="font-semibold">Departure:</span>{" "}
                {train.departure_time || train.departureTime}
              </p>
              <p>
                <span className="font-semibold">Duration:</span>{" "}
                {train.journey_duration || train.duration}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Destination:</span>{" "}
                {train.destination_station || train.destination}
              </p>
              <p>
                <span className="font-semibold">Arrival:</span>{" "}
                {train.arrival_time || train.arrivalTime}
              </p>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mt-6">
            <label className="font-semibold block mb-2">
              Select Journey Date:
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Coach Selection */}
          <div className="mt-6">
            <label className="font-semibold block mb-2">
              Select Coach Type:
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedCoach?.coach_type_id || ""}
              onChange={(e) => {
                const coach = coachTypes?.find(
                  (c) => c.coach_type_id === parseInt(e.target.value),
                );
                setSelectedCoach(coach);
              }}
              disabled={coachTypesLoading}
            >
              <option value="">-- Select Coach Type --</option>
              {coachTypes?.map((coachType) => (
                <option
                  key={coachType.coach_type_id}
                  value={coachType.coach_type_id}
                >
                  {coachType.coach_type_name} (
                  {coachType.coach_type_description})
                </option>
              ))}
            </select>
          </div>

          {/* Availability Display */}
          {selectedCoach && selectedDate && (
            <div className="mt-4">
              {availabilityLoading ? (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="ml-2">Checking availability...</span>
                </div>
              ) : availability ? (
                <div className="p-3 bg-green-100 rounded-lg">
                  <p className="text-lg">
                    <span className="font-semibold">Selected Coach:</span>{" "}
                    {selectedCoach.coach_type_name}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Available Seats:</span>{" "}
                    {availability.available_seats || "Loading..."}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Base Fare:</span> ₹
                    {availability.base_fare || "Loading..."}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <p>
                    No availability information for selected date and coach
                    type.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="card-actions justify-end mt-6">
            <Link to="/trains" className="btn btn-outline">
              Back
            </Link>
            <button
              disabled={!selectedCoach || !selectedDate || availabilityLoading}
              className="btn btn-primary ml-4"
              onClick={() => {
                navigate({
                  to: "/trains/$trainId/book/passengers",
                  params: { trainId: train.train_id || train.code },
                  search: {
                    coachType: selectedCoach.coach_type_name,
                    date: selectedDate,
                    fromStationId: search.fromStationId,
                    toStationId: search.toStationId,
                  },
                });
              }}
            >
              Add Passenger Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
