import { queryDB } from "../utils/db.js";

// Search trains between two stations on a given date, optionally filtered by coach class
export async function searchTrains(from, to, coachClass, date) {
  let query = `
    SELECT DISTINCT t.id, t.name, t.code, s.departure_date
    FROM trains t
    JOIN schedules s ON s.train_id = t.id
    JOIN schedule_stops ss_from ON ss_from.schedule_id = s.id
    JOIN schedule_stops ss_to ON ss_to.schedule_id = s.id
    WHERE ss_from.station_id = $1
      AND ss_to.station_id = $2
      AND s.departure_date = $3
      AND ss_from.stop_number < ss_to.stop_number
  `;

  const params = [from, to, date];

if (coachClass) {
    query += `
      AND EXISTS (
        SELECT 1 FROM coaches c
        WHERE c.train_id = t.id
          AND c.coach_type_id = $4
      )
    `;
    params.push(coachClass);
  }

  const { rows } = await queryDB(query, params);
  return rows;
}

// Get the schedule/stops for a given train
export async function getSchedule(trainId) {
  const query = `
    SELECT 
      st.name AS station_name,
      ss.stop_number,
      ss.arrival_time,
      ss.departure_time
    FROM schedule_stops ss
    JOIN schedules sc ON ss.schedule_id = sc.id
    JOIN stations st ON ss.station_id = st.id
    WHERE sc.train_id = $1
    ORDER BY ss.stop_number;
  `;

  const { rows } = await queryDB(query, [trainId]);
  return rows;
}

// Get seat availability for a train on a specific date
export async function getAvailability(trainId, date) {
  const query = `
      SELECT 
      c.id AS coach_id,
      ct.name AS coach_type,
      COUNT(s.id) AS total_seats,
      COUNT(bs.id) FILTER (
        WHERE b.schedule_id IN (
          SELECT id FROM schedules 
          WHERE train_id = c.train_id 
            AND departure_date = $2
        )
      ) AS booked_seats,
      COUNT(s.id) - COUNT(bs.id) FILTER (
        WHERE b.schedule_id IN (
          SELECT id FROM schedules 
          WHERE train_id = c.train_id 
            AND departure_date = $2
        )
      ) AS available_seats
    FROM coaches c
    JOIN coach_types ct ON ct.id = c.coach_type_id
    JOIN seats s ON s.coach_id = c.id
    LEFT JOIN booked_seats bs ON bs.seat_id = s.id
    LEFT JOIN bookings b ON b.id = bs.booking_id
    WHERE c.train_id = $1
    GROUP BY c.id, ct.name
    ORDER BY ct.name;
  `;

  const { rows } = await queryDB(query, [trainId, date]);
  return rows;
}
