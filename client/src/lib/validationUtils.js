export const validatePassenger = (passenger) => {
  const errors = {};
  
  if (!passenger.name?.trim()) {
    errors.name = 'Name is required';
  } else if (passenger.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (!/^[a-zA-Z\s]+$/.test(passenger.name.trim())) {
    errors.name = 'Name can only contain letters and spaces';
  }
  
  if (!passenger.age) {
    errors.age = 'Age is required';
  } else {
    const age = parseInt(passenger.age);
    if (isNaN(age) || age < 1 || age > 120) {
      errors.age = 'Age must be between 1 and 120';
    }
  }
  
  if (!passenger.gender) {
    errors.gender = 'Gender is required';
  }
  
  if (!passenger.coachType) {
    errors.coachType = 'Coach type is required';
  }
  
  return errors;
};

export const validatePassengerList = (passengers) => {
  if (!passengers || passengers.length === 0) {
    return { general: 'At least one passenger is required' };
  }
  
  const passengerErrors = {};
  let hasErrors = false;
  
  passengers.forEach((passenger, index) => {
    const errors = validatePassenger(passenger);
    if (Object.keys(errors).length > 0) {
      passengerErrors[index] = errors;
      hasErrors = true;
    }
  });
  
  return hasErrors ? passengerErrors : null;
};

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