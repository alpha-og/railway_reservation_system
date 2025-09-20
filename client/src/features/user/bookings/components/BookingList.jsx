import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useUserBookings } from "../hooks/useUserBookings";
import { useFilteredBookings } from "../hooks/useFilteredBookings";
import Badge from "../../../badge/component/Badge";

export default function BookingList({ userId }) {
  const { bookings, isLoading, isError, isFallback } = useUserBookings(userId);

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = useFilteredBookings(
    bookings,
    statusFilter,
    dateFilter,
    searchTerm
  );

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-2">Fetching your bookings...</p>
      </div>
    );
  }

  if (isError && bookings.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 font-semibold">
          Failed to fetch bookings. Showing fallback/demo data.
        </p>
      </div>
    );
  }

  return (
    <div>
      {isFallback && (<span className="badge bg-yellow-200 mb-10 text-black">Demo Data</span>)}


      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by PNR, Source, Destination..."
          className="input input-bordered w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="input input-bordered w-full md:w-1/4"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <select
          className="select select-bordered w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Booking Cards */}
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
      {filteredBookings.length === 0 ? (
        <p className="text-gray-500">No bookings match your filters.</p>
      ) : (
        <div className="space-y-4">
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
              <div key={booking?.bookingId} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-xl">
                    {trainName} ({trainCode})
                  </h3>
                  <p className="text-sm text-gray-500">PNR: {booking?.pnr || "-"}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <span className="font-semibold">From:</span> {booking?.source || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">To:</span> {booking?.destination || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span> {booking?.departureDate || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <Badge text={booking?.status || "Pending"} type={badgeType} />
                    </p>
                  </div>

                  <p className="mt-2">
                    <span className="font-semibold">Total Amount:</span> ₹{totalAmount}
                  </p>

                  {/* Passengers Table */}
                  <div className="overflow-x-auto mt-4">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Age</th>
                          <th>Seat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {passengers.length > 0 ? (
                          passengers.map((p, idx) => (
                            <tr key={idx}>
                              <td>{p?.name || "-"}</td>
                              <td>{p?.age ?? "-"}</td>
                              <td>{p?.seat ?? "-"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-center">No passengers</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <Link
                      to="/bookings/$bookingId/details"
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
