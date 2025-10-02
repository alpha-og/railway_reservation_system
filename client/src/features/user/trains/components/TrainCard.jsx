import { useSearch, Link } from "@tanstack/react-router";

export const TrainCard = ({ train }) => {
  return (
    <div className="card h-56 w-full bg-base-200 flex flex-col">
      <div className="card-body flex flex-col justify-between h-full p-4">
        <div className="w-full flex justify-between items-start gap-4">
          <h2 className="card-title text-base flex-1 line-clamp-2">{train.name}</h2>
          <span className="px-3 py-1 text-sm rounded-full bg-accent text-accent-content whitespace-nowrap">
            {train.code}
          </span>
        </div>
        <div className="w-full flex flex-col gap-2 flex-1">
          <hr className="w-full border-t border-base-content/20" />
          <div className="space-y-1">
            <p className="w-full flex justify-between items-center text-sm">
              <span className="font-medium">Departure:</span>
              <span className="font-mono">{train.departure_time}</span>
            </p>
            <p className="w-full flex justify-between items-center text-sm">
              <span className="font-medium">Arrival:</span>
              <span className="font-mono">{train.arrival_time}</span>
            </p>
          </div>
        </div>
        <div className="card-actions w-full pt-2">
          <Link
            to={`/trains/${train.id}/book`}
            search={{
              scheduleStopId: train.schedule_stop_id,
            }}
            className="btn btn-sm btn-primary w-full"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};