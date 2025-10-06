import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useSearch } from "@tanstack/react-router";
import { ErrorBoundary } from "../../../../components";
import { BookingProgress } from "./index";
import { AlertTriangle, ArrowLeft, MapPin, Clock, Train } from "lucide-react";
import { useCoachTypes } from "../hooks/useCoachData";
import { useJourneyDetails } from "../hooks/useJourneyDetails";
import coachTypeService from "../services/coachType.service";
import bookingService from "../services/booking.service";
import { usePayment } from "../hooks/usePayment";
import { formatDate, formatTime } from "../../../../lib/dataUtils";

export default function PaymentPage() {
  const { trainId } = useParams({
    from: "/(user)/trains/$trainId/book/payment",
  });
  const search = useSearch({ from: "/(user)/trains/$trainId/book/payment" });
  const navigate = useNavigate();

  // Get coach types using the proper hook
  const {
    isLoading: loadingCoachTypes,
    getCoachPrice,
    getCoachTypeName,
  } = useCoachTypes();

  // Get journey details for enhanced booking summary
  const { journeyDetails, isLoading: loadingJourney } = useJourneyDetails(
    search.scheduleId,
    search.from,
    search.to,
  );

  // Calculate initial time left based on booking creation time
  const getInitialTimeLeft = () => {
    const bookingId = search.bookingId;
    if (!bookingId) return 600; // 10 minutes if no booking

    const storageKey = `payment_timer_${bookingId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const { startTime } = JSON.parse(stored);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 600 - elapsed); // 10 minutes total
      return remaining;
    } else {
      // First time - store the start time
      const startTime = Date.now();
      localStorage.setItem(storageKey, JSON.stringify({ startTime }));
      return 600;
    }
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Payment state management
  const [bookingCreated, setBookingCreated] = useState(!!search.bookingId);
  const [currentBookingId, setCurrentBookingId] = useState(search.bookingId);
  const {
    processPayment,
    isSuccess: paymentSuccess,
    isError: paymentError,
    error: paymentErrorMessage,
    step: paymentStep,
    setStep,
  } = usePayment();

  const passengers = useMemo(
    () => (search.passengers ? JSON.parse(search.passengers) : []),
    [search.passengers],
  );
  const bookingId = search.bookingId;

  // Calculate fare breakdown and total using the same method as PassengersPage
  const { fareCalculations, totalAmount } = useMemo(() => {
    if (!passengers || passengers.length === 0) {
      return { fareCalculations: [], totalAmount: 0 };
    }

    // Group passengers by coach type and calculate totals
    const fareMap = new Map();

    passengers.forEach((passenger) => {
      const coachTypeId = passenger.coachType;
      const coachTypeName = getCoachTypeName(coachTypeId);
      const fare = getCoachPrice(coachTypeId);

      if (fareMap.has(coachTypeId)) {
        fareMap.get(coachTypeId).passenger_count += 1;
      } else {
        fareMap.set(coachTypeId, {
          coach_type_name: coachTypeName,
          coach_type_id: coachTypeId,
          fare: fare,
          passenger_count: 1,
        });
      }
    });

    const calculations = Array.from(fareMap.values());
    const total = calculations.reduce(
      (sum, calc) => sum + calc.fare * calc.passenger_count,
      0,
    );

    return {
      fareCalculations: calculations,
      totalAmount: parseFloat(total.toFixed(2)),
    };
  }, [passengers, getCoachPrice, getCoachTypeName]);

  // Timer with cleanup on expiry
  useEffect(() => {
    if (timeLeft <= 0) {
      // Clean up timer data when expired
      const bookingId = search.bookingId;
      if (bookingId) {
        localStorage.removeItem(`payment_timer_${bookingId}`);
      }
      
      navigate({
        to: "/trains/$trainId/book/passengers",
        params: { trainId },
        search: {
          scheduleId: search.scheduleId,
          from: search.from,
          to: search.to,
          passengers: search.passengers,
        },
      });
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, trainId, navigate, search]);

  const formatTimerTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handlePayment = async () => {
    try {
      let bookingId = currentBookingId;

      // Step 1: Create booking if not already created
      if (!bookingCreated && !bookingId) {
        setStep("creating");
        setIsProcessing(true);
        setMessage("Creating your booking...");

        const bookingResponse = await bookingService.createBooking({
          scheduleId: search.scheduleId,
          fromStationId: search.from,
          toStationId: search.to,
          totalAmount: totalAmount,
          passengers: passengers.map((p) => ({
            name: p.name,
            age: parseInt(p.age),
            gender: p.gender,
            coachType: p.coachType,
          })),
        });

        bookingId = bookingResponse.booking.id;
        setCurrentBookingId(bookingId);
        setBookingCreated(true);
        setMessage("Booking created successfully!");
        
        // Store timer start time for this new booking
        const storageKey = `payment_timer_${bookingId}`;
        const startTime = Date.now();
        localStorage.setItem(storageKey, JSON.stringify({ startTime }));
      }

      // Step 2: Navigate to Payment Gateway Page
      setIsProcessing(false);
      setMessage("");

      navigate({
        to: "/trains/$trainId/book/gateway",
        params: { trainId },
        search: {
          amount: totalAmount,
          bookingId: bookingId,
          passengers: search.passengers,
          scheduleId: search.scheduleId,
          from: search.from,
          to: search.to,
        },
      });
    } catch (error) {
      setStep("error");
      setMessage("❌ An error occurred: " + error.message);
      setErrors({ payment: error.message });
      setIsProcessing(false);
    }
  };

  const retryPayment = () => {
    setStep("payment");
    setMessage("");
    setErrors({});
    setIsProcessing(false);
  };

  // Booking recovery effect
  useEffect(() => {
    if (search.bookingId && !currentBookingId) {
      setCurrentBookingId(search.bookingId);
      setBookingCreated(true);
      setMessage("Booking found. You can proceed with payment.");
    }
  }, [search.bookingId, currentBookingId]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-2">
              Complete Payment
            </h1>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Review your booking details and complete the payment to confirm
              your reservation.
            </p>
          </div>

          {/* Booking Progress */}
          <BookingProgress currentStep={3} />

          {/* Payment Timer */}
          <div className="alert alert-warning mb-6">
            <AlertTriangle className="stroke-current shrink-0 h-6 w-6" />
            <div>
              <div className="font-bold">
                Time Remaining: {formatTimerTime(timeLeft)}
              </div>
              <div className="text-xs">
                Please complete your payment before the timer expires
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Booking Summary</h2>

                {/* Journey Details */}
                {loadingJourney ? (
                  <div className="space-y-3">
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-3/4"></div>
                    <div className="skeleton h-4 w-1/2"></div>
                  </div>
                ) : journeyDetails ? (
                  <div className="space-y-4 mb-6 p-4 bg-base-200 rounded-lg">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Train className="h-5 w-5 text-primary" />
                      {journeyDetails.train.name}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-base-content/70 mb-1">
                          Train Number
                        </div>
                        <div className="font-bold">
                          {journeyDetails.train.number}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-base-content/70 mb-1">
                          Journey Date
                        </div>
                        <div className="font-bold">
                          {formatDate(journeyDetails.schedule.departureDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-base-100 rounded-lg p-3">
                      <div className="text-center flex-1">
                        <div className="font-bold text-lg">
                          {journeyDetails.fromStation.code}
                        </div>
                        <div className="text-sm text-base-content/70 mb-1">
                          {journeyDetails.fromStation.name}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          {formatTime(journeyDetails.fromStation.departureTime)}
                        </div>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <div className="text-xs text-base-content/70 mb-1">
                          Duration
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="border-t border-dashed border-base-content/30 w-12"></div>
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                        <div className="text-xs font-medium mt-1">
                          {journeyDetails.duration}
                        </div>
                      </div>

                      <div className="text-center flex-1">
                        <div className="font-bold text-lg">
                          {journeyDetails.toStation.code}
                        </div>
                        <div className="text-sm text-base-content/70 mb-1">
                          {journeyDetails.toStation.name}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          {formatTime(journeyDetails.toStation.arrivalTime)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Booking ID:</span>
                      <span className="font-mono">{bookingId}</span>
                    </div>
                  </div>

                  {/* Passengers with Coach Types */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <span className="badge badge-primary badge-sm">
                        {passengers.length}
                      </span>
                      Passenger{passengers.length > 1 ? "s" : ""}
                    </h4>
                    <div className="space-y-3">
                      {passengers.map((passenger, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 bg-base-200 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{passenger.name}</div>
                            <div className="text-sm text-base-content/70">
                              {passenger.age} years • {passenger.gender}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="badge badge-outline">
                              {coachTypeService.normalizeCoachTypeName(
                                getCoachTypeName(passenger.coachType),
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fare Breakdown */}
                  <div>
                    <h4 className="font-medium mb-3">Fare Breakdown</h4>
                    {loadingCoachTypes ? (
                      <div className="space-y-2">
                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-3/4"></div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {fareCalculations.map((calc, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-2 bg-base-200 rounded"
                          >
                            <div>
                              <span className="font-medium">
                                {coachTypeService.normalizeCoachTypeName(
                                  calc.coach_type_name,
                                )}
                              </span>
                              <span className="text-sm text-base-content/70 ml-2">
                                × {calc.passenger_count}
                              </span>
                            </div>
                            <div className="font-medium">
                              ₹{(calc.fare * calc.passenger_count).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Total Amount */}
                  <div className="divider"></div>
                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <span className="text-lg font-bold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">
                      {loadingCoachTypes ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        `₹${totalAmount}`
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary & Proceed Button */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-6">Ready to Complete Payment</h2>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        🔒
                      </div>
                      <div>
                        <div className="font-medium text-green-800">
                          Secure Payment
                        </div>
                        <div className="text-sm text-green-600">
                          SSL encrypted payment gateway
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-green-700">
                      Your booking details have been verified. Proceed to our
                      secure payment gateway to complete your transaction.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">
                        Payment Methods:
                      </span>
                    </div>
                    <div className="text-right">
                      <div>💳 Credit/Debit Cards</div>
                      <div>📱 UPI Payment</div>
                    </div>
                  </div>
                </div>

                {/* Proceed to Payment Button */}
                <div className="card-actions">
                  <button
                    className={`btn btn-primary btn-block btn-lg ${isProcessing || paymentStep === "processing" || paymentStep === "creating" ? "loading" : ""}`}
                    onClick={handlePayment}
                    disabled={
                      isProcessing ||
                      loadingCoachTypes ||
                      paymentStep === "processing" ||
                      paymentStep === "creating" ||
                      paymentSuccess
                    }
                  >
                    {paymentStep === "creating"
                      ? "Creating Booking..."
                      : paymentStep === "processing"
                        ? "Processing Payment..."
                        : paymentSuccess
                          ? "Payment Successful!"
                          : isProcessing
                            ? "Processing..."
                            : loadingCoachTypes
                              ? "Loading..."
                              : `Proceed to Pay ₹${totalAmount}`}
                  </button>

                  {/* Retry Button for Failed Payments */}
                  {paymentError && !paymentSuccess && (
                    <button
                      className="btn btn-outline btn-warning btn-block mt-2"
                      onClick={retryPayment}
                      disabled={isProcessing}
                    >
                      Try Again
                    </button>
                  )}
                </div>

                {/* Message */}
                {(message || paymentErrorMessage) && (
                  <div className="mt-4 text-center">
                    <div
                      className={`alert ${
                        message.includes("✅") || paymentSuccess
                          ? "alert-success"
                          : message.includes("❌") || paymentError
                            ? "alert-error"
                            : "alert-info"
                      }`}
                    >
                      <span>{message || paymentErrorMessage}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              className="btn btn-outline btn-lg"
              onClick={() => {
                navigate({
                  to: "/trains/$trainId/book/passengers",
                  params: { trainId },
                  search: {
                    scheduleId: search.scheduleId,
                    from: search.from,
                    to: search.to,
                    passengers: search.passengers,
                  },
                });
              }}
              disabled={isProcessing}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Passenger Details
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
