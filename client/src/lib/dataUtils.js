export const safeGet = (obj, path, fallback = 'N/A') => {
  if (!obj || typeof obj !== 'object') return fallback;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return fallback;
    }
    result = result[key];
  }
  
  return result || fallback;
};

export const formatTime = (time) => {
  if (!time) return 'N/A';
  
  if (time.includes('T')) {
    return new Date(time).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  // Handle HH:MM:SS format - remove seconds
  if (time.includes(':')) {
    const parts = time.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
  }
  
  return time;
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  // Handle date-only strings to avoid timezone issues
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    // For YYYY-MM-DD format, create date in local timezone to avoid UTC conversion
    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    return localDate.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  return new Date(date).toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date, time) => {
  if (!date || !time) {
    return formatTime(time) || 'N/A';
  }
  
  try {
    // Handle different date formats - ensure we have YYYY-MM-DD format
    let dateStr = date;
    if (date instanceof Date) {
      dateStr = date.toISOString().split('T')[0];
    } else if (typeof date === 'string') {
      // If date is already in correct format, use it; otherwise try to parse
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          dateStr = parsedDate.toISOString().split('T')[0];
        } else {
          // If we can't parse the date, just return the time
          return formatTime(time) || 'N/A';
        }
      }
    }
    
    // For date display, avoid timezone issues by creating local date
    let formattedDate;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      formattedDate = localDate.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } else {
      const dateTime = new Date(dateStr + 'T' + time);
      
      if (isNaN(dateTime.getTime())) {
        return formatTime(time) || 'N/A'; // Fallback to time only if date is invalid
      }
      
      formattedDate = dateTime.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    return formattedDate + ', ' + formatTime(time);
  } catch (error) {
    console.error('Error formatting date-time:', error, { date, time });
    return formatTime(time) || 'N/A'; // Fallback to time only
  }
};

export const calculateStopDate = (departureDate, departureTime, stopTime) => {
  if (!departureDate || !departureTime || !stopTime) return null;
  
  try {
    // Handle date-only strings to avoid timezone issues
    let baseDateObj;
    if (typeof departureDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
      const [year, month, day] = departureDate.split('-').map(Number);
      baseDateObj = new Date(year, month - 1, day);
    } else {
      baseDateObj = new Date(departureDate);
    }
    
    // Create date objects for comparison
    const depDateTime = new Date(baseDateObj);
    depDateTime.setHours(...departureTime.split(':').map(Number), 0, 0);
    
    const stopDateTime = new Date(baseDateObj);
    stopDateTime.setHours(...stopTime.split(':').map(Number), 0, 0);
    
    // If stop time is earlier than departure time, it's the next day
    if (stopDateTime < depDateTime) {
      const nextDay = new Date(baseDateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      const year = nextDay.getFullYear();
      const month = String(nextDay.getMonth() + 1).padStart(2, '0');
      const day = String(nextDay.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return departureDate;
  } catch (error) {
    console.error('Error calculating stop date:', error);
    return departureDate;
  }
};

export const calculateScheduleDates = (departureDate, sourceDepartureTime, scheduleStops) => {
  if (!departureDate || !scheduleStops || scheduleStops.length === 0) {
    return [];
  }

  const stopDates = [];
  
  // Sort stops by stop_number to ensure correct order
  const sortedStops = [...scheduleStops].sort((a, b) => (a.stop_number || 0) - (b.stop_number || 0));
  
  // Handle date-only strings to avoid timezone issues
  let currentDate;
  if (typeof departureDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
    const [year, month, day] = departureDate.split('-').map(Number);
    currentDate = new Date(year, month - 1, day);
  } else {
    currentDate = new Date(departureDate);
  }
  
  let previousTime = null;

  sortedStops.forEach((stop, index) => {
    const arrivalTime = stop.arrival_time;
    const stopDepartureTime = stop.departure_time;
    
    let arrivalDate = new Date(currentDate);
    let stopDepartureDate = new Date(currentDate);

    // For the first stop, departure happens on the scheduled departure_date
    if (index === 0) {
      // First stop: arrival_time might be null, departure_time is the journey start
      previousTime = stopDepartureTime;
      const arrivalDateStr = formatDateToYYYYMMDD(arrivalDate);
      const departureDateStr = formatDateToYYYYMMDD(stopDepartureDate);
      stopDates.push({
        arrivalDate: arrivalDateStr,
        departureDate: departureDateStr
      });
      return;
    }

    // For subsequent stops, check if we crossed midnight
    if (arrivalTime && previousTime) {
      const previousMinutes = timeToMinutes(previousTime);
      const arrivalMinutes = timeToMinutes(arrivalTime);
      
      // If arrival time is earlier than previous departure time, it's the next day
      if (arrivalMinutes < previousMinutes) {
        currentDate.setDate(currentDate.getDate() + 1);
        arrivalDate = new Date(currentDate);
      }
    }

    // Set departure date for this stop
    stopDepartureDate = new Date(arrivalDate);
    
    // Check if departure time is earlier than arrival time (next day departure)
    if (stopDepartureTime && arrivalTime) {
      const arrivalMinutes = timeToMinutes(arrivalTime);
      const depMinutes = timeToMinutes(stopDepartureTime);
      
      if (depMinutes < arrivalMinutes) {
        stopDepartureDate.setDate(stopDepartureDate.getDate() + 1);
        currentDate = new Date(stopDepartureDate);
      }
    }

    const arrivalDateStr = formatDateToYYYYMMDD(arrivalDate);
    const departureDateStr = formatDateToYYYYMMDD(stopDepartureDate);
    
    stopDates.push({
      arrivalDate: arrivalDateStr,
      departureDate: departureDateStr
    });

    // Update previous time for next iteration
    previousTime = stopDepartureTime || arrivalTime;
  });

  return stopDates;
};

// Helper function to format Date object to YYYY-MM-DD without timezone issues
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to convert time string (HH:MM) to minutes
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};