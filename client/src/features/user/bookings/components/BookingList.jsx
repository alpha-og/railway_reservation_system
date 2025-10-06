import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  LogIn,
  Search,
  Calendar,
  Filter,
  Train,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import { useUserBookings } from "../hooks/useUserBookings";
import { useFilteredBookings } from "../hooks/useFilteredBookings";
import { useAuthStore } from "../../../../store/useAuthStore";
import Badge from "../../../badge/component/Badge";

export default function BookingList() {
  const { token } = useAuthStore();
  const { bookings, isLoading, isError } = useUserBookings();

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = useFilteredBookings(
    bookings,
    statusFilter,
    dateFilter,
    searchTerm,
  );

  // Show authentication required message if not logged in
  if (!token) {
    return (
      <div className="text-center p-8">
        <div className="alert alert-warning max-w-md mx-auto">
          <AlertCircle className="h-6 w-6" />
          <div>
            <h3 className="font-bold">Authentication Required</h3>
            <div className="text-sm">Please sign in to view your bookings</div>
          </div>
        </div>
        <Link to="/signin" className="btn btn-primary mt-4">
          <LogIn className="h-5 w-5 mr-2" />
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-2">Fetching your bookings...</p>
      </div>
    );
  }

  if (isError && (!bookings || bookings.length === 0)) {
    return (
      <div className="text-center p-8">
        <div className="alert alert-error max-w-md mx-auto">
          <AlertCircle className="h-6 w-6" />
          <div>
            <h3 className="font-bold">Failed to load bookings</h3>
            <div className="text-sm">
              Unable to fetch your bookings. Please try again.
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4 sm:p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Bookings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </span>
              </label>
              <input
                type="text"
                placeholder="Search by PNR, Source, Destination..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Train className="h-6 w-6" />
          Your Bookings
          {filteredBookings.length > 0 && (
            <span className="badge badge-neutral">
              {filteredBookings.length}
            </span>
          )}
        </h2>
      </div>

      {/* Booking Cards */}
      {filteredBookings.length === 0 ? (
        <div className="text-center p-8">
          <div className="alert alert-info max-w-md mx-auto">
            <AlertCircle className="h-6 w-6" />
            <div>
              <h3 className="font-bold">No bookings found</h3>
              <div className="text-sm">
                {searchTerm || dateFilter || statusFilter !== "all"
                  ? "No bookings match your current filters"
                  : "You haven't made any bookings yet"}
              </div>
            </div>
          </div>
          {!searchTerm && !dateFilter && statusFilter === "all" && (
            <Link to="/trains" className="btn btn-primary mt-4">
              <Train className="h-5 w-5 mr-2" />
              Book Your First Journey
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 lg:gap-6">
          {filteredBookings.map((booking) => {
            const status = (booking?.status || "Pending").toLowerCase();
            const trainName = booking?.train?.name || "-";
            const trainCode = booking?.train?.code || "-";
            const passengers = booking?.passengers || [];
            const totalAmount = booking?.totalAmount ?? 0;

            const badgeType =
              status === "confirmed"
                ? "success"
                : status === "pending"
                  ? "warning"
                  : "error";

            return (
              <div
                key={booking?.bookingId}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="card-body p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className="card-title text-lg sm:text-xl flex items-center gap-2">
                        <Train className="h-5 w-5" />
                        {trainName} ({trainCode})
                      </h3>
                      <p className="text-sm text-base-content/70 mt-1">
                        PNR:{" "}
                        <span className="font-mono font-semibold">
                          {booking?.pnr || "-"}
                        </span>
                      </p>
                    </div>
                    <Badge
                      text={booking?.status || "Pending"}
                      type={badgeType}
                    />
                  </div>

                  {/* Journey Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-semibold">From:</span>
                        <span>{booking?.source || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-secondary" />
                        <span className="font-semibold">To:</span>
                        <span>{booking?.destination || "-"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-semibold">Date:</span>
                        <span>{booking?.departureDate || "-"}</span>
                      </div>
                      {booking?.departureTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-semibold">Time:</span>
                          <span>{booking.departureTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-4">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-lg font-bold text-primary ml-2">
                      ₹{totalAmount}
                    </span>
                  </div>

                  {/* Passengers */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Passengers ({passengers.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr className="text-xs">
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Seat</th>
                          </tr>
                        </thead>
                        <tbody>
                          {passengers.length > 0 ? (
                            passengers.map((p, idx) => (
                              <tr key={idx} className="text-sm">
                                <td className="font-medium">
                                  {p?.name || "-"}
                                </td>
                                <td>{p?.age ?? "-"}</td>
                                <td>{p?.gender || "-"}</td>
                                <td className="font-mono">
                                  {p?.seat ?? "Not assigned"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className="text-center text-base-content/70"
                              >
                                No passengers
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end">
                    <Link
                      to="/bookings/$bookingId/"
                      params={{ bookingId: booking?.bookingId }}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
