import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useSearch } from "@tanstack/react-router";
import { validatePaymentForm } from "../../../../lib/validationUtils";
import { ErrorBoundary } from "../../../../components";
import { BookingProgress } from "./index";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useCoachTypes, useFareCalculation } from "../hooks";
import coachTypeService from "../services/coachType.service";

export default function PaymentPage() {
  const { trainId } = useParams({ from: "/(user)/trains/$trainId/book/payment" });
  const search = useSearch({ from: "/(user)/trains/$trainId/book/payment" });
  const navigate = useNavigate();

  // Get coach types using the proper hook
  const { coachTypes, isLoading: loadingCoachTypes } = useCoachTypes();

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [paymentData, setPaymentData] = useState({
    method: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    upiId: ""
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const passengers = useMemo(() => 
    search.passengers ? JSON.parse(search.passengers) : [], 
    [search.passengers]
  );
  const bookingId = search.bookingId;

  // Get unique coach types from passengers and group by coach type
  const { uniqueCoachTypes, passengersByCoachType } = useMemo(() => {
    if (!coachTypes || passengers.length === 0) {
      return { uniqueCoachTypes: [], passengersByCoachType: {} };
    }

    // Extract unique coach type UUIDs from passengers
    const uniqueUUIDs = [...new Set(passengers.map(p => p.coachType).filter(Boolean))];
    
    // Convert UUIDs back to coach type names for fare service compatibility
    const uniqueNames = uniqueUUIDs.map(uuid => {
      const coachType = coachTypes.find(ct => ct.id === uuid);
      return coachType?.name;
    }).filter(Boolean);
    
    // Group passengers by coach type UUID (keeping original data) then convert to name-based grouping
    const passengersByUUID = {};
    passengers.forEach(passenger => {
      if (passenger.coachType) {
        passengersByUUID[passenger.coachType] = (passengersByUUID[passenger.coachType] || 0) + 1;
      }
    });
    
    // Convert UUID-based grouping to name-based grouping
    const passengersByName = {};
    Object.entries(passengersByUUID).forEach(([uuid, count]) => {
      const coachType = coachTypes.find(ct => ct.id === uuid);
      if (coachType?.name) {
        passengersByName[coachType.name] = (passengersByName[coachType.name] || 0) + count;
      }
    });
    
    return { uniqueCoachTypes: uniqueNames, passengersByCoachType: passengersByName };
  }, [passengers, coachTypes]);

  // Get coach type IDs for fare calculation
  const coachTypeIds = useMemo(() => {
    if (!coachTypes || uniqueCoachTypes.length === 0) return [];
    return uniqueCoachTypes
      .map(coachTypeName => {
        const coachType = coachTypes.find(ct => ct.name === coachTypeName);
        return coachType?.id;
      })
      .filter(Boolean);
  }, [coachTypes, uniqueCoachTypes]);

  const { 
    fareCalculations: rawFareCalculations, 
    isLoading: fareLoading, 
    isError: fareError,
    isFallback: fareFallback 
  } = useFareCalculation({
    train_id: trainId,
    coach_type_ids: coachTypeIds,
    from_station_id: search.from,
    to_station_id: search.to,
    enabled: !!(trainId && coachTypeIds.length > 0 && search.from && search.to)
  });

  // Transform fare calculations and calculate totals
  const { fareCalculations, totalAmount } = useMemo(() => {
    if (!coachTypes || Object.keys(passengersByCoachType).length === 0) {
      return { fareCalculations: [], totalAmount: 0 };
    }

    // If we have real fare calculations from the API
    if (rawFareCalculations && !fareError && !fareFallback && Array.isArray(rawFareCalculations)) {
      const formatted = rawFareCalculations.map(calc => {
        const coachType = coachTypes.find(ct => ct.id === calc.coach_type_id);
        const passengerCount = passengersByCoachType[coachType?.name] || 0;
        
        return {
          coach_type_name: coachType?.name || 'Unknown',
          coach_type_id: calc.coach_type_id,
          fare: calc.fare,
          passenger_count: passengerCount
        };
      }).filter(calc => calc.passenger_count > 0); // Only include coach types with passengers
      
      const total = formatted.reduce((sum, calc) => 
        sum + (calc.fare * calc.passenger_count), 0
      );
      
      return { 
        fareCalculations: formatted, 
        totalAmount: parseFloat(total.toFixed(2)) 
      };
    }
    
    // Fallback to hardcoded prices
    const fallbackCalculations = Object.entries(passengersByCoachType).map(([coachTypeName, passengerCount]) => {
      const coachType = coachTypes.find(ct => ct.name === coachTypeName);
      const fare = coachTypeService.getCoachTypePrice(coachTypeName, coachTypes);
      
      return {
        coach_type_name: coachTypeName,
        coach_type_id: coachType?.id,
        fare: fare,
        passenger_count: passengerCount
      };
    });
    
    const fallbackTotal = fallbackCalculations.reduce((sum, calc) => 
      sum + (calc.fare * calc.passenger_count), 0
    );
    
    return { 
      fareCalculations: fallbackCalculations, 
      totalAmount: parseFloat(fallbackTotal.toFixed(2)) 
    };
  }, [rawFareCalculations, fareError, fareFallback, coachTypes, passengersByCoachType]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
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

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const updatePaymentData = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors on change
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handlePayment = () => {
    // Validate form
    const validationErrors = validatePaymentForm(paymentData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);
    setMessage("Processing payment...");
    
    // Simulate payment processing
    setTimeout(() => {
      setMessage("✅ Payment Successful!");
      setTimeout(() => {
        navigate({
          to: "/bookings/$bookingId/details",
          params: { bookingId },
        });
      }, 1500);
    }, 2000);
  };

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
              Review your booking details and complete the payment to confirm your reservation.
            </p>
          </div>

          {/* Booking Progress */}
          <BookingProgress currentStep={3} />

          {/* Payment Timer */}
          <div className="alert alert-warning mb-6">
            <AlertTriangle className="stroke-current shrink-0 h-6 w-6" />
            <div>
              <div className="font-bold">Time Remaining: {formatTime(timeLeft)}</div>
              <div className="text-xs">Please complete your payment before the timer expires</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Train ID:</span>
                      <span>{trainId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Booking ID:</span>
                      <span>{bookingId}</span>
                    </div>
                  </div>

                  {/* Passengers with Coach Types */}
                  <div>
                    <h4 className="font-medium mb-2">Passengers & Coach Types:</h4>
                     <div className="space-y-2">
                       {passengers.map((passenger, idx) => (
                         <div key={idx} className="flex justify-between text-sm">
                           <span>{passenger.name}</span>
                           <div className="text-right">
                             <div>{passenger.age} years, {passenger.gender}</div>
                              <div className="text-xs text-base-content/70">
                                {coachTypeService.normalizeCoachTypeName(
                                  coachTypes?.find(ct => ct.id === passenger.coachType)?.name || passenger.coachType || 'AC 2 Tier'
                                )}
                              </div>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Fare Breakdown */}
                  <div>
                    <h4 className="font-medium mb-2">Fare Breakdown:</h4>
                    <div className="space-y-2">
                      {fareLoading ? (
                        <div className="flex justify-center">
                          <span className="loading loading-spinner loading-sm"></span>
                        </div>
                      ) : fareError ? (
                        <div className="text-error text-sm">{fareError}</div>
                      ) : (
                        fareCalculations.map((calc, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>
                              {coachTypeService.normalizeCoachTypeName(calc.coach_type_name)} × {calc.passenger_count}
                            </span>
                            <span>₹{(calc.fare * calc.passenger_count).toFixed(2)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="divider"></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-primary">
                      {fareLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : fareError ? (
                        <span className="text-error">Error</span>
                      ) : (
                        `₹${totalAmount}`
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Payment Details</h2>

                {/* Payment Method Selection */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Payment Method</span>
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="label cursor-pointer justify-start">
                      <input
                        type="radio"
                        name="method"
                        value="card"
                        checked={paymentData.method === "card"}
                        onChange={(e) => updatePaymentData("method", e.target.value)}
                        className="radio radio-primary mr-3"
                      />
                      <span>Credit/Debit Card</span>
                    </label>
                    <label className="label cursor-pointer justify-start">
                      <input
                        type="radio"
                        name="method"
                        value="upi"
                        checked={paymentData.method === "upi"}
                        onChange={(e) => updatePaymentData("method", e.target.value)}
                        className="radio radio-primary mr-3"
                      />
                      <span>UPI</span>
                    </label>
                  </div>
                  {errors.method && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.method}</span>
                    </label>
                  )}
                </div>

                {/* Card Payment Fields */}
                {paymentData.method === "card" && (
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Cardholder Name</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.cardholderName ? 'input-error' : ''}`}
                        value={paymentData.cardholderName}
                        onChange={(e) => updatePaymentData("cardholderName", e.target.value)}
                        placeholder="Enter cardholder name"
                      />
                      {errors.cardholderName && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.cardholderName}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Card Number</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.cardNumber ? 'input-error' : ''}`}
                        value={paymentData.cardNumber}
                        onChange={(e) => updatePaymentData("cardNumber", e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.cardNumber}</span>
                        </label>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Expiry Date</span>
                        </label>
                        <input
                          type="text"
                          className={`input input-bordered ${errors.expiryDate ? 'input-error' : ''}`}
                          value={paymentData.expiryDate}
                          onChange={(e) => updatePaymentData("expiryDate", e.target.value)}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && (
                          <label className="label">
                            <span className="label-text-alt text-error">{errors.expiryDate}</span>
                          </label>
                        )}
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">CVV</span>
                        </label>
                        <input
                          type="text"
                          className={`input input-bordered ${errors.cvv ? 'input-error' : ''}`}
                          value={paymentData.cvv}
                          onChange={(e) => updatePaymentData("cvv", e.target.value)}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors.cvv && (
                          <label className="label">
                            <span className="label-text-alt text-error">{errors.cvv}</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Payment Fields */}
                {paymentData.method === "upi" && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">UPI ID</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={paymentData.upiId}
                      onChange={(e) => updatePaymentData("upiId", e.target.value)}
                      placeholder="username@bank"
                    />
                  </div>
                )}

                 {/* Payment Button */}
                 <div className="card-actions mt-6">
                   <button 
                     className={`btn btn-primary btn-block btn-lg ${isProcessing ? 'loading' : ''}`}
                     onClick={handlePayment}
                     disabled={isProcessing || !paymentData.method || loadingCoachTypes}
                   >
                     {isProcessing ? 'Processing...' : loadingCoachTypes ? 'Loading...' : `Pay ₹${totalAmount}`}
                   </button>
                 </div>

                {/* Message */}
                {message && (
                  <div className="mt-4 text-center">
                    <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-info'}`}>
                      <span>{message}</span>
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
