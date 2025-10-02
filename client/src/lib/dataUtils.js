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
  
  return new Date(date).toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date, time) => {
  if (!date || !time) return formatTime(time) || 'N/A';
  
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
    
    const dateTime = new Date(dateStr + 'T' + time);
    
    if (isNaN(dateTime.getTime())) {
      return formatTime(time) || 'N/A'; // Fallback to time only if date is invalid
    }
    
    const formattedDate = dateTime.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return formattedDate + ', ' + formatTime(time);
  } catch (error) {
    console.error('Error formatting date-time:', error, { date, time });
    return formatTime(time) || 'N/A'; // Fallback to time only
  }
};

export const calculateStopDate = (departureDate, departureTime, stopTime) => {
  if (!departureDate || !departureTime || !stopTime) return null;
  
  try {
    // Create date objects for comparison
    const depDateTime = new Date(`${departureDate}T${departureTime}`);
    const stopDateTime = new Date(`${departureDate}T${stopTime}`);
    
    // If stop time is earlier than departure time, it's the next day
    if (stopDateTime < depDateTime) {
      const nextDay = new Date(depDateTime);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split('T')[0];
    }
    
    return departureDate;
  } catch (error) {
    console.error('Error calculating stop date:', error);
    return departureDate;
  }
};

export const calculateScheduleDates = (departureDate, departureTime, scheduleStops) => {
  if (!departureDate || !departureTime || !scheduleStops || scheduleStops.length === 0) {
    return [];
  }

  const stopDates = [];
  let currentDate = new Date(departureDate);
  let previousTime = departureTime;

  scheduleStops.forEach((stop, index) => {
    const arrivalTime = stop.arrival_time;
    const departureStopTime = stop.departure_time;
    
    // For the first stop, compare with train departure time
    if (index === 0) {
      if (arrivalTime && arrivalTime < previousTime) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // For subsequent stops, compare with previous stop's departure time
      if (arrivalTime && arrivalTime < previousTime) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    const arrivalDate = new Date(currentDate).toISOString().split('T')[0];
    
    // Check if departure time for this stop goes to next day
    let departureDate = arrivalDate;
    if (departureStopTime && arrivalTime && departureStopTime < arrivalTime) {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      departureDate = nextDay.toISOString().split('T')[0];
      currentDate = nextDay;
    }

    stopDates.push({
      arrivalDate,
      departureDate
    });

    // Update previous time for next iteration
    previousTime = departureStopTime || arrivalTime;
  });

  return stopDates;
};