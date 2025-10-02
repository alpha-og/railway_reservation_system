// Legacy service - kept for backward compatibility
// New booking functionality moved to booking.service.js
import bookingService from "./booking.service.js";
import trainService from "./trainService.js";

// Legacy export for backward compatibility
export const bookTrain = async ({ trainId, coachType, passengerName }) => {
  return bookingService.createBooking({
    trainId,
    coachType,
    passengers: [{ name: passengerName }]
  });
};

// Legacy export for backward compatibility
export const getTrainById = trainService.getTrainById;
