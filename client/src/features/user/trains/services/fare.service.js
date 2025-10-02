import client from "../../../../services/config/axiosClient.js";

class FareService {
  // Calculate fare for a single journey
  static async calculateFare({ train_id, coach_type_id, from_station_id, to_station_id }) {
    const response = await client.post("/fares/calculate", {
      train_id,
      coach_type_id,
      from_station_id,
      to_station_id
    });
    return response.data.data.fareCalculation;
  }

  // Calculate fares for multiple coach types
  static async calculateMultipleFares({ train_id, coach_type_ids, from_station_id, to_station_id }) {
    const response = await client.post("/fares/calculate-multiple", {
      train_id,
      coach_type_ids,
      from_station_id,
      to_station_id
    });
    return response.data.data.fareCalculations;
  }

  // Get fare rates for a specific train
  static async getFareRatesByTrain(train_id) {
    const response = await client.get(`/fares/rates/${train_id}`);
    return response.data.data.fareRates;
  }

  // Helper to calculate total fare for multiple passengers
  static calculateTotalFare(fareCalculations, passengerCounts) {
    let total = 0;
    fareCalculations.forEach(fareCalc => {
      if (!fareCalc.error && fareCalc.coach_type_id) {
        const count = passengerCounts[fareCalc.coach_type_id] || 0;
        total += fareCalc.fare * count;
      }
    });
    return parseFloat(total.toFixed(2));
  }

  // Helper to group passengers by coach type for fare calculation
  static groupPassengersByCoachType(passengers) {
    const groups = {};
    passengers.forEach(passenger => {
      if (passenger.coachType) {
        groups[passenger.coachType] = (groups[passenger.coachType] || 0) + 1;
      }
    });
    return groups;
  }
}

export default FareService;