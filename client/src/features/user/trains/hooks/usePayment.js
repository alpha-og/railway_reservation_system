import { useState } from "react";
import bookingService from "../services/booking.service";

export const usePayment = () => {
  const [paymentState, setPaymentState] = useState({
    isProcessing: false,
    isSuccess: false,
    isError: false,
    error: null,
    step: 'idle' // 'idle', 'creating', 'payment', 'processing', 'success', 'error'
  });

  const processPayment = async (paymentData, bookingId) => {
    setPaymentState({ 
      isProcessing: true, 
      isSuccess: false, 
      isError: false, 
      error: null,
      step: 'processing'
    });
    
    try {
      // Simulate payment processing delay (2-4 seconds)
      const processingTime = 2000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Simulate payment success/failure (90% success rate)
      const isPaymentSuccessful = Math.random() > 0.1;
      
      if (isPaymentSuccessful) {
        // Confirm booking on payment success
        const confirmedBooking = await bookingService.confirmBooking(bookingId);
        
        setPaymentState({ 
          isProcessing: false, 
          isSuccess: true, 
          isError: false, 
          error: null,
          step: 'success'
        });
        
        return { 
          success: true, 
          bookingId,
          booking: confirmedBooking.booking
        };
      } else {
        // Simulate different types of payment failures
        const errorMessages = [
          'Payment failed due to insufficient funds.',
          'Your card was declined. Please try a different payment method.',
          'Payment gateway timeout. Please try again.',
          'Invalid payment details. Please check and retry.',
          'Bank authorization failed. Please contact your bank.'
        ];
        
        const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        throw new Error(randomError);
      }
    } catch (error) {
      setPaymentState({ 
        isProcessing: false, 
        isSuccess: false, 
        isError: true, 
        error: error.message,
        step: 'error'
      });
      
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const resetPaymentState = () => {
    setPaymentState({
      isProcessing: false,
      isSuccess: false,
      isError: false,
      error: null,
      step: 'idle'
    });
  };

  const setStep = (step) => {
    setPaymentState(prev => ({ ...prev, step }));
  };

  return { 
    ...paymentState, 
    processPayment,
    resetPaymentState,
    setStep
  };
};

export default usePayment;