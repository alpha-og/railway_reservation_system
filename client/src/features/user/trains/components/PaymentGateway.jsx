import { useState, useEffect } from "react";
import { CreditCard, Smartphone, Shield, X, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import bookingService from "../services/booking.service";

export const PaymentGateway = ({ 
  isOpen, 
  onClose, 
  onPaymentComplete, 
  amount, 
  bookingId
}) => {
  const [step, setStep] = useState('method-selection'); // 'method-selection', 'payment-details', 'processing', 'success', 'failed'
  const [paymentMethod, setPaymentMethod] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [selectedBank, setSelectedBank] = useState('');
  
  // Internal payment data collection
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');

  // Banks for UPI simulation
  const banks = [
    { id: 'paytm', name: 'Paytm', logo: '💰' },
    { id: 'gpay', name: 'Google Pay', logo: '🔵' },
    { id: 'phonepe', name: 'PhonePe', logo: '🟣' },
    { id: 'bhim', name: 'BHIM UPI', logo: '🔷' }
  ];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('method-selection');
      setPaymentMethod('');
      setCountdown(3);
      setSelectedBank('');
      setCardData({ cardNumber: '', cardholderName: '', expiryDate: '', cvv: '' });
      setUpiId('');
    }
  }, [isOpen]);

  const handlePaymentSubmit = async () => {
    setStep('processing');
    
    // Simulate processing time (2-4 seconds)
    const processingTime = 2000 + Math.random() * 2000;
    
    setTimeout(async () => {
      // 90% success rate
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        try {
          // Confirm the booking via API
          await bookingService.confirmBooking(bookingId);
          
          setStep('success');
          setCountdown(3);
          
          // Auto close and complete after countdown
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                onPaymentComplete({ success: true, bookingId });
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } catch (error) {
          console.error('Failed to confirm booking:', error);
          setStep('failed');
        }
      } else {
        setStep('failed');
      }
    }, processingTime);
  };

  const handleRetry = () => {
    setStep('method-selection');
    setPaymentMethod('');
  };

  const handleClose = () => {
    if (step !== 'processing') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
          </div>
          {step !== 'processing' && (
            <button 
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Amount Display */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Amount to Pay</div>
              <div className="text-2xl font-bold text-gray-900">₹{amount}</div>
              <div className="text-sm text-gray-500">Booking ID: {bookingId}</div>
            </div>
          </div>

          {/* Payment Method Selection */}
          {step === 'method-selection' && (
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-600 mb-6">
                Choose your preferred payment method to proceed
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setPaymentMethod('card');
                    setStep('payment-details');
                  }}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">Credit/Debit Card</div>
                      <div className="text-sm text-gray-500">Visa, Mastercard, RuPay & more</div>
                    </div>
                    <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setPaymentMethod('upi');
                    setStep('payment-details');
                  }}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                      <Smartphone className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">UPI Payment</div>
                      <div className="text-sm text-gray-500">Pay using UPI ID or QR code</div>
                    </div>
                    <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center mt-6">
                All payments are processed through secure, encrypted gateways
              </div>
            </div>
          )}

          {/* Payment Details */}
          {step === 'payment-details' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setStep('method-selection')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="text-sm text-gray-600">
                  Enter your {paymentMethod === 'card' ? 'card' : 'UPI'} details
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium">Credit/Debit Card Payment</div>
                      <div className="text-sm text-gray-500">Secure payment gateway</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardData.cardholderName}
                      onChange={(e) => setCardData(prev => ({ ...prev, cardholderName: e.target.value }))}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={(e) => {
                        const formatted = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setCardData(prev => ({ ...prev, cardNumber: formatted }));
                      }}
                      maxLength="19"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.expiryDate}
                        onChange={(e) => {
                          const formatted = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                          setCardData(prev => ({ ...prev, expiryDate: formatted }));
                        }}
                        maxLength="5"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardData.cvv}
                        onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                        maxLength="4"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    Powered by SecurePay Gateway (Simulated)
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-purple-50">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    <div className="flex-1">
                      <div className="font-medium">UPI Payment</div>
                      <div className="text-sm text-gray-500">Enter your UPI ID</div>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="username@bank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-purple-500"
                  />

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Select Payment App:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {banks.map(bank => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            selectedBank === bank.id 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-lg mb-1">{bank.logo}</div>
                          <div className="text-xs font-medium">{bank.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handlePaymentSubmit}
                disabled={
                  (paymentMethod === 'card' && (!cardData.cardholderName || !cardData.cardNumber || !cardData.expiryDate || !cardData.cvv)) ||
                  (paymentMethod === 'upi' && (!upiId || !selectedBank))
                }
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Pay ₹{amount}
              </button>

              <div className="text-xs text-gray-500 text-center">
                This is a simulated payment gateway for demo purposes
              </div>
            </div>
          )}

          {/* Processing State */}
          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <div className="text-lg font-medium text-gray-900 mb-2">
                Processing Payment...
              </div>
              <div className="text-sm text-gray-600">
                Please wait while we process your payment
              </div>
              <div className="text-xs text-gray-500 mt-4">
                Do not close this window or press back button
              </div>
            </div>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">
                Payment Successful!
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Your booking has been confirmed
              </div>
              <div className="text-sm text-gray-500">
                Redirecting in {countdown} seconds...
              </div>
            </div>
          )}

          {/* Failed State */}
          {step === 'failed' && (
            <div className="text-center py-8">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">
                Payment Failed
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Your payment could not be processed. Please try again.
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleRetry}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  Try Again
                </button>
                <button
                  onClick={() => onPaymentComplete({ success: false, error: 'Payment failed. Please try again.' })}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;