import { Link } from "@tanstack/react-router";
import { formatTime, formatDateTime } from "../../../../lib/dataUtils";

export const TrainCard = ({ train }) => {
  // Calculate departure and arrival dates
  const departureDate = train.departure_date;
  const departureTime = train.departure_time;
  const arrivalTime = train.arrival_time;
  
  // For TrainCard, we have limited schedule info, so we need a simplified approach
  // If arrival time is earlier than departure time, it's the next day
  const isNextDayArrival = arrivalTime && departureTime && 
    arrivalTime.localeCompare(departureTime) < 0;
  
  // Calculate arrival date without timezone issues
  let arrivalDate = departureDate;
  if (isNextDayArrival && departureDate) {
    // Parse the date components to avoid timezone issues
    if (typeof departureDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
      const [year, month, day] = departureDate.split('-').map(Number);
      const nextDay = new Date(year, month - 1, day + 1);
      const nextYear = nextDay.getFullYear();
      const nextMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
      const nextDayNum = String(nextDay.getDate()).padStart(2, '0');
      arrivalDate = `${nextYear}-${nextMonth}-${nextDayNum}`;
    } else {
      // Fallback for other date formats
      arrivalDate = new Date(new Date(departureDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
  }
  
  const departureDateTime = departureDate && departureTime ? 
    formatDateTime(departureDate, departureTime) : 
    formatTime(departureTime);
    
  const arrivalDateTime = arrivalDate && arrivalTime ? 
    formatDateTime(arrivalDate, arrivalTime) : 
    formatTime(arrivalTime);

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
              <span className="font-mono text-xs">{departureDateTime}</span>
            </p>
            <p className="w-full flex justify-between items-center text-sm">
              <span className="font-medium">Arrival:</span>
              <span className="font-mono text-xs">{arrivalDateTime}</span>
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