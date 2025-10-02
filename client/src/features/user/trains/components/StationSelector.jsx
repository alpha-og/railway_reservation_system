import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useStations } from '../hooks/useStations';
import { ArrowLeftRight, AlertTriangle } from 'lucide-react';
import { Card, Button, FormField, Select } from '../../../../components/ui';

export default function StationSelector({ currentFrom, currentTo, schedule, onStationChange }) {
  const navigate = useNavigate();
  const { isLoading } = useStations(); // Keep for loading state consistency
  const [from, setFrom] = useState(currentFrom || '');
  const [to, setTo] = useState(currentTo || '');

  // Sync with props when they change
  useEffect(() => {
    setFrom(currentFrom || '');
    setTo(currentTo || '');
  }, [currentFrom, currentTo]);

  // Get schedule stops in order
  const scheduleStops = schedule?.schedule_stops || [];
  
  // Create a map of station positions in the schedule for validation
  const stationPositions = scheduleStops.reduce((acc, stop, index) => {
    const stationId = stop.station?.id;
    if (stationId) {
      acc[stationId] = index;
    }
    return acc;
  }, {});

  // Filter stations to only those in the schedule and transform for Select component
  const scheduleStationOptions = scheduleStops.map((stop, index) => {
    const station = stop.station;
    if (!station) return null;
    
    const isFirst = index === 0;
    const isLast = index === scheduleStops.length - 1;
    let suffix = '';
    if (isFirst) suffix = ' (Origin)';
    else if (isLast) suffix = ' (Destination)';
    
    return {
      id: station.id,
      value: station.id,
      label: `${station.name} (${station.code})${suffix}`,
      name: station.name,
      position: index
    };
  }).filter(Boolean);

  const validateStationOrder = (fromStationId, toStationId) => {
    if (!fromStationId || !toStationId) return { isValid: true };
    
    const fromPosition = stationPositions[fromStationId];
    const toPosition = stationPositions[toStationId];
    
    if (fromPosition === undefined || toPosition === undefined) {
      return { isValid: false, error: 'Selected stations are not part of this train\'s route.' };
    }
    
    if (fromPosition >= toPosition) {
      return { isValid: false, error: 'Departure station must come before destination station in the train\'s route.' };
    }
    
    return { isValid: true };
  };

  const handleStationChange = () => {
    const validation = validateStationOrder(from, to);
    if (!validation.isValid) return; // Don't proceed if validation fails
    
    if (from && to && from !== to && (from !== currentFrom || to !== currentTo)) {
      if (onStationChange) {
        onStationChange({ from, to });
      } else {
        // Fallback: update current page URL params instead of redirecting
        navigate({
          search: (prev) => ({ ...prev, from, to }),
          replace: true
        });
      }
    }
  };

  const handleSwapStations = () => {
    if (!from || !to) return;
    
    // Check if swapping would create a valid order
    const validation = validateStationOrder(to, from);
    if (!validation.isValid) return; // Don't swap if it would create invalid order
    
    const tempFrom = from;
    setFrom(to);
    setTo(tempFrom);
    
    // Auto-update after state change
    setTimeout(() => {
      if (onStationChange) {
        onStationChange({ from: to, to: tempFrom });
      } else {
        // Fallback: update current page URL params instead of redirecting
        navigate({
          search: (prev) => ({ ...prev, from: to, to: tempFrom }),
          replace: true
        });
      }
    }, 100);
  };

  // Transform stations data for Select component
  const getStationName = (stationId) => {
    if (!scheduleStops || !stationId) return stationId;
    const stop = scheduleStops.find(stop => stop.station?.id === stationId);
    return stop?.station?.name || stationId;
  };

  const hasChanges = (from !== currentFrom || to !== currentTo) && from && to;
  const isValidSelection = from && to && from !== to;
  const isSameStation = from && to && from === to;
  
  // Validate station order
  const orderValidation = validateStationOrder(from, to);
  const hasOrderError = !orderValidation.isValid;
  
  // Check if swap would be valid
  const swapValidation = validateStationOrder(to, from);
  const canSwap = from && to && from !== to && swapValidation.isValid;

  if (isLoading) {
    return (
      <section>
        <Card>
          <Card.Title>Journey Route</Card.Title>
          <div className="skeleton h-20 w-full"></div>
        </Card>
      </section>
    );
  }

  // If no schedule data, show message
  if (!schedule || scheduleStops.length === 0) {
    return (
      <section>
        <Card>
          <Card.Title>Journey Route</Card.Title>
          <div className="alert alert-warning">
            <AlertTriangle className="h-4 w-4" />
            <span>Schedule information is not available for station selection.</span>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <Card>
        <Card.Title className="mb-4">Journey Route</Card.Title>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* From Station */}
          <div className="md:col-span-2">
            <FormField label="From Station">
              <Select
                options={scheduleStationOptions}
                placeholder="Select departure station"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                loading={isLoading}
                error={hasOrderError && from}
              />
            </FormField>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center">
            <Button
              variant="outline"
              className="btn-circle"
              onClick={handleSwapStations}
              disabled={!canSwap}
              title={canSwap ? "Swap stations" : "Cannot swap - would violate route order"}
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* To Station */}
          <div className="md:col-span-2">
            <FormField label="To Station">
              <Select
                options={scheduleStationOptions}
                placeholder="Select destination station"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                loading={isLoading}
                error={hasOrderError && to}
              />
            </FormField>
          </div>
        </div>

        {/* Validation Errors */}
        {isSameStation && (
          <div className="alert alert-warning mt-4">
            <AlertTriangle className="h-4 w-4" />
            <span>Departure and destination stations cannot be the same.</span>
          </div>
        )}

        {hasOrderError && !isSameStation && (
          <div className="alert alert-error mt-4">
            <AlertTriangle className="h-4 w-4" />
            <span>{orderValidation.error}</span>
          </div>
        )}

        {/* Update Route Button */}
        {hasChanges && isValidSelection && !hasOrderError && (
          <Card.Actions className="mt-4">
            <Button onClick={handleStationChange}>
              Update Route
            </Button>
          </Card.Actions>
        )}

        {/* Current Route Display */}
        {currentFrom && currentTo && (
          <div className="alert alert-info mt-4">
            <div className="text-sm">
              <strong>Current Route:</strong> {getStationName(currentFrom)} → {getStationName(currentTo)}
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}