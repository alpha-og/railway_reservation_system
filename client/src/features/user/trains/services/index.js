// Service exports for trains feature
export { default as trainService } from "./trainService.js";
export { default as scheduleService } from "./schedule.service.js";
export { default as availabilityService } from "./availability.service.js";
export { default as bookingService } from "./booking.service.js";
export { default as stationService } from "./station.service.js";
export { default as coachTypeService } from "./coachType.service.js";

// Legacy exports (kept for backward compatibility)
export * from "./trainBookService.js";
export * from "./trainScheduleService.js";