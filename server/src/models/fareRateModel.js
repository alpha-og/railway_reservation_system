import { queryDB } from "../utils/db.js";

class FareRate {
  static TABLE = "fare_rates";

  static async create(train_id, coach_type_id, rate_per_km) {
    const query = `INSERT INTO ${this.TABLE} (train_id, coach_type_id, rate_per_km) VALUES ($1, $2, $3) RETURNING *`;
    const values = [train_id, coach_type_id, rate_per_km];
    const result = await queryDB(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `SELECT * FROM ${this.TABLE}`;
    const result = await queryDB(query);
    return result.rows;
  }

  static async findByTrainAndCoachType(train_id, coach_type_id) {
    const query = `SELECT * FROM ${this.TABLE} WHERE train_id = $1 AND coach_type_id = $2`;
    const values = [train_id, coach_type_id];
    const result = await queryDB(query, values);
    return result.rows[0];
  }

  static async findByTrain(train_id) {
    const query = `
      SELECT fr.*, ct.name as coach_type_name 
      FROM ${this.TABLE} fr
      JOIN coach_types ct ON fr.coach_type_id = ct.id
      WHERE fr.train_id = $1
    `;
    const values = [train_id];
    const result = await queryDB(query, values);
    return result.rows;
  }

  static async update(id, rate_per_km) {
    const query = `UPDATE ${this.TABLE} SET rate_per_km = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
    const values = [rate_per_km, id];
    const result = await queryDB(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.TABLE} WHERE id = $1`;
    const values = [id];
    const result = await queryDB(query, values);
    return result;
  }

  // Main fare calculation method
  static async calculateFare(train_id, coach_type_id, from_station_id, to_station_id) {
    // Get fare rate for this train and coach type
    const fareRateQuery = `
      SELECT rate_per_km FROM ${this.TABLE} 
      WHERE train_id = $1 AND coach_type_id = $2
    `;
    const fareRateResult = await queryDB(fareRateQuery, [train_id, coach_type_id]);
    
    if (fareRateResult.rows.length === 0) {
      throw new Error(`No fare rate found for train ${train_id} and coach type ${coach_type_id}`);
    }

    const ratePerKm = parseFloat(fareRateResult.rows[0].rate_per_km);

    // Calculate cumulative distance along the train route
    const totalDistance = await this.calculateRouteDistance(train_id, from_station_id, to_station_id);

    // Calculate fare
    const fare = ratePerKm * totalDistance;

    return {
      fare: parseFloat(fare.toFixed(2)),
      rate_per_km: ratePerKm,
      distance: totalDistance,
      train_id,
      coach_type_id,
      from_station_id,
      to_station_id
    };
  }

  // Calculate cumulative distance along the actual train route
  static async calculateRouteDistance(train_id, from_station_id, to_station_id) {
    // First, get the stop numbers for the from and to stations on this train's route
    const stopsQuery = `
      SELECT s.id as schedule_id, 
             ss_from.stop_number as from_stop_number,
             ss_to.stop_number as to_stop_number
      FROM schedules s
      JOIN schedule_stops ss_from ON ss_from.schedule_id = s.id
      JOIN schedule_stops ss_to ON ss_to.schedule_id = s.id
      WHERE s.train_id = $1 
        AND ss_from.station_id = $2
        AND ss_to.station_id = $3
        AND ss_from.stop_number < ss_to.stop_number
      LIMIT 1
    `;
    
    const stopsResult = await queryDB(stopsQuery, [train_id, from_station_id, to_station_id]);
    
    if (stopsResult.rows.length === 0) {
      // Fallback: try direct distance if no route found
      const directDistanceQuery = `
        SELECT distance FROM station_distances
        WHERE (from_station_id = $1 AND to_station_id = $2)
        OR (from_station_id = $2 AND to_station_id = $1)
      `;
      const directResult = await queryDB(directDistanceQuery, [from_station_id, to_station_id]);
      
      if (directResult.rows.length === 0) {
        throw new Error(`No route or direct distance found between stations ${from_station_id} and ${to_station_id} for train ${train_id}`);
      }
      
      return parseFloat(directResult.rows[0].distance);
    }

    const { schedule_id, from_stop_number, to_stop_number } = stopsResult.rows[0];

    // Get all consecutive station pairs along the route
    const routeStationsQuery = `
      SELECT ss.station_id, ss.stop_number
      FROM schedule_stops ss
      WHERE ss.schedule_id = $1 
        AND ss.stop_number >= $2 
        AND ss.stop_number <= $3
      ORDER BY ss.stop_number
    `;
    
    const routeStationsResult = await queryDB(routeStationsQuery, [schedule_id, from_stop_number, to_stop_number]);
    
    if (routeStationsResult.rows.length < 2) {
      throw new Error(`Invalid route: insufficient stations found between ${from_station_id} and ${to_station_id}`);
    }

    // Calculate cumulative distance between consecutive stations
    let totalDistance = 0;
    const stations = routeStationsResult.rows;
    
    for (let i = 0; i < stations.length - 1; i++) {
      const currentStationId = stations[i].station_id;
      const nextStationId = stations[i + 1].station_id;
      
      const segmentDistanceQuery = `
        SELECT distance FROM station_distances
        WHERE (from_station_id = $1 AND to_station_id = $2)
        OR (from_station_id = $2 AND to_station_id = $1)
      `;
      
      const segmentResult = await queryDB(segmentDistanceQuery, [currentStationId, nextStationId]);
      
      if (segmentResult.rows.length === 0) {
        throw new Error(`No distance found between consecutive stations ${currentStationId} and ${nextStationId}`);
      }
      
      totalDistance += parseFloat(segmentResult.rows[0].distance);
    }

    return totalDistance;
  }
}

export default FareRate;