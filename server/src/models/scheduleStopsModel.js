import { queryDB } from "../utils/db.js";

class ScheduleStopsModel {
  static async find(filter, sort) {
    let query = `SELECT * FROM schedule_stops`;
    const values = [];
    const conditions = [];

    if (filter) {
      if (filter.id) {
        conditions.push(`id = $${values.length + 1}`);
        values.push(filter.id);
      }
      if (filter.scheduleId) {
        conditions.push(`schedule_id = $${values.length + 1}`);
        values.push(filter.scheduleId);
      }
      if (filter.stationId) {
        conditions.push(`station_id = $${values.length + 1}`);
        values.push(filter.stationId);
      }
      if (filter.stopNumber) {
        conditions.push(`stop_number = $${values.length + 1}`);
        values.push(filter.stopNumber);
      }
      if (filter.arrivalTime) {
        conditions.push(`arrival_time = $${values.length + 1}`);
        values.push(filter.arrivalTime);
      }
      if (filter.departureTime) {
        conditions.push(`departure_time = $${values.length + 1}`);
        values.push(filter.departureTime);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }
    }

    if (sort) {
      const sortableFields = ["stop_number", "arrival_time", "departure_time"];

      if (sort.sortBy && sortableFields.includes(sort.sortBy)) {
        const sortOrder = sort.sortOrder || "ASC";
        query += ` ORDER BY ${sort.sortBy} ${sortOrder}`;
      }
    }

    if (filter) {
      if (filter.limit) {
        query += ` LIMIT $${values.length + 1} `;
        values.push(filter.limit);
      }
      if (filter.page) {
        query += ` OFFSET $${values.length + 1} `;
        values.push((filter.page - 1) * filter.limit);
      }
    }

    const result = await queryDB(query, values);
    return result.rows;
  }

  static async create(scheduleStop) {
    const query = `INSERT INTO schedule_stops (schedule_id, station_id, stop_number, arrival_time, departure_time) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [
      scheduleStop.scheduleId,
      scheduleStop.stationId,
      scheduleStop.stopNumber,
      scheduleStop.arrivalTime,
      scheduleStop.departureTime,
    ];
    const result = await queryDB(query, values);
    return result.rows[0];
  }

  static async update(scheduleStop) {
    const query = `UPDATE schedule_stops SET schedule_id = $1, station_id = $2, stop_number = $3, arrival_time = $4, departure_time = $5 WHERE id = $6 RETURNING *`;
    const values = [
      scheduleStop.scheduleId,
      scheduleStop.stationId,
      scheduleStop.stopNumber,
      scheduleStop.arrivalTime,
      scheduleStop.departureTime,
      scheduleStop.id,
    ];
    const result = await queryDB(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `DELETE FROM schedule_stops WHERE id = $1 RETURNING *`;
    const values = [id];
    const result = await queryDB(query, values);
    return result.rows[0];
  }
}

export default ScheduleStopsModel;
