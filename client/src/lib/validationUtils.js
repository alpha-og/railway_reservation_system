// Payment validation utilities (keeping only payment-related validation)
export const validatePaymentForm = (paymentData) => {
  const errors = {};
  
  if (!paymentData.method) {
    errors.method = 'Please select a payment method';
  }
  
  if (paymentData.method === 'card') {
    if (!paymentData.cardNumber?.replace(/\s/g, '')) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!paymentData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiryDate)) {
      errors.expiryDate = 'Expiry date must be in MM/YY format';
    }
    
    if (!paymentData.cvv) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    if (!paymentData.cardholderName?.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }
  }
  
  return errors;
};