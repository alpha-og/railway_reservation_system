import { useSearch, Link } from "@tanstack/react-router";
import { useTrains } from "../hooks/useTrains";
import { useEffect } from "react";

export default function TrainSearchBySource() {
  const search = useSearch({ from: "/(user)/trains/search" });
  const { trains, isLoading, error } = useTrains({
    from: search.from,
    to: search.to,
    date: search.date,
    class: search.class,
  });

  useEffect(() => {
    console.log(trains);
  }, [trains]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Trains from {search.from} to {search.to}
        </h2>
        <Link to="/trains" className="btn btn-outline btn-sm">
          ← Back
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-2">Loading trains...</span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>Error loading trains: {error.message}</span>
        </div>
      ) : trains.length === 0 ? (
        <div className="alert alert-info">
          <span>No trains found for this route.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Train No</th>
                <th>Name</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Duration</th>
                <th>Classes</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((train) => (
                <tr key={train.id}>
                  <td>{train.train_number || train.code}</td>
                  <td>{train.train_name || train.name}</td>
                  <td>{train.source_station || train.source}</td>
                  <td>{train.destination_station || train.destination}</td>
                  <td>{train.departure_time || train.departureTime}</td>
                  <td>{train.arrival_time || train.arrivalTime}</td>
                  <td>{train.journey_duration || train.duration}</td>
                  <td>
                    {train.available_classes?.join(", ") ||
                      train.classes?.join(", ") ||
                      "N/A"}
                  </td>
                  <td className="flex gap-2 justify-center">
                    <Link
                      to={`/trains/${train.train_id || train.code}/details`}
                      className="btn btn-sm btn-outline"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/trains/${train.train_id || train.code}/book/new`}
                      search={{
                        from: search.from,
                        to: search.to,
                        fromStationId: search.fromStationId,
                        toStationId: search.toStationId,
                        date: search.date
                      }}
                      className="btn btn-sm btn-primary"
                    >
                      Book Now
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
