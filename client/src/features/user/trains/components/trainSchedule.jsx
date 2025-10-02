import { safeGet, formatTime, formatDate, calculateScheduleDates } from "../../../../lib/dataUtils";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton";
import { XCircle, MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function TrainSchedule({ schedule, isLoading, error, selectedFrom, selectedTo }) {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <LoadingSkeleton type="default" className="h-8 w-48 mb-6" />
            <LoadingSkeleton type="timeline" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="alert alert-error shadow-lg">
          <XCircle className="stroke-current shrink-0 h-6 w-6" />
          <div>
            <h3 className="font-bold">Error loading schedule</h3>
            <div className="text-xs">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  const scheduleStops = schedule?.schedule_stops || [];
  const departureDate = safeGet(schedule, "departure_date");
  const departureTime = safeGet(schedule, "departure_time");
  
  // Calculate dates for all stops
  const stopDates = calculateScheduleDates(departureDate, departureTime, scheduleStops);

  // Helper function to determine if a station is selected
  const getStationStatus = (stationId) => {
    if (stationId === selectedFrom) return 'from';
    if (stationId === selectedTo) return 'to';
    return null;
  };

  // Helper function to get highlighting classes
  const getHighlightClasses = (stationStatus, isFirst, isLast) => {
    if (stationStatus === 'from') {
      return {
        dot: 'bg-gradient-to-r from-emerald-400 to-cyan-400 border-white ring-4 ring-emerald-300/50 scale-125 shadow-lg shadow-emerald-300/50',
        badge: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-none font-bold',
        card: 'bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-300 ring-2 ring-emerald-200 shadow-lg'
      };
    }
    if (stationStatus === 'to') {
      return {
        dot: 'bg-gradient-to-r from-purple-400 to-pink-400 border-white ring-4 ring-purple-300/50 scale-125 shadow-lg shadow-purple-300/50',
        badge: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none font-bold',
        card: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 ring-2 ring-purple-200 shadow-lg'
      };
    }
    // Default classes for non-selected stations
    return {
      dot: isFirst
        ? 'bg-success border-success-content'
        : isLast
          ? 'bg-error border-error-content'
          : 'bg-primary border-primary-content',
      badge: isFirst ? 'badge-success' : isLast ? 'badge-error' : 'badge-primary',
      card: isFirst
        ? 'bg-success/5 border-success/20'
        : isLast
          ? 'bg-error/5 border-error/20'
          : 'bg-primary/5 border-primary/20'
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="card-title text-2xl font-bold">
              <Clock className="h-6 w-6 mr-2" />
              Train Schedule
            </h2>
            {departureDate && (
              <div className="badge badge-primary badge-lg w-full sm:w-auto">
                {formatDate(departureDate)} • {formatTime(departureTime)}
              </div>
            )}
          </div>

          {!schedule || scheduleStops.length === 0 ? (
            <div className="alert alert-info">
              <AlertTriangle className="stroke-current shrink-0 h-6 w-6" />
              <div>
                <h3 className="font-bold">No schedule information</h3>
                <div className="text-xs">
                  Schedule details are not available for this train at the
                  moment.
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Horizontal Timeline */}
              <div className="hidden md:block overflow-x-auto py-8">
                <div className="relative">
                  {/* Background line */}
                  <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-base-300 transform -translate-y-1/2">
                    <div className="absolute inset-0 bg-primary/30"></div>
                  </div>

                  {/* Stations */}
                  <div className="flex justify-between items-center px-8">
                     {scheduleStops.map((stop, idx) => {
                       const isFirst = idx === 0;
                       const isLast = idx === scheduleStops.length - 1;
                       const stationId = safeGet(stop, "station.id");
                       const stationName = safeGet(
                         stop,
                         "station.name",
                         "Unknown Station",
                       );
                       const arrivalTime = formatTime(
                         safeGet(stop, "arrival_time"),
                       );
                       const departureTime = formatTime(
                         safeGet(stop, "departure_time"),
                       );
                       
                       // Get calculated dates for this stop
                       const stopDateInfo = stopDates[idx] || {};
                       const arrivalDate = stopDateInfo.arrivalDate || departureDate;
                       const departureStopDate = stopDateInfo.departureDate || departureDate;

                       // Get station status and highlighting classes
                       const stationStatus = getStationStatus(stationId);
                       const highlightClasses = getHighlightClasses(stationStatus, isFirst, isLast);

                       return (
                         <div
                           key={idx}
                           className="h-32 flex flex-col items-center relative z-10"
                         >
                           {/* Badge */}
                           <div
                             className={`
                             badge badge-sm mb-3 text-xs font-medium transition-all duration-200
                             ${highlightClasses.badge}
                           `}
                           >
                             {stationStatus === 'from' ? "From" :
                              stationStatus === 'to' ? "To" :
                              isFirst ? "Origin" :
                              isLast ? "Destination" : "Stop"}
                           </div>

                           {/* Station Dot with Tooltip */}
                           <div
                            className={`
                              w-6 h-6 rounded-full border-3 shadow-lg cursor-pointer tooltip tooltip-top
                              transition-all duration-300 hover:scale-110 relative z-10
                              ${highlightClasses.dot}
                            `}
                            data-tip={
                              isFirst
                                ? `Departure: ${formatDate(departureStopDate)} ${departureTime}`
                                : isLast
                                  ? `Arrival: ${formatDate(arrivalDate)} ${arrivalTime}`
                                  : `Arrival: ${formatDate(arrivalDate)} ${arrivalTime} • Departure: ${formatDate(departureStopDate)} ${departureTime}`
                            }
                          ></div>

                          {/* Station Name */}
                          <div className="text-center mt-3 max-w-24">
                            <div className="font-bold text-sm leading-tight">
                              {stationName}
                            </div>
                            {!isFirst && !isLast && (
                              <div className="text-xs text-base-content/60 mt-1">
                                Stop {idx}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Vertical Timeline - Enhanced */}
              <div className="block md:hidden">
                <div className="relative pl-6 pr-2 py-4 overflow-hidden">
                  {/* Main timeline line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-success via-primary to-error rounded-full"></div>

                   <div className="space-y-4">
                     {scheduleStops.map((stop, idx) => {
                       const isFirst = idx === 0;
                       const isLast = idx === scheduleStops.length - 1;
                       const stationId = safeGet(stop, "station.id");
                       const stationName = safeGet(
                         stop,
                         "station.name",
                         "Unknown Station",
                       );
                       const arrivalTime = formatTime(
                         safeGet(stop, "arrival_time"),
                       );
                       const departureTime = formatTime(
                         safeGet(stop, "departure_time"),
                       );
                       
                       // Get calculated dates for this stop
                       const stopDateInfo = stopDates[idx] || {};
                       const arrivalDate = stopDateInfo.arrivalDate || departureDate;
                       const departureStopDate = stopDateInfo.departureDate || departureDate;

                       // Get station status and highlighting classes
                       const stationStatus = getStationStatus(stationId);
                       const highlightClasses = getHighlightClasses(stationStatus, isFirst, isLast);

                       return (
                         <div key={idx} className="relative">
                            {/* Timeline node */}
                            <div
                              className={`
                                absolute -left-1.5 top-2 w-4 h-4 rounded-full border-2 z-10
                                shadow-md transition-all duration-300
                                ${stationStatus === 'from' ? 
                                  'bg-gradient-to-r from-emerald-400 to-cyan-400 border-white ring-2 ring-emerald-300/50 scale-110 shadow-lg shadow-emerald-300/50' :
                                  stationStatus === 'to' ?
                                  'bg-gradient-to-r from-purple-400 to-pink-400 border-white ring-2 ring-purple-300/50 scale-110 shadow-lg shadow-purple-300/50' :
                                  isFirst ?
                                  'bg-success border-success-content' :
                                  isLast ?
                                  'bg-error border-error-content' :
                                  'bg-primary border-primary-content'
                                }
                              `}
                            ></div>

                           {/* Station card */}
                           <div
                             className={`
                               ml-3 p-3 rounded-lg border transition-all duration-300 
                               max-w-full overflow-hidden
                               ${highlightClasses.card}
                             `}
                           >
                            {/* Header with badge and station name */}
                            <div className="flex items-start justify-between mb-2 gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-1">
                                   <div
                                     className={`
                                       badge badge-xs font-medium text-xs flex items-center gap-1
                                       ${highlightClasses.badge}
                                     `}
                                   >
                                     {stationStatus === 'from' ? (
                                       <>
                                         <CheckCircle className="w-3 h-3" />
                                         From
                                       </>
                                     ) : stationStatus === 'to' ? (
                                       <>
                                         <CheckCircle className="w-3 h-3" />
                                         To
                                       </>
                                     ) : isFirst ? (
                                       <>
                                         <CheckCircle className="w-3 h-3" />
                                         Start
                                       </>
                                     ) : isLast ? (
                                       <>
                                         <CheckCircle className="w-3 h-3" />
                                         End
                                       </>
                                     ) : (
                                       <>
                                         <MapPin className="w-3 h-3" />
                                         Stop {idx}
                                       </>
                                     )}
                                   </div>
                                </div>
                                <h3 className="font-bold text-base leading-tight text-base-content truncate">
                                  {stationName}
                                </h3>
                                <p className="text-xs text-base-content/60 mt-0.5 truncate">
                                  {isFirst
                                    ? "Journey starts"
                                    : isLast
                                      ? "Final stop"
                                      : "Stop"}
                                </p>
                              </div>
                            </div>

                            {/* Time information - Responsive Grid */}
                            <div className="space-y-2">
                              {/* Arrival time (not shown for origin) */}
                              {!isFirst && (
                                  <div className="bg-base-100/80 rounded p-2 border border-base-300/50">
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-info" />
                                        <span className="text-xs font-medium text-base-content/60">
                                          ARRIVAL
                                        </span>
                                      </div>
                                    <div className="text-right">
                                      <div className="font-mono text-base font-bold text-info">
                                        {arrivalTime || "TBD"}
                                      </div>
                                      <div className="text-xs text-base-content/60">
                                        {formatDate(arrivalDate)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Departure time (not shown for destination) */}
                              {!isLast && (
                                  <div className="bg-base-100/80 rounded p-2 border border-base-300/50">
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-warning" />
                                        <span className="text-xs font-medium text-base-content/60">
                                          {isFirst ? "DEPARTURE" : "DEPART"}
                                        </span>
                                      </div>
                                    <div className="text-right">
                                      <div className="font-mono text-base font-bold text-warning">
                                        {departureTime || "TBD"}
                                      </div>
                                      <div className="text-xs text-base-content/60">
                                        {formatDate(departureStopDate)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Stop duration for intermediate stops */}
                              {!isFirst &&
                                !isLast &&
                                arrivalTime &&
                                departureTime && (
                                  <div className="bg-accent/10 rounded p-2 border border-accent/20">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-accent" />
                                        <span className="text-xs text-base-content/60">
                                          Duration:
                                        </span>
                                      </div>
                                      <span className="text-xs font-medium text-accent">
                                        {(() => {
                                          try {
                                            const arrival = new Date(
                                              `1970-01-01T${arrivalTime}`,
                                            );
                                            const departure = new Date(
                                              `1970-01-01T${departureTime}`,
                                            );
                                            const diffMinutes =
                                              Math.abs(departure - arrival) /
                                              (1000 * 60);
                                            return `${Math.floor(diffMinutes)}m`;
                                          } catch {
                                            return "N/A";
                                          }
                                        })()}
                                      </span>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Schedule Stats */}
              <div className="stats stats-vertical sm:stats-horizontal shadow mt-6 w-full">
                <div className="stat">
                  <div className="stat-title">Total Stops</div>
                  <div className="stat-value text-primary">
                    {scheduleStops.length}
                  </div>
                  <div className="stat-desc">
                    Including origin & destination
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">Journey Date</div>
                  <div className="stat-value text-secondary text-lg">
                    {departureDate ? formatDate(departureDate) : "TBD"}
                  </div>
                  <div className="stat-desc">
                    Departure: {formatTime(departureTime)}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">Route Type</div>
                  <div className="stat-value text-accent text-lg">
                    {scheduleStops.length > 5 ? "Express" : "Local"}
                  </div>
                  <div className="stat-desc">Based on stops</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
