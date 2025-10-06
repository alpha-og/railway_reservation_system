import { useMemo } from "react";

export const useBookingFormatter = (booking) => {
  const formattedBooking = useMemo(() => {
    if (!booking) return null;

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
          weekday: "short",
          year: "numeric",
          month: "short", 
          day: "numeric",
        });
      } catch {
        return dateString;
      }
    };

    const formatTime = (timeString) => {
      if (!timeString) return "N/A";
      try {
        // Handle both HH:MM:SS and HH:MM formats
        const [hours, minutes] = timeString.split(":");
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0);
        return date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } catch {
        return timeString;
      }
    };

    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) return "₹0.00";
      return `₹${parseFloat(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };

    const getBadgeType = (status) => {
      const statusLower = (status || "").toLowerCase();
      switch (statusLower) {
        case "confirmed":
          return "success";
        case "pending":
          return "warning";
        case "cancelled":
          return "error";
        default:
          return "neutral";
      }
    };

    const calculateJourneyDuration = (departureTime, arrivalTime) => {
      if (!departureTime || !arrivalTime) return null;
      
      try {
        const [depHours, depMinutes] = departureTime.split(":").map(Number);
        const [arrHours, arrMinutes] = arrivalTime.split(":").map(Number);
        
        let totalMinutes = (arrHours * 60 + arrMinutes) - (depHours * 60 + depMinutes);
        
        // Handle overnight journeys
        if (totalMinutes < 0) {
          totalMinutes += 24 * 60;
        }
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        return `${hours}h ${minutes}m`;
      } catch {
        return null;
      }
    };

    return {
      ...booking,
      formattedDepartureDate: formatDate(booking.departureDate),
      formattedBookingDate: formatDate(booking.bookingDate),
      formattedDepartureTime: formatTime(booking.departureTime),
      formattedArrivalTime: formatTime(booking.arrivalTime),
      formattedTotalAmount: formatCurrency(booking.totalAmount),
      badgeType: getBadgeType(booking.status),
      journeyDuration: calculateJourneyDuration(booking.departureTime, booking.arrivalTime),
      distanceText: booking.distance ? `${booking.distance} km` : null,
    };
  }, [booking]);

  return formattedBooking;
};