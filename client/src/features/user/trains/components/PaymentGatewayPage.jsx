import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  CreditCard,
  Smartphone,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Wallet,
  QrCode,
  DollarSign,
  Phone,
} from "lucide-react";
import { ErrorBoundary } from "../../../../components";
import bookingService from "../services/booking.service";

export const PaymentGatewayPage = () => {
  const navigate = useNavigate();
  const { trainId } = useParams({
    from: "/(user)/trains/$trainId/book/gateway",
  });
  const search = useSearch({ from: "/(user)/trains/$trainId/book/gateway" });

  const [step, setStep] = useState("method-selection"); // 'method-selection', 'payment-details', 'processing', 'success', 'failed'
  const [paymentMethod, setPaymentMethod] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [selectedBank, setSelectedBank] = useState("");

  // Internal payment data collection
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  // Parse passengers from search params (for validation but not display)
  const passengers = search.passengers ? JSON.parse(search.passengers) : [];

  // Banks for UPI simulation
  const banks = [
    { id: "paytm", name: "Paytm", icon: Wallet },
    { id: "gpay", name: "Google Pay", icon: QrCode },
    { id: "phonepe", name: "PhonePe", icon: Phone },
    { id: "bhim", name: "BHIM UPI", icon: DollarSign },
  ];

  // Reset state when component mounts
  useEffect(() => {
    setStep("method-selection");
    setPaymentMethod("");
    setCountdown(3);
    setSelectedBank("");
    setCardData({
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    });
    setUpiId("");
  }, []);

  const handlePaymentSubmit = async () => {
    setStep("processing");

    // Simulate processing time (2-4 seconds)
    const processingTime = 2000 + Math.random() * 2000;

    setTimeout(async () => {
      // 90% success rate
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        try {
          // Confirm the booking via API
          await bookingService.confirmBooking(search.bookingId);

          setStep("success");
          setCountdown(3);

          // Auto redirect after countdown
          const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                // Navigate to booking details
                navigate({
                  to: "/bookings/$bookingId/",
                  params: { bookingId: search.bookingId },
                });
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } catch (error) {
          console.error("Failed to confirm booking:", error);
          setStep("failed");
        }
      } else {
        setStep("failed");
      }
    }, processingTime);
  };

  const handleRetry = () => {
    setStep("method-selection");
    setPaymentMethod("");
  };

  const handleGoBack = () => {
    navigate({
      to: "/trains/$trainId/book/payment",
      params: { trainId },
      search: {
        scheduleId: search.scheduleId,
        from: search.from,
        to: search.to,
        passengers: search.passengers,
        bookingId: search.bookingId,
      },
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-success" />
              <h1 className="text-3xl lg:text-4xl font-bold text-base-content">
                Secure Payment Gateway
              </h1>
            </div>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Complete your payment securely using our encrypted payment gateway
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Payment Amount Display */}
            <div className="card bg-base-100 shadow-xl mb-6">
              <div className="card-body text-center">
                <h2 className="card-title justify-center mb-4">
                  Payment Details
                </h2>
                <div className="space-y-2">
                  <div className="text-sm text-base-content/70">
                    Amount to Pay
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    ₹{search.amount}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Booking ID: {search.bookingId}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Payment Card */}
            <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
              <div className="card-body">
                {/* Payment Method Selection */}
                {step === "method-selection" && (
                  <div className="space-y-6">
                    <h2 className="card-title justify-center">
                      Choose Payment Method
                    </h2>
                    <p className="text-center text-base-content/70">
                      Select your preferred payment method to proceed
                    </p>

                    <div className="space-y-4">
                      <div
                        className="card bg-base-200 hover:bg-primary hover:text-primary-content cursor-pointer transition-all duration-200"
                        onClick={() => {
                          setPaymentMethod("card");
                          setStep("payment-details");
                        }}
                      >
                        <div className="card-body">
                          <div className="flex items-center gap-4">
                            <div className="btn btn-circle btn-primary btn-lg">
                              <CreditCard className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">
                                Credit/Debit Card
                              </h3>
                              <p className="text-sm opacity-70">
                                Visa, Mastercard, RuPay & more
                              </p>
                            </div>
                            <div className="text-2xl opacity-70">→</div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="card bg-base-200 hover:bg-secondary hover:text-secondary-content cursor-pointer transition-all duration-200"
                        onClick={() => {
                          setPaymentMethod("upi");
                          setStep("payment-details");
                        }}
                      >
                        <div className="card-body">
                          <div className="flex items-center gap-4">
                            <div className="btn btn-circle btn-secondary btn-lg">
                              <Smartphone className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">UPI Payment</h3>
                              <p className="text-sm opacity-70">
                                Pay using UPI ID or QR code
                              </p>
                            </div>
                            <div className="text-2xl opacity-70">→</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-info">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current shrink-0 w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>
                        All payments are processed through secure, encrypted
                        gateways
                      </span>
                    </div>
                  </div>
                )}

                {/* Payment Details */}
                {step === "payment-details" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <button
                        className="btn btn-circle btn-outline btn-sm"
                        onClick={() => setStep("method-selection")}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <h2 className="card-title">
                        Enter {paymentMethod === "card" ? "Card" : "UPI"}{" "}
                        Details
                      </h2>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="alert alert-info">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <div className="font-bold">
                              Credit/Debit Card Payment
                            </div>
                            <div className="text-sm">
                              Secure payment gateway
                            </div>
                          </div>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Cardholder Name</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter cardholder name"
                            className="input input-bordered w-full"
                            value={cardData.cardholderName}
                            onChange={(e) =>
                              setCardData((prev) => ({
                                ...prev,
                                cardholderName: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Card Number</span>
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="input input-bordered w-full"
                            value={cardData.cardNumber}
                            onChange={(e) => {
                              const formatted = e.target.value
                                .replace(/\s/g, "")
                                .replace(/(.{4})/g, "$1 ")
                                .trim();
                              setCardData((prev) => ({
                                ...prev,
                                cardNumber: formatted,
                              }));
                            }}
                            maxLength="19"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Expiry Date</span>
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="input input-bordered w-full"
                              value={cardData.expiryDate}
                              onChange={(e) => {
                                const formatted = e.target.value
                                  .replace(/\D/g, "")
                                  .replace(/(\d{2})(\d)/, "$1/$2");
                                setCardData((prev) => ({
                                  ...prev,
                                  expiryDate: formatted,
                                }));
                              }}
                              maxLength="5"
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">CVV</span>
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="input input-bordered w-full"
                              value={cardData.cvv}
                              onChange={(e) =>
                                setCardData((prev) => ({
                                  ...prev,
                                  cvv: e.target.value.replace(/\D/g, ""),
                                }))
                              }
                              maxLength="4"
                            />
                          </div>
                        </div>

                        <div className="alert alert-warning">
                          <span className="text-xs">
                            Powered by SecurePay Gateway (Simulated)
                          </span>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "upi" && (
                      <div className="space-y-4">
                        <div className="alert alert-info">
                          <Smartphone className="h-5 w-5" />
                          <div>
                            <div className="font-bold">UPI Payment</div>
                            <div className="text-sm">Enter your UPI ID</div>
                          </div>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">UPI ID</span>
                          </label>
                          <input
                            type="text"
                            placeholder="username@bank"
                            className="input input-bordered w-full"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">
                              Select Payment App
                            </span>
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {banks.map((bank) => (
                              <div
                                key={bank.id}
                                className={`card cursor-pointer transition-all ${
                                  selectedBank === bank.id
                                    ? "bg-secondary text-secondary-content"
                                    : "bg-base-200 hover:bg-base-300"
                                }`}
                                onClick={() => setSelectedBank(bank.id)}
                              >
                                <div className="card-body items-center text-center p-4">
                                  <div className="text-2xl mb-1">
                                    <bank.icon className="h-6 w-6" />
                                  </div>
                                  <div className="text-xs font-medium">
                                    {bank.name}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="card-actions justify-center">
                      <button
                        className="btn btn-success btn-lg btn-wide"
                        onClick={handlePaymentSubmit}
                        disabled={
                          (paymentMethod === "card" &&
                            (!cardData.cardholderName ||
                              !cardData.cardNumber ||
                              !cardData.expiryDate ||
                              !cardData.cvv)) ||
                          (paymentMethod === "upi" && (!upiId || !selectedBank))
                        }
                      >
                        Pay ₹{search.amount}
                      </button>
                    </div>

                    <div className="alert alert-warning">
                      <span className="text-xs">
                        This is a simulated payment gateway for demo purposes
                      </span>
                    </div>
                  </div>
                )}

                {/* Processing State */}
                {step === "processing" && (
                  <div className="text-center space-y-6 py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Processing Payment...
                      </h2>
                      <p className="text-base-content/70">
                        Please wait while we process your payment
                      </p>
                    </div>
                    <div className="alert alert-warning">
                      <span className="text-sm">
                        Do not close this window or press back button
                      </span>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {step === "success" && (
                  <div className="text-center space-y-6 py-8">
                    <CheckCircle className="h-20 w-20 text-success mx-auto" />
                    <div>
                      <h2 className="text-2xl font-bold text-success mb-2">
                        Payment Successful!
                      </h2>
                      <p className="text-base-content/70 mb-4">
                        Your booking has been confirmed
                      </p>
                      <div className="countdown font-mono text-2xl">
                        <span style={{ "--value": countdown }}></span>
                      </div>
                      <p className="text-sm text-base-content/70">
                        Redirecting in {countdown} seconds...
                      </p>
                    </div>
                  </div>
                )}

                {/* Failed State */}
                {step === "failed" && (
                  <div className="text-center space-y-6 py-8">
                    <AlertCircle className="h-20 w-20 text-error mx-auto" />
                    <div>
                      <h2 className="text-2xl font-bold text-error mb-2">
                        Payment Failed
                      </h2>
                      <p className="text-base-content/70 mb-4">
                        Your payment could not be processed. Please try again.
                      </p>
                    </div>
                    <div className="card-actions justify-center gap-4">
                      <button className="btn btn-primary" onClick={handleRetry}>
                        Try Again
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={handleGoBack}
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            {(step === "method-selection" || step === "payment-details") && (
              <div className="flex justify-center mt-6 max-w-2xl mx-auto">
                <button className="btn btn-outline" onClick={handleGoBack}>
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Payment Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PaymentGatewayPage;

