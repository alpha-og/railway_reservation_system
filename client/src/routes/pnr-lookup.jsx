import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, AlertCircle, LogIn } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { usePnrLookup } from "../features/user/bookings/hooks/usePnrLookup";
import PnrBookingDetails from "../features/user/bookings/components/PnrBookingDetails";

export const Route = createFileRoute("/pnr-lookup")({
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = useAuthStore();
  const [pnr, setPnr] = useState("");
  const [error, setError] = useState("");
  
  const { 
    lookupPnr, 
    booking, 
    isLoading, 
    isError, 
    isSuccess,
    error: apiError 
  } = usePnrLookup();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!pnr.trim()) {
      setError("Please enter a PNR number");
      return;
    }

    setError("");
    
    try {
      await lookupPnr(pnr.trim().toUpperCase());
    } catch (err) {
      // Error handling is done in the hook, but we can set additional UI errors if needed
      if (err.response?.status === 404) {
        setError("No booking found with this PNR number");
      } else if (err.response?.status === 403) {
        setError("You are not authorized to view this booking");
      } else {
        setError("Failed to search booking. Please try again.");
      }
    }
  };

  // Show authentication required message if not logged in
  if (!token) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="alert alert-warning max-w-md mx-auto">
            <AlertCircle className="h-6 w-6" />
            <div>
              <h3 className="font-bold">Authentication Required</h3>
              <div className="text-sm">Please sign in to lookup booking by PNR</div>
            </div>
          </div>
          <a href="/signin" className="btn btn-primary mt-4">
            <LogIn className="h-5 w-5 mr-2" />
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">PNR Lookup</h1>
          <p className="text-base-content/70">
            Enter your PNR number to view booking details
          </p>
        </div>

        {/* Search Form */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text font-semibold">PNR Number</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter PNR (e.g., ABC123)"
                  className="input input-bordered w-full"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.toUpperCase())}
                  disabled={isLoading}
                  maxLength={10}
                />
              </div>
              <div className="form-control sm:self-end">
                <button 
                  type="submit" 
                  className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {!isLoading && <Search className="h-5 w-5 mr-2" />}
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {(error || (isError && apiError)) && (
          <div className="alert alert-error mb-6">
            <AlertCircle className="h-6 w-6" />
            <span>{error || apiError?.message || "An error occurred"}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-2">Searching for booking...</p>
          </div>
        )}

        {/* Booking Results */}
        {isSuccess && booking && !isLoading && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <PnrBookingDetails booking={booking} />
            </div>
          </div>
        )}

        {/* No results state */}
        {!booking && !isLoading && !error && !isError && pnr && (
          <div className="text-center p-8">
            <div className="alert alert-info max-w-md mx-auto">
              <AlertCircle className="h-6 w-6" />
              <div>
                <h3 className="font-bold">No Results</h3>
                <div className="text-sm">
                  Enter a PNR number and click search to view booking details
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}