import { useNavigate, useRouter } from "@tanstack/react-router";
import { safeGet, formatTime, calculateScheduleDates, formatDateTime } from "../../../../lib/dataUtils";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton";
import { XCircle, AlertTriangle, Train, MapPin, Clock, CheckCircle, DollarSign, ArrowLeft, Clock as ClockIcon, Ticket } from "lucide-react";

export default function TrainDetail({ train, schedule = null, availableSeats = null, isLoading, error }) {
  const router = useRouter();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-3 sm:p-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4 sm:p-6">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <LoadingSkeleton type="default" className="h-16 w-16 rounded-full shrink-0" />
                <div className="flex-1">
                  <LoadingSkeleton type="default" className="h-6 w-48 mb-2" />
                  <LoadingSkeleton type="default" className="h-4 w-32" />
                </div>
              </div>
            </div>
            
            {/* Grid skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <LoadingSkeleton type="default" className="h-32 w-full" />
              <LoadingSkeleton type="default" className="h-32 w-full" />
            </div>
            
            {/* Actions skeleton */}
            <div className="flex flex-wrap justify-end gap-2">
              <LoadingSkeleton type="default" className="h-10 w-20 sm:h-12 sm:w-24" />
              <LoadingSkeleton type="default" className="h-10 w-24 sm:h-12 sm:w-32" />
              <LoadingSkeleton type="default" className="h-10 w-20 sm:h-12 sm:w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-3 sm:p-4">
        <div className="alert alert-error shadow-lg">
          <XCircle className="stroke-current shrink-0 h-5 w-5 sm:h-6 sm:w-6" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base">Error loading train details</h3>
            <div className="text-xs sm:text-sm truncate">{error.message}</div>
          </div>
          <button 
            className="btn btn-sm btn-outline shrink-0"
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
      <div className="w-full max-w-4xl mx-auto p-3 sm:p-4">
        <div className="alert alert-warning shadow-lg">
          <AlertTriangle className="stroke-current shrink-0 h-5 w-5 sm:h-6 sm:w-6" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base">Train not found</h3>
            <div className="text-xs sm:text-sm">The requested train information could not be located.</div>
          </div>
        </div>
      </div>
    );
  }

  const trainName = safeGet(train, 'name');
  const trainCode = safeGet(train, 'code');
  const trainId = safeGet(train, 'id');
  
  // Extract route information from schedule
  const scheduleStops = schedule?.schedule_stops || [];
  const sortedStops = [...scheduleStops].sort((a, b) => (a.stop_number || 0) - (b.stop_number || 0));
  
  const sourceStation = sortedStops[0]?.station?.name || 'N/A';
  const destinationStation = sortedStops[sortedStops.length - 1]?.station?.name || 'N/A';
  const departureTime = sortedStops[0]?.departure_time || 'N/A';
  const arrivalTime = sortedStops[sortedStops.length - 1]?.arrival_time || 'N/A';
  
  // Calculate dates for each stop
  const scheduleDates = calculateScheduleDates(
    schedule?.departure_date, 
    departureTime, 
    sortedStops
  );
  
  // Get formatted date-time strings for departure and arrival
  // For departure: use the schedule's departure_date (when journey begins)
  // For arrival: use calculated date from scheduleDates
  const departureDateTime = schedule?.departure_date ? 
    formatDateTime(schedule.departure_date, departureTime) : 
    formatTime(departureTime);
  const arrivalDateTime = scheduleDates[sortedStops.length - 1]?.arrivalDate ? 
    formatDateTime(scheduleDates[sortedStops.length - 1].arrivalDate, arrivalTime) : 
    formatTime(arrivalTime);
  
  // Calculate duration if both times are available
  const calculateDuration = (depTime, arrTime) => {
    if (depTime === 'N/A' || arrTime === 'N/A') return 'N/A';
    try {
      const [depHours, depMinutes] = depTime.split(':').map(Number);
      const [arrHours, arrMinutes] = arrTime.split(':').map(Number);
      
      let totalDepMinutes = depHours * 60 + depMinutes;
      let totalArrMinutes = arrHours * 60 + arrMinutes;
      
      // Handle next day arrival
      if (totalArrMinutes < totalDepMinutes) {
        totalArrMinutes += 24 * 60;
      }
      
      const diffMinutes = totalArrMinutes - totalDepMinutes;
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      
      return `${hours}h ${minutes}m`;
    } catch {
      return 'N/A';
    }
  };
  
  const duration = calculateDuration(departureTime, arrivalTime);
  
  // Get unique coach types from available seats data
  const availableClasses = availableSeats ? 
    [...new Set(availableSeats.map(seat => seat.coach_type))].filter(Boolean) : 
    [];

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4">
      <div className="card lg:card-side bg-base-100 shadow-xl overflow-hidden">
        {/* Premium Gradient Figure */}
        <figure className="lg:w-64 relative overflow-hidden flex-shrink-0">
          {/* Animated Premium Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 via-indigo-600 to-pink-600 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 opacity-80 animate-gradient-y"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500 via-cyan-500 to-blue-600 opacity-60 animate-pulse"></div>
          
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Content */}
          <div className="relative z-10 p-6 lg:p-8 w-full h-full flex flex-col items-center justify-center min-h-[200px] lg:min-h-[300px]">
            {/* Elegant Train Icon */}
            <div className="mb-4 p-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-xl">
              <Train className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            
            {/* Train Code Display */}
            <div className="text-center">
              <div className="text-white/90 text-xs sm:text-sm font-medium tracking-wider uppercase mb-1">
                Train Code
              </div>
              <div className="text-white text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide drop-shadow-lg">
                {trainCode}
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 left-6 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
          </div>
        </figure>
        
        <div className="card-body flex-1 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="card-title text-xl sm:text-2xl lg:text-3xl font-bold text-base-content break-words">
                {trainName}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="badge badge-outline badge-sm sm:badge-md lg:badge-lg">
                  Train #{trainCode}
                </div>
              </div>
            </div>
          </div>

          {/* Train Info Grid - Enhanced Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {/* Left Column */}
            <div className="space-y-3 sm:space-y-4">
              <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
                <div className="stat-title text-xs sm:text-sm opacity-70 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  From
                </div>
                <div className="stat-value text-base sm:text-lg lg:text-xl font-semibold text-primary break-words">
                  {sourceStation}
                </div>
                <div className="stat-desc text-xs sm:text-sm">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Departure: {departureDateTime}
                </div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
                <div className="stat-title text-xs sm:text-sm opacity-70 mb-1">
                  <ClockIcon className="w-4 h-4 inline mr-1" />
                  Journey Duration
                </div>
                <div className="stat-value text-base sm:text-lg lg:text-xl font-semibold">
                  {duration}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3 sm:space-y-4">
              <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
                <div className="stat-title text-xs sm:text-sm opacity-70 mb-1">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  To
                </div>
                <div className="stat-value text-base sm:text-lg lg:text-xl font-semibold text-secondary break-words">
                  {destinationStation}
                </div>
                <div className="stat-desc text-xs sm:text-sm">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Arrival: {arrivalDateTime}
                </div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
                <div className="stat-title text-xs sm:text-sm opacity-70 mb-1">
                  <Ticket className="w-4 h-4 inline mr-1" />
                  Available Classes
                </div>
                <div className="stat-value text-xs sm:text-sm">
                  <div className="flex flex-wrap gap-1 mt-2">
                    {availableClasses?.length > 0 ? (
                      availableClasses.map((cls, idx) => (
                        <div key={idx} className="badge badge-accent badge-xs sm:badge-sm">
                          {cls}
                        </div>
                      ))
                    ) : (
                      <span className="text-base-content/70 text-xs">Information not available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions - Enhanced Mobile */}
          <div className="card-actions justify-stretch sm:justify-end">
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => router.history.back()}
                className="btn btn-outline btn-sm sm:btn-md order-1 sm:order-none"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Go Back</span>
                <span className="sm:hidden">Back</span>
              </button>
              <button
                onClick={() =>
                  navigate({
                    to: `/trains/${trainId}/schedule`,
                  })
                }
                className="btn btn-info btn-sm sm:btn-md order-2 sm:order-none"
              >
                <ClockIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">View Schedules</span>
                <span className="sm:hidden">Schedules</span>
              </button>
              <button
                onClick={() =>
                  navigate({
                    to: `/trains/${trainId}/book`,
                  })
                }
                className="btn btn-primary btn-sm sm:btn-md order-3 sm:order-none"
              >
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Book Now</span>
                <span className="sm:hidden">Book</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
