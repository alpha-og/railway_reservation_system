import { getDBClient, queryDB } from "../utils/db.js";
import { AppError } from "../utils/errors.js";

class ScheduleModel {
  static async find(filter, sort) {
    let query = `SELECT schedules.id, schedules.train_id, TO_CHAR(schedules.departure_date, 'YYYY-MM-DD') AS departure_date, schedules.departure_time, schedules.created_at, schedules.updated_at, array_agg(schedule_stops.id) AS schedule_stops FROM schedules JOIN schedule_stops ON schedules.id = schedule_stops.schedule_id`;
    const values = [];
    const conditions = [];

    if (filter) {
      if (filter.id) {
        conditions.push(`schedules.id = $${values.length + 1}`);
        values.push(filter.id);
      }
      if (filter.trainId) {
        conditions.push(`schedules.train_id = $${values.length + 1}`);
        values.push(filter.trainId);
      }
      if (filter.departureDate) {
        conditions.push(`schedules.departure_date = $${values.length + 1}`);
        values.push(filter.departureDate);
      }
      if (filter.departureTime) {
        conditions.push(`schedules.departure_time = $${values.length + 1}`);
        values.push(filter.departureTime);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }
    }

    if (sort) {
      const sortableFields = ["departure_date", "departure_time"];

      if (sort.sortBy && sortableFields.includes(sort.sortBy)) {
        const sortOrder = sort.sortOrder || "ASC";
        query += ` ORDER BY schedules.${sort.sortBy} ${sortOrder}`;
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

    query += ` GROUP BY schedules.id`;

    const result = await queryDB(query, values);
    return result.rows;
  }

  static async create(schedule) {
    const client = await getDBClient();
    try {
      await client.query("BEGIN");
      let query = `INSERT INTO schedules (train_id, departure_date, departure_time) VALUES ($1, $2, $3) RETURNING *`;
      let values = [
        schedule.trainId,
        schedule.departureDate,
        schedule.departureTime,
      ];
      let result = (await client.query(query, values)).rows[0];
      for (const scheduleStop of schedule.scheduleStops) {
        query = `INSERT INTO schedule_stops (schedule_id, station_id, stop_number, arrival_time, departure_time) VALUES ($1, $2, $3, $4, $5)`;
        values = [
          result.id,
          scheduleStop.stationId,
          scheduleStop.stopNumber,
          scheduleStop.arrivalTime,
          scheduleStop.departureTime,
        ];
        await client.query(query, values);
      }
      await client.query("COMMIT");
      return result;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async update(schedule) {
    const client = await getDBClient();
    try {
      await client.query("BEGIN");
      let query = `UPDATE schedules SET 
                      train_id = COALESCE($1, train_id), 
                      departure_date = COALESCE($2, departure_date), 
                      departure_time = COALESCE($3, departure_time), 
                      updated_at = NOW() 
                    WHERE id = $4 RETURNING *`;
      let values = [
        schedule.trainId,
        schedule.departureDate,
        schedule.departureTime,
        schedule.id,
      ];
      let result = (await client.query(query, values)).rows[0];
      if (!result) {
        throw new AppError(400, "Could not update schedule");
      }

      if (schedule.scheduleStops) {
        await client.query(
          "DELETE FROM schedule_stops WHERE schedule_id = $1",
          [schedule.id],
        );
        for (const scheduleStop of schedule.scheduleStops) {
          query = `INSERT INTO schedule_stops (schedule_id, station_id, stop_number, arrival_time, departure_time) VALUES ($1, $2, $3, $4, $5)`;
          values = [
            result.id,
            scheduleStop.stationId,
            scheduleStop.stopNumber,
            scheduleStop.arrivalTime,
            scheduleStop.departureTime,
          ];
          await client.query(query, values);
        }
      }
      await client.query("COMMIT");
      return result;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    let query = `DELETE FROM schedules WHERE id = $1 RETURNING *`;
    const values = [id];
    return (await queryDB(query, values)).rows[0];
  }
}

export default ScheduleModel;
