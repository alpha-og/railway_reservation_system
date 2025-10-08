import {
  Train,
  MapPin,
  Calendar,
  Clock,
  Users,
  CreditCard,
  Route,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  Clock3,
  MapPinned,
} from "lucide-react";
import { useState } from "react";
import { useBookingFormatter } from "../hooks/useBookingFormatter";
import Badge from "../../../badge/component/Badge";
import { Card } from "../../../../components/ui";

export default function PnrBookingDetails({ booking }) {
  const formattedBooking = useBookingFormatter(booking);
  const [copiedPNR, setCopiedPNR] = useState(false);

  const handleCopyPNR = async () => {
    try {
      await navigator.clipboard.writeText(formattedBooking.pnr);
      setCopiedPNR(true);
      setTimeout(() => setCopiedPNR(false), 2000);
    } catch {
      console.error("Failed to copy PNR");
    }
  };

  if (!formattedBooking) return null;

  return (
    <div className="space-y-6">
      {/* Header with PNR */}
      <Card shadow="lg" className="border border-primary/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl lg:text-3xl font-bold text-base-content">
                Booking Details
              </h2>
              <Badge
                text={formattedBooking.status}
                type={formattedBooking.badgeType}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-base-content/70 text-sm">PNR:</span>
                <span className="font-mono font-bold text-lg text-primary">
                  {formattedBooking.pnr}
                </span>
                <button
                  onClick={handleCopyPNR}
                  className="btn btn-ghost btn-xs"
                  title="Copy PNR"
                >
                  {copiedPNR ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Journey Timeline Card */}
          <Card
            shadow="xl"
            className="border border-primary/10 overflow-hidden"
          >
            <Card.Title className="text-xl lg:text-2xl flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <Route className="w-6 h-6 text-primary-content" />
              </div>
              Journey Information
            </Card.Title>

            {/* Journey Visual */}
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Departure */}
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center shadow-lg">
                        <MapPinned className="w-6 h-6 text-success-content" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-content rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-success font-medium mb-1">
                        DEPARTURE
                      </p>
                      <h3 className="text-xl font-bold text-base-content break-words">
                        {formattedBooking.source}
                      </h3>
                      <p className="text-sm text-base-content/60 font-mono mb-3">
                        {formattedBooking.sourceCode}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-base-content/60" />
                          <span className="font-medium">
                            {formattedBooking.formattedDepartureDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-bold">
                          <Clock3 className="w-5 h-5 text-primary" />
                          <span className="text-primary">
                            {formattedBooking.formattedDepartureTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-error rounded-full flex items-center justify-center shadow-lg">
                        <MapPin className="w-6 h-6 text-error-content" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-error-content rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-error font-medium mb-1">
                        ARRIVAL
                      </p>
                      <h3 className="text-xl font-bold text-base-content break-words">
                        {formattedBooking.destination}
                      </h3>
                      <p className="text-sm text-base-content/60 font-mono mb-3">
                        {formattedBooking.destinationCode}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-base-content/60" />
                          <span className="font-medium">
                            {formattedBooking.formattedDepartureDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-bold">
                          <Clock3 className="w-5 h-5 text-secondary" />
                          <span className="text-secondary">
                            {formattedBooking.formattedArrivalTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Journey Stats */}
              <div className="mt-8 pt-6 border-t border-base-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {formattedBooking.journeyDuration && (
                    <div className="stat bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4">
                      <div className="stat-figure text-primary">
                        <Clock className="w-8 h-8" />
                      </div>
                      <div className="stat-title text-xs">
                        Journey Duration
                      </div>
                      <div className="stat-value text-lg text-primary">
                        {formattedBooking.journeyDuration}
                      </div>
                    </div>
                  )}
                  {formattedBooking.distanceText && (
                    <div className="stat bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl p-4">
                      <div className="stat-figure text-secondary">
                        <Route className="w-8 h-8" />
                      </div>
                      <div className="stat-title text-xs">Distance</div>
                      <div className="stat-value text-lg text-secondary">
                        {formattedBooking.distanceText}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Train Information Card */}
          <Card shadow="xl" className="border border-accent/10">
            <Card.Title className="text-xl lg:text-2xl flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-accent to-primary rounded-lg">
                <Train className="w-6 h-6 text-accent-content" />
              </div>
              Train Information
            </Card.Title>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-base-content/70 mb-1">
                    Train Name
                  </p>
                  <p className="text-xl font-bold text-base-content">
                    {formattedBooking.train?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70 mb-1">
                    Train Number
                  </p>
                  <p className="text-lg font-mono font-bold text-accent">
                    {formattedBooking.train?.code}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Passengers Card */}
          <Card shadow="xl" className="border border-info/10">
            <Card.Title className="text-xl lg:text-2xl flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-info to-primary rounded-lg">
                <Users className="w-6 h-6 text-info-content" />
              </div>
              Passengers ({formattedBooking.passengers?.length || 0})
            </Card.Title>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th className="text-left font-semibold">Passenger</th>
                    <th className="text-center font-semibold">Age</th>
                    <th className="text-center font-semibold">Gender</th>
                    <th className="text-center font-semibold">Coach</th>
                    <th className="text-center font-semibold">Seat</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedBooking.passengers?.length > 0 ? (
                    formattedBooking.passengers.map((passenger, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-base-100 transition-colors"
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                                <span className="text-xs font-bold">
                                  {passenger.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <span className="font-medium">
                              {passenger.name}
                            </span>
                          </div>
                        </td>
                        <td className="text-center font-medium">
                          {passenger.age}
                        </td>
                        <td className="text-center">
                          <span className="badge badge-outline badge-sm">
                            {passenger.gender}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge badge-primary badge-sm">
                            {passenger.coachType}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="font-mono text-sm font-bold bg-base-200 px-2 py-1 rounded">
                            {passenger.seat || "Not assigned"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-base-content/70 py-8"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-12 h-12 text-base-content/30" />
                          <span>No passengers found</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Summary Card */}
          <Card shadow="xl" className="border border-success/10 sticky top-6">
            <Card.Title className="text-lg flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-success to-primary rounded-lg">
                <CreditCard className="w-5 h-5 text-success-content" />
              </div>
              Booking Summary
            </Card.Title>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70 text-sm">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formattedBooking.formattedTotalAmount}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="text-base-content/70">Status</span>
                  <Badge
                    text={formattedBooking.status}
                    type={formattedBooking.badgeType}
                  />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="text-base-content/70">Booked on</span>
                  <span className="text-sm font-medium">
                    {formattedBooking.formattedBookingDate}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-base-content/70">Passengers</span>
                  <span className="font-semibold">
                    {formattedBooking.passengers?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card shadow="xl" className="border border-warning/10">
            <Card.Title className="text-lg mb-4">Quick Actions</Card.Title>
            <div className="space-y-3">
              {/* Download and Print buttons hidden */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}