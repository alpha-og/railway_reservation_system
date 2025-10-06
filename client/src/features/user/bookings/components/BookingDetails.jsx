import { useParams, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Train,
  MapPin,
  Calendar,
  Clock,
  Users,
  CreditCard,
  Route,
  ArrowLeft,
  Download,
  Printer,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Star,
  Phone,
  Mail,
  Share2,
  Copy,
  Clock3,
  MapPinned,
} from "lucide-react";
import { useBookingDetails } from "../hooks/useBookingDetails";
import { useBookingFormatter } from "../hooks/useBookingFormatter";
import { useBookingCancellation } from "../hooks/useBookingCancellation";
import Badge from "../../../badge/component/Badge";
import { Card } from "../../../../components/ui";
import { PageLoadingSkeleton } from "../../../../components/LoadingSkeleton";

export default function BookingDetails() {
  const { bookingId } = useParams({ from: "/(user)/bookings/$bookingId/" });
  const { booking, isLoading, isError } = useBookingDetails(bookingId);
  const formattedBooking = useBookingFormatter(booking);
  const {
    cancelBooking,
    isLoading: isCancelling,
    isSuccess: isCancelled,
  } = useBookingCancellation();
  const [copiedPNR, setCopiedPNR] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCopyPNR = async () => {
    try {
      await navigator.clipboard.writeText(formattedBooking.pnr);
      setCopiedPNR(true);
      setTimeout(() => setCopiedPNR(false), 2000);
    } catch (err) {
      console.error("Failed to copy PNR:", err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Railway Booking - ${formattedBooking.pnr}`,
      text: `My railway booking from ${formattedBooking.source} to ${formattedBooking.destination}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyPNR();
    }
  };

  const handleCancelBooking = async () => {
    try {
      await cancelBooking(bookingId);
      setShowCancelDialog(false);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    }
  };

  // Enhanced loading state
  if (!bookingId || isLoading) {
    return <PageLoadingSkeleton />;
  }

  // Enhanced error state
  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card
              variant="ghost"
              shadow="2xl"
              className="border border-error/20"
            >
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-error" />
                </div>
                <h3 className="text-2xl font-bold text-base-content mb-4">
                  Booking Not Found
                </h3>
                <p className="text-base-content/70 mb-6 leading-relaxed">
                  The requested booking could not be found or you don't have
                  access to it. Please check your booking reference and try
                  again.
                </p>
                <div className="space-y-3">
                  <Link to="/bookings" className="btn btn-primary btn-block">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to My Bookings
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn btn-outline btn-block"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Enhanced Header with PNR and Quick Actions */}
        <div className="mb-8">
          <Card shadow="lg" className="border border-primary/10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-base-content">
                    Booking Details
                  </h1>
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

              <Card.Actions className="gap-3 lg:flex-nowrap">
                <Link to="/bookings" className="btn btn-outline">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Back to Bookings</span>
                  <span className="sm:hidden">Back</span>
                </Link>
                <button onClick={handleShare} className="btn btn-ghost">
                  <Share2 className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </Card.Actions>
            </div>
          </Card>
        </div>

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

              {/* Enhanced Journey Visual */}
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
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center">
                      <Train className="w-12 h-12 text-accent" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Star className="w-6 h-6 text-warning fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Passengers Card */}
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

          {/* Enhanced Sidebar */}
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
                <button className="btn btn-outline btn-block hover:btn-primary transition-all duration-200">
                  <Download className="w-5 h-5 mr-2" />
                  Download Ticket
                </button>
                <button className="btn btn-outline btn-block hover:btn-secondary transition-all duration-200">
                  <Printer className="w-5 h-5 mr-2" />
                  Print Ticket
                </button>
                {formattedBooking.status?.toLowerCase() === "confirmed" &&
                  !isCancelled && (
                    <button
                      className="btn btn-error btn-outline btn-block hover:btn-error transition-all duration-200"
                      onClick={() => setShowCancelDialog(true)}
                      disabled={isCancelling}
                    >
                      <X className="w-5 h-5 mr-2" />
                      {isCancelling ? "Cancelling..." : "Cancel Booking"}
                    </button>
                  )}
                {isCancelled && (
                  <div className="alert alert-success">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Booking cancelled successfully</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Help & Support Card */}
            <Card shadow="xl" className="border border-info/10">
              <Card.Title className="text-lg mb-4">Need Help?</Card.Title>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer">
                  <Phone className="w-4 h-4 text-info" />
                  <span>Call Support: 139</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer">
                  <Mail className="w-4 h-4 text-info" />
                  <span>Email Support</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer">
                  <Info className="w-4 h-4 text-info" />
                  <span>View FAQ</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Cancellation Confirmation Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card
              shadow="2xl"
              className="w-full max-w-md border border-error/20"
            >
              <Card.Title className="text-xl flex items-center gap-3 mb-4">
                <div className="p-2 bg-error/10 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-error" />
                </div>
                Cancel Booking
              </Card.Title>

              <div className="space-y-4">
                <p className="text-base-content/70">
                  Are you sure you want to cancel this booking? This action
                  cannot be undone.
                </p>

                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-warning-content">
                      <p className="font-medium mb-1">Important:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Cancellation charges may apply</li>
                        <li>Refund processing may take 5-7 business days</li>
                        <li>This booking will be permanently cancelled</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Card.Actions className="mt-6 gap-3">
                <button
                  className="btn btn-outline flex-1"
                  onClick={() => setShowCancelDialog(false)}
                  disabled={isCancelling}
                >
                  Keep Booking
                </button>
                <button
                  className="btn btn-error flex-1"
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel Booking
                    </>
                  )}
                </button>
              </Card.Actions>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
