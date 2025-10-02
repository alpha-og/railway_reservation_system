import { useEffect } from "react";
import { safeGet, formatTime, formatDate } from "../../../../lib/dataUtils";

export default function TrainSchedule({ schedule, isLoading, error }) {
  useEffect(() => {
    console.log("Schedule", schedule);
  }, [schedule]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="card bg-base-100 shadow-xl animate-pulse">
          <div className="card-body">
            <div className="skeleton h-8 w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="skeleton h-12 w-12 rounded-full shrink-0"></div>
                  <div className="flex-1">
                    <div className="skeleton h-4 w-32 mb-2"></div>
                    <div className="skeleton h-3 w-24"></div>
                  </div>
                  <div className="skeleton h-6 w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Error loading schedule</h3>
            <div className="text-xs">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  const scheduleStops = schedule?.schedule_stops || [];
  const departureDate = safeGet(schedule, 'departure_date');
  const departureTime = safeGet(schedule, 'departure_time');

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="card-title text-2xl font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Train Schedule
            </h2>
            {departureDate && (
              <div className="badge badge-primary badge-lg">
                {formatDate(departureDate)} • {formatTime(departureTime)}
              </div>
            )}
          </div>

          {!schedule || scheduleStops.length === 0 ? (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold">No schedule information</h3>
                <div className="text-xs">Schedule details are not available for this train at the moment.</div>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile and Desktop Timeline */}
              <div className="hidden md:block">
                <ul className="timeline timeline-snap-icon timeline-compact timeline-vertical">
                  {scheduleStops.map((stop, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === scheduleStops.length - 1;
                    const stationName = safeGet(stop, 'station.name', 'Unknown Station');
                    const arrivalTime = formatTime(safeGet(stop, 'arrival_time'));
                    const departureTime = formatTime(safeGet(stop, 'departure_time'));

                    return (
                      <li key={idx}>
                        <div className="timeline-middle">
                          <div className={`
                            w-4 h-4 rounded-full border-2 
                            ${isFirst ? 'bg-success border-success' : 
                              isLast ? 'bg-error border-error' : 
                              'bg-primary border-primary'}
                          `}></div>
                        </div>
                        <div className={`timeline-start mb-10 ${idx % 2 === 0 ? 'md:text-end' : ''}`}>
                          <time className="font-mono italic text-sm opacity-70">
                            {isFirst ? `Dep: ${departureTime}` :
                             isLast ? `Arr: ${arrivalTime}` :
                             `${arrivalTime} - ${departureTime}`}
                          </time>
                          <div className="text-lg font-black">{stationName}</div>
                          {!isFirst && !isLast && (
                            <div className="text-xs opacity-60">
                              Stop {idx} • Platform TBD
                            </div>
                          )}
                        </div>
                        <div className={`timeline-end mb-10 ${idx % 2 !== 0 ? 'md:text-end' : ''}`}>
                          <div className={`
                            badge badge-sm
                            ${isFirst ? 'badge-success' : 
                              isLast ? 'badge-error' : 
                              'badge-accent'}
                          `}>
                            {isFirst ? 'Origin' : isLast ? 'Destination' : 'Stop'}
                          </div>
                        </div>
                        {!isLast && <hr className="bg-base-300" />}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-3">
                {scheduleStops.map((stop, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === scheduleStops.length - 1;
                  const stationName = safeGet(stop, 'station.name', 'Unknown Station');
                  const arrivalTime = formatTime(safeGet(stop, 'arrival_time'));
                  const departureTime = formatTime(safeGet(stop, 'departure_time'));

                  return (
                    <div key={idx} className="card card-compact bg-base-200 shadow-sm">
                      <div className="card-body">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-3 h-3 rounded-full
                              ${isFirst ? 'bg-success' : 
                                isLast ? 'bg-error' : 
                                'bg-primary'}
                            `}></div>
                            <div>
                              <h3 className="font-semibold">{stationName}</h3>
                              <div className="text-xs opacity-70">
                                {isFirst ? 'Starting Point' : 
                                 isLast ? 'Final Destination' : 
                                 `Stop ${idx}`}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm">
                              {isFirst ? `Dep: ${departureTime}` :
                               isLast ? `Arr: ${arrivalTime}` :
                               `${arrivalTime} - ${departureTime}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Schedule Stats */}
              <div className="stats stats-vertical sm:stats-horizontal shadow mt-6 w-full">
                <div className="stat">
                  <div className="stat-title">Total Stops</div>
                  <div className="stat-value text-primary">{scheduleStops.length}</div>
                  <div className="stat-desc">Including origin & destination</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Journey Date</div>
                  <div className="stat-value text-secondary text-lg">
                    {departureDate ? formatDate(departureDate) : 'TBD'}
                  </div>
                  <div className="stat-desc">Departure: {formatTime(departureTime)}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Route Type</div>
                  <div className="stat-value text-accent text-lg">
                    {scheduleStops.length > 5 ? 'Express' : 'Local'}
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
