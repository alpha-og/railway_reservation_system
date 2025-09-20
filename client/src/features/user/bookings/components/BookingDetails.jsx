import { useParams, Link } from "@tanstack/react-router";
import { useBookingDetails } from "../hooks/useBookingDetails";
import Badge from "../../../badge/component/Badge";

export default function BookingDetails() {
  const { bookingId } = useParams({ from: "/(user)/bookings/$bookingId/details" });
  const { booking, isLoading, isFallback } = useBookingDetails(bookingId);

  if (isLoading && !booking) {
    return (
      <p className="text-center p-8">
        <span className="loading loading-spinner loading-lg"></span> Loading booking details...
      </p>
    );
  }

  if (!booking) {
    return (
      <p className="text-center text-error p-8">
        Booking not found!
      </p>
    );
  }

  const badgeType =
    booking.status?.toLowerCase() === "confirmed"
      ? "success"
      : booking.status?.toLowerCase() === "pending"
      ? "warning"
      : "error";

  return (
    <div className="flex justify-center p-6">
      <div className="card w-full max-w-2xl bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-3xl font-bold">Booking Details</h2>
            {isFallback && (<span className="badge bg-yellow-200 text-black">Demo Data</span>)}

          </div>

          <div className="divider"></div>

          <p className="text-sm font-semibold mb-2">
            PNR: <span className="text-xl font-bold">{booking.pnr || "N/A"}</span>
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p>
                <span className="font-semibold">Train:</span>{" "}
                {booking.train?.name || "N/A"} ({booking.train?.code || "N/A"})
              </p>
              <p><span className="font-semibold">From:</span> {booking.source || "N/A"}</p>
              <p><span className="font-semibold">Departure Date:</span> {booking.departureDate || "N/A"}</p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <Badge text={booking.status || "N/A"} type={badgeType} />
              </p>
              <p><span className="font-semibold">To:</span> {booking.destination || "N/A"}</p>
              <p><span className="font-semibold">Total Amount:</span> ₹{booking.totalAmount?.toFixed(2) || "0.00"}</p>
            </div>
          </div>

          <div className="divider"></div>

          <h3 className="text-lg font-bold">Passengers</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Seat</th>
                </tr>
              </thead>
              <tbody>
                {booking.passengers?.length > 0 ? (
                  booking.passengers.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.name || "N/A"}</td>
                      <td>{p.age || "N/A"}</td>
                      <td>{p.seat || "N/A"}</td>
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

          <div className="card-actions justify-end mt-6">
            <Link to="/bookings" className="btn btn-outline">Back to All Bookings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
