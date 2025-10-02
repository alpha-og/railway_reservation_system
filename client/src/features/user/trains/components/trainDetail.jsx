import { useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { safeGet, formatTime } from "../../../../lib/dataUtils";

export default function TrainDetail({ train, isLoading, error }) {
  const router = useRouter();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Train", train);
  }, [train]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="card bg-base-100 shadow-xl animate-pulse">
          <div className="card-body">
            <div className="flex items-center gap-4 mb-6">
              <div className="skeleton h-16 w-16 rounded-full shrink-0"></div>
              <div className="flex-1">
                <div className="skeleton h-8 w-48 mb-2"></div>
                <div className="skeleton h-4 w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-32 w-full"></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <div className="skeleton h-12 w-24"></div>
              <div className="skeleton h-12 w-32"></div>
              <div className="skeleton h-12 w-28"></div>
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
            <h3 className="font-bold">Error loading train details</h3>
            <div className="text-xs">{error.message}</div>
          </div>
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="alert alert-warning shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="font-bold">Train not found</h3>
            <div className="text-xs">The requested train information could not be located.</div>
          </div>
        </div>
      </div>
    );
  }

  const trainName = safeGet(train, 'name');
  const trainCode = safeGet(train, 'code');
  const trainId = safeGet(train, 'id');

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="lg:w-64 bg-gradient-to-br from-primary/20 to-secondary/20">
          <div className="avatar placeholder p-8">
            <div className="bg-primary text-primary-content w-24 h-24 rounded-full shadow-lg">
              <span className="text-2xl font-bold">{trainCode.slice(0, 2)}</span>
            </div>
          </div>
        </figure>
        
        <div className="card-body flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="card-title text-2xl lg:text-3xl font-bold text-base-content">
                {trainName}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="badge badge-outline badge-lg">
                  Train #{trainCode}
                </div>
              </div>
            </div>
          </div>

          {/* Train Info Grid - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm opacity-70">From</div>
                <div className="stat-value text-lg font-semibold text-primary">
                  {safeGet(train, 'source', 'Source Station')}
                </div>
                <div className="stat-desc">
                  Departure: {formatTime(safeGet(train, 'departure_time', 'N/A'))}
                </div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm opacity-70">Journey Duration</div>
                <div className="stat-value text-lg font-semibold">
                  {safeGet(train, 'duration', 'N/A')}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm opacity-70">To</div>
                <div className="stat-value text-lg font-semibold text-secondary">
                  {safeGet(train, 'destination', 'Destination Station')}
                </div>
                <div className="stat-desc">
                  Arrival: {formatTime(safeGet(train, 'arrival_time', 'N/A'))}
                </div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm opacity-70">Available Classes</div>
                <div className="stat-value text-sm">
                  <div className="flex flex-wrap gap-1 mt-2">
                    {train?.classes?.length > 0 ? (
                      train.classes.map((cls, idx) => (
                        <div key={idx} className="badge badge-accent badge-sm">
                          {cls}
                        </div>
                      ))
                    ) : (
                      <span className="text-base-content/70">Information not available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card-actions justify-end flex-wrap gap-2">
            <button
              onClick={() => router.history.back()}
              className="btn btn-outline btn-sm sm:btn-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
            <button
              onClick={() =>
                navigate({
                  to: `/trains/${trainId}/schedule`,
                })
              }
              className="btn btn-info btn-sm sm:btn-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Schedules
            </button>
            <button
              onClick={() =>
                navigate({
                  to: `/trains/${trainId}/book`,
                })
              }
              className="btn btn-primary btn-sm sm:btn-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
