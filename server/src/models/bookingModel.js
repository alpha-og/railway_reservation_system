import { queryDB, getDBClient } from "../utils/db.js";

class Booking {
  static TABLE = "bookings";

  static async create(
    userId,
    scheduleId,
    fromStationId,
    toStationId,
    statusId,
    totalAmount,
  ) {
    const query = `
      INSERT INTO ${this.TABLE} 
        (user_id, schedule_id, from_station_id, to_station_id, status_id, total_amount, pnr, booking_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    const pnr = Booking.generatePNR();
    const values = [
      userId,
      scheduleId,
      fromStationId,
      toStationId,
      statusId,
      totalAmount,
      pnr,
    ];
    const result = await queryDB(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `SELECT * FROM ${this.TABLE} WHERE id = $1`;
    const result = await queryDB(query, [id]);
    return result.rows[0];
  }

  static async findByIdWithDetails(id) {
    const query = `
      SELECT 
        b.*,
        bs.name as booking_status,
        t.name as train_name,
        t.code as train_code,
        fs.name as source_station,
        fs.code as source_station_code,
        ts.name as destination_station,
        ts.code as destination_station_code,
        TO_CHAR(s.departure_date, 'YYYY-MM-DD') AS departure_date,
        s.departure_time,
        ss_from.departure_time as from_departure_time,
        ss_to.arrival_time as to_arrival_time,
        sd.distance as journey_distance
      FROM ${this.TABLE} b
      LEFT JOIN booking_statuses bs ON b.status_id = bs.id
      LEFT JOIN schedules s ON b.schedule_id = s.id
      LEFT JOIN trains t ON s.train_id = t.id
      LEFT JOIN stations fs ON b.from_station_id = fs.id
      LEFT JOIN stations ts ON b.to_station_id = ts.id
      LEFT JOIN schedule_stops ss_from ON s.id = ss_from.schedule_id AND ss_from.station_id = b.from_station_id
      LEFT JOIN schedule_stops ss_to ON s.id = ss_to.schedule_id AND ss_to.station_id = b.to_station_id
      LEFT JOIN station_distances sd ON sd.from_station_id = b.from_station_id AND sd.to_station_id = b.to_station_id
      WHERE b.id = $1
    `;
    const result = await queryDB(query, [id]);
    return result.rows[0];
  }

  static async findByPnr(pnr, userId = null) {
    const query = `
      SELECT 
        b.*,
        bs.name as booking_status,
        t.name as train_name,
        t.code as train_code,
        fs.name as source_station,
        fs.code as source_station_code,
        ts.name as destination_station,
        ts.code as destination_station_code,
        TO_CHAR(s.departure_date, 'YYYY-MM-DD') AS departure_date,
        s.departure_time,
        ss_from.departure_time as from_departure_time,
        ss_to.arrival_time as to_arrival_time,
        sd.distance as journey_distance
      FROM ${this.TABLE} b
      LEFT JOIN booking_statuses bs ON b.status_id = bs.id
      LEFT JOIN schedules s ON b.schedule_id = s.id
      LEFT JOIN trains t ON s.train_id = t.id
      LEFT JOIN stations fs ON b.from_station_id = fs.id
      LEFT JOIN stations ts ON b.to_station_id = ts.id
      LEFT JOIN schedule_stops ss_from ON s.id = ss_from.schedule_id AND ss_from.station_id = b.from_station_id
      LEFT JOIN schedule_stops ss_to ON s.id = ss_to.schedule_id AND ss_to.station_id = b.to_station_id
      LEFT JOIN station_distances sd ON sd.from_station_id = b.from_station_id AND sd.to_station_id = b.to_station_id
      WHERE b.pnr = $1 ${userId ? 'AND b.user_id = $2' : ''}
    `;
    const params = userId ? [pnr, userId] : [pnr];
    const result = await queryDB(query, params);
    return result.rows[0];
  }

  static async findAllByUser(userId) {
    const query = `
      SELECT 
        b.*,
        bs.name as booking_status,
        t.name as train_name,
        t.code as train_code,
        fs.name as source_station,
        ts.name as destination_station,
        TO_CHAR(s.departure_date, 'YYYY-MM-DD') AS departure_date,
        s.departure_time,
        ss_from.departure_time as from_departure_time,
        ss_to.arrival_time as to_arrival_time
      FROM ${this.TABLE} b
      LEFT JOIN booking_statuses bs ON b.status_id = bs.id
      LEFT JOIN schedules s ON b.schedule_id = s.id
      LEFT JOIN trains t ON s.train_id = t.id
      LEFT JOIN stations fs ON b.from_station_id = fs.id
      LEFT JOIN stations ts ON b.to_station_id = ts.id
      LEFT JOIN schedule_stops ss_from ON s.id = ss_from.schedule_id AND ss_from.station_id = b.from_station_id
      LEFT JOIN schedule_stops ss_to ON s.id = ss_to.schedule_id AND ss_to.station_id = b.to_station_id
      WHERE b.user_id = $1 
      ORDER BY b.booking_date DESC
    `;
    const result = await queryDB(query, [userId]);
    return result.rows;
  }

  static async updateStatus(id, statusId) {
    const query = `UPDATE ${this.TABLE} SET status_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
    const result = await queryDB(query, [statusId, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.TABLE} WHERE id = $1`;
    const result = await queryDB(query, [id]);
    return result;
  }

  static async getStatusId(statusName) {
    const query = `SELECT id FROM booking_statuses WHERE name = $1 LIMIT 1`;
    const result = await queryDB(query, [statusName]);
    if (result.rows.length === 0) {
      throw new Error(`Booking status '${statusName}' not found`);
    }
    return result.rows[0].id;
  }

  static async createWithPassengers(
    userId,
    scheduleId,
    fromStationId,
    toStationId,
    statusId,
    totalAmount,
    passengers,
  ) {
    const client = await getDBClient();

    try {
      // Begin transaction
      await client.query("BEGIN");

      // Validate all foreign key dependencies before creating booking
      await Booking.validateDependencies(client, {
        userId,
        scheduleId,
        fromStationId,
        toStationId,
        statusId,
        passengers,
      });

      // First, create the booking
      const bookingQuery = `
        INSERT INTO ${this.TABLE} 
          (user_id, schedule_id, from_station_id, to_station_id, status_id, total_amount, pnr, booking_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *
      `;
      const pnr = Booking.generatePNR();
      const bookingValues = [
        userId,
        scheduleId,
        fromStationId,
        toStationId,
        statusId,
        totalAmount,
        pnr,
      ];
      const bookingResult = await client.query(bookingQuery, bookingValues);
      const booking = bookingResult.rows[0];

      // Then, handle passenger upsert and create booked passengers entries
      const bookedPassengers = [];
      for (const passenger of passengers) {
        let passengerId = passenger.id;

        // If passenger has an email, check if a passenger with same email already exists for this user
        if (passenger.email) {
          const existingPassengerQuery = `
            SELECT id FROM passengers 
            WHERE user_id = $1 AND email = $2 
            LIMIT 1
          `;
          const existingResult = await client.query(existingPassengerQuery, [
            userId,
            passenger.email,
          ]);

          if (existingResult.rows.length > 0) {
            // Update existing passenger
            passengerId = existingResult.rows[0].id;
            const updatePassengerQuery = `
              UPDATE passengers 
              SET name = $1, age = $2, gender = $3
              WHERE id = $4 AND user_id = $5
              RETURNING *
            `;
            // TODO: Add updated_at column to passengers table and include: updated_at = NOW()
            await client.query(updatePassengerQuery, [
              passenger.name,
              passenger.age,
              passenger.gender,
              passengerId,
              userId,
            ]);
          } else {
            // Insert new passenger
            const insertPassengerQuery = `
              INSERT INTO passengers (user_id, name, email, age, gender)
              VALUES ($1, $2, $3, $4, $5)
              RETURNING *
            `;
            const newPassengerResult = await client.query(
              insertPassengerQuery,
              [
                userId,
                passenger.name,
                passenger.email,
                passenger.age,
                passenger.gender,
              ],
            );
            passengerId = newPassengerResult.rows[0].id;
          }
        } else {
          // If no email provided, create or find passenger by name/age/gender combination
          const existingPassengerQuery = `
            SELECT id FROM passengers 
            WHERE user_id = $1 AND name = $2 AND age = $3 AND gender = $4
            LIMIT 1
          `;
          const existingResult = await client.query(existingPassengerQuery, [
            userId,
            passenger.name,
            passenger.age,
            passenger.gender,
          ]);

          if (existingResult.rows.length > 0) {
            passengerId = existingResult.rows[0].id;
          } else {
            // Insert new passenger without email
            const insertPassengerQuery = `
              INSERT INTO passengers (user_id, name, age, gender)
              VALUES ($1, $2, $3, $4)
              RETURNING *
            `;
            try {
              const newPassengerResult = await client.query(
                insertPassengerQuery,
                [userId, passenger.name, passenger.age, passenger.gender],
              );
              passengerId = newPassengerResult.rows[0].id;
            } catch (passengerError) {
              throw new Error(
                `Failed to create passenger ${passenger.name}: ${passengerError.message}`,
              );
            }
          }
        }

        // Validate that passenger belongs to the user (security check)
        if (passengerId) {
          const ownershipQuery = `SELECT id FROM passengers WHERE id = $1 AND user_id = $2`;
          const ownershipResult = await client.query(ownershipQuery, [
            passengerId,
            userId,
          ]);
          if (ownershipResult.rows.length === 0) {
            throw new Error(
              `Passenger ${passenger.name} does not belong to user ${userId}`,
            );
          }
        }

        // Create booked passenger entry
        const passengerQuery = `
          INSERT INTO booked_passengers (booking_id, passenger_id, name, gender, age, coach_type_id)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;
        const passengerValues = [
          booking.id,
          passengerId,
          passenger.name,
          passenger.gender,
          passenger.age,
          passenger.coachType,
        ];
        try {
          const passengerResult = await client.query(
            passengerQuery,
            passengerValues,
          );
          bookedPassengers.push(passengerResult.rows[0]);
        } catch (bookedPassengerError) {
          throw new Error(
            `Failed to create booked passenger entry for ${passenger.name}: ${bookedPassengerError.message}`,
          );
        }
      }

      // Try to allocate seats for passengers
      await Booking.allocateSeats(
        client,
        booking.id,
        bookedPassengers,
        scheduleId,
      );

      // Commit transaction
      await client.query("COMMIT");

      // Return booking with passenger details
      return {
        ...booking,
        passengers: bookedPassengers,
      };
    } catch (error) {
      // Rollback transaction on error
      await client.query("ROLLBACK");
      throw new Error(
        `Failed to create booking with passengers: ${error.message}`,
      );
    } finally {
      // Release the client back to the pool
      client.release();
    }
  }

  static async allocateSeats(client, bookingId, bookedPassengers, scheduleId) {
    try {
      // Get the train for this schedule
      const trainQuery = `SELECT train_id FROM schedules WHERE id = $1`;
      const trainResult = await client.query(trainQuery, [scheduleId]);

      if (trainResult.rows.length === 0) {
        throw new Error("Schedule not found");
      }

      const trainId = trainResult.rows[0].train_id;

      // Validate that train exists
      const trainExistsQuery = `SELECT id FROM trains WHERE id = $1`;
      const trainExistsResult = await client.query(trainExistsQuery, [trainId]);
      if (trainExistsResult.rows.length === 0) {
        throw new Error(`Train with ID ${trainId} does not exist`);
      }

      for (const bookedPassenger of bookedPassengers) {
        // Validate that coach type exists and train has coaches of this type
        const coachValidationQuery = `
          SELECT c.id, c.code, ct.name as coach_type_name
          FROM coaches c
          JOIN coach_types ct ON c.coach_type_id = ct.id
          WHERE c.train_id = $1 AND c.coach_type_id = $2
          LIMIT 1
        `;
        const coachValidationResult = await client.query(coachValidationQuery, [
          trainId,
          bookedPassenger.coach_type_id,
        ]);

        if (coachValidationResult.rows.length === 0) {
          console.warn(
            `Warning: No coaches of type ${bookedPassenger.coach_type_id} found for train ${trainId}. Passenger will be on waiting list.`,
          );
          continue;
        }

        // Find available seats for this coach type
        const availableSeatsQuery = `
          SELECT s.id, s.seat_number, c.code as coach_code
          FROM seats s
          JOIN coaches c ON s.coach_id = c.id
          WHERE c.train_id = $1 
            AND c.coach_type_id = $2
            AND s.id NOT IN (
              SELECT bs.seat_id 
              FROM booked_seats bs
              JOIN bookings b ON bs.booking_id = b.id
              WHERE b.schedule_id = $3
                AND b.status_id NOT IN (
                  SELECT id FROM booking_statuses WHERE name IN ('Cancelled')
                )
            )
          ORDER BY c.code, s.seat_number
          LIMIT 1
        `;

        const seatResult = await client.query(availableSeatsQuery, [
          trainId,
          bookedPassenger.coach_type_id,
          scheduleId,
        ]);

        if (seatResult.rows.length > 0) {
          // Validate that the seat exists and belongs to the correct coach
          const seat = seatResult.rows[0];
          const seatValidationQuery = `
            SELECT s.id 
            FROM seats s 
            JOIN coaches c ON s.coach_id = c.id 
            WHERE s.id = $1 AND c.train_id = $2 AND c.coach_type_id = $3
          `;
          const seatValidationResult = await client.query(seatValidationQuery, [
            seat.id,
            trainId,
            bookedPassenger.coach_type_id,
          ]);

          if (seatValidationResult.rows.length === 0) {
            console.warn(
              `Warning: Seat ${seat.id} validation failed. Passenger will be on waiting list.`,
            );
            continue;
          }

          // Allocate the seat
          const allocateSeatQuery = `
            INSERT INTO booked_seats (booking_id, booked_passenger_id, seat_id)
            VALUES ($1, $2, $3)
          `;
          try {
            await client.query(allocateSeatQuery, [
              bookingId,
              bookedPassenger.id,
              seat.id,
            ]);
          } catch (seatAllocationError) {
            console.warn(
              `Warning: Failed to allocate seat ${seat.seat_number} for passenger ${bookedPassenger.name}: ${seatAllocationError.message}`,
            );
            // Continue without throwing error - passenger will be on waiting list
          }
        } else {
          console.warn(
            `Warning: No available seats found for coach type ${bookedPassenger.coach_type_id}. Passenger will be on waiting list.`,
          );
        }
        // If no seats available, passenger will be on waiting list (no seat allocated)
      }
    } catch (error) {
      // Don't throw error for seat allocation failures - log and continue
      console.error(`Seat allocation warning: ${error.message}`);
      // Passengers will be on waiting list if seat allocation fails
    }
  }

  static async validateBasicDependencies(
    userId,
    scheduleId,
    fromStationId,
    toStationId,
    statusId,
  ) {
    // Validate user exists
    const userQuery = `SELECT id FROM users WHERE id = $1`;
    const userResult = await queryDB(userQuery, [userId]);
    if (userResult.rows.length === 0) {
      throw new Error(`User with ID ${userId} does not exist`);
    }

    // Validate schedule exists and is active
    const scheduleQuery = `
      SELECT s.*, t.name as train_name 
      FROM schedules s 
      JOIN trains t ON s.train_id = t.id 
      WHERE s.id = $1 AND s.departure_date >= CURRENT_DATE
    `;
    const scheduleResult = await queryDB(scheduleQuery, [scheduleId]);
    if (scheduleResult.rows.length === 0) {
      throw new Error("Schedule not found or no longer available");
    }

    // Validate from and to stations exist
    const stationQuery = `SELECT id FROM stations WHERE id = ANY($1::uuid[])`;
    const stationResult = await queryDB(stationQuery, [
      [fromStationId, toStationId],
    ]);
    const existingStations = stationResult.rows.map((row) => row.id);

    if (!existingStations.includes(fromStationId)) {
      throw new Error(`From station with ID ${fromStationId} does not exist`);
    }
    if (!existingStations.includes(toStationId)) {
      throw new Error(`To station with ID ${toStationId} does not exist`);
    }

    // Validate booking status exists
    const statusQuery = `SELECT id FROM booking_statuses WHERE id = $1`;
    const statusResult = await queryDB(statusQuery, [statusId]);
    if (statusResult.rows.length === 0) {
      throw new Error(`Booking status with ID ${statusId} does not exist`);
    }

    // Validate schedule stops exist for the route
    const routeQuery = `
      SELECT COUNT(*) as stop_count
      FROM schedule_stops ss
      WHERE ss.schedule_id = $1 
        AND ss.station_id IN ($2, $3)
    `;
    const routeResult = await queryDB(routeQuery, [
      scheduleId,
      fromStationId,
      toStationId,
    ]);
    if (parseInt(routeResult.rows[0].stop_count) < 2) {
      throw new Error(
        `Route not available: Schedule ${scheduleId} does not stop at both stations`,
      );
    }
  }

  static async validateDependencies(
    client,
    { userId, scheduleId, fromStationId, toStationId, statusId, passengers },
  ) {
    // 1. Validate user exists
    const userQuery = `SELECT id FROM users WHERE id = $1`;
    const userResult = await client.query(userQuery, [userId]);
    if (userResult.rows.length === 0) {
      throw new Error(`User with ID ${userId} does not exist`);
    }

    // 2. Validate schedule exists and get associated train
    const scheduleQuery = `
      SELECT s.id, s.train_id, t.name as train_name 
      FROM schedules s 
      JOIN trains t ON s.train_id = t.id 
      WHERE s.id = $1
    `;
    const scheduleResult = await client.query(scheduleQuery, [scheduleId]);
    if (scheduleResult.rows.length === 0) {
      throw new Error(`Schedule with ID ${scheduleId} does not exist`);
    }
    const trainId = scheduleResult.rows[0].train_id;

    // 3. Validate from and to stations exist
    const stationQuery = `SELECT id FROM stations WHERE id = ANY($1::uuid[])`;
    const stationResult = await client.query(stationQuery, [
      [fromStationId, toStationId],
    ]);
    const existingStations = stationResult.rows.map((row) => row.id);

    if (!existingStations.includes(fromStationId)) {
      throw new Error(`From station with ID ${fromStationId} does not exist`);
    }
    if (!existingStations.includes(toStationId)) {
      throw new Error(`To station with ID ${toStationId} does not exist`);
    }

    // 4. Validate booking status exists
    const statusQuery = `SELECT id FROM booking_statuses WHERE id = $1`;
    const statusResult = await client.query(statusQuery, [statusId]);
    if (statusResult.rows.length === 0) {
      throw new Error(`Booking status with ID ${statusId} does not exist`);
    }

    // 5. Validate schedule stops exist for the route
    const routeQuery = `
      SELECT COUNT(*) as stop_count
      FROM schedule_stops ss
      WHERE ss.schedule_id = $1 
        AND ss.station_id IN ($2, $3)
    `;
    const routeResult = await client.query(routeQuery, [
      scheduleId,
      fromStationId,
      toStationId,
    ]);
    if (parseInt(routeResult.rows[0].stop_count) < 2) {
      throw new Error(
        `Route not available: Schedule ${scheduleId} does not stop at both stations`,
      );
    }

    // 6. Validate passengers and their coach types
    if (passengers && passengers.length > 0) {
      const coachTypeIds = [...new Set(passengers.map((p) => p.coachType))];

      // Check if all coach types exist
      const coachTypeQuery = `SELECT id FROM coach_types WHERE id = ANY($1::uuid[])`;
      const coachTypeResult = await client.query(coachTypeQuery, [
        coachTypeIds,
      ]);
      const existingCoachTypes = coachTypeResult.rows.map((row) => row.id);

      const missingCoachTypes = coachTypeIds.filter(
        (id) => !existingCoachTypes.includes(id),
      );
      if (missingCoachTypes.length > 0) {
        throw new Error(
          `Coach types do not exist: ${missingCoachTypes.join(", ")}`,
        );
      }

      // Check if the train has coaches of the requested types
      const trainCoachQuery = `
        SELECT DISTINCT c.coach_type_id
        FROM coaches c
        WHERE c.train_id = $1 AND c.coach_type_id = ANY($2::uuid[])
      `;
      const trainCoachResult = await client.query(trainCoachQuery, [
        trainId,
        coachTypeIds,
      ]);
      const availableCoachTypes = trainCoachResult.rows.map(
        (row) => row.coach_type_id,
      );

      const unavailableCoachTypes = coachTypeIds.filter(
        (id) => !availableCoachTypes.includes(id),
      );
      if (unavailableCoachTypes.length > 0) {
        throw new Error(
          `Train does not have coaches of type: ${unavailableCoachTypes.join(", ")}`,
        );
      }

      // Ensure passengers meet the requirements
      for (const passenger of passengers) {
        if (!passenger.name || passenger.name.trim().length === 0) {
          throw new Error("All passengers must have a valid name");
        }
        if (!passenger.age || passenger.age < 1 || passenger.age > 120) {
          throw new Error(
            "All passengers must have a valid age between 1 and 120",
          );
        }
        if (!["Male", "Female", "Other"].includes(passenger.gender)) {
          throw new Error(
            "All passengers must have a valid gender (Male, Female, or Other)",
          );
        }
      }
    }
  }

  static generatePNR() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  static async getBookedPassengers(bookingId) {
    const query = `
      SELECT bp.*, ct.name as coach_type_name
      FROM booked_passengers bp
      LEFT JOIN coach_types ct ON bp.coach_type_id = ct.id
      WHERE bp.booking_id = $1
    `;
    const { rows } = await queryDB(query, [bookingId]);
    return rows;
  }

  static async getBookedSeats(bookingId) {
    const query = `
      SELECT 
        bs.*,
        s.seat_number,
        st.name AS seat_type,
        c.code AS coach_code,
        ct.name AS coach_type,
        bp.name AS passenger_name
      FROM booked_seats bs
      JOIN seats s ON bs.seat_id = s.id
      JOIN coaches c ON s.coach_id = c.id
      JOIN coach_types ct ON c.coach_type_id = ct.id
      LEFT JOIN seat_types st ON s.seat_type_id = st.id
      LEFT JOIN booked_passengers bp ON bs.booked_passenger_id = bp.id
      WHERE bs.booking_id = $1
      ORDER BY c.code, s.seat_number
    `;
    const { rows } = await queryDB(query, [bookingId]);
    return rows;
  }

  static async createPayment(bookingId, amount, statusId) {
    const query = `
      INSERT INTO payments (booking_id, amount, status_id, payment_date)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;
    const { rows } = await queryDB(query, [bookingId, amount, statusId]);
    return rows[0];
  }

  static async createRefund(paymentId, amount, statusId) {
    const query = `
      INSERT INTO refunds (payment_id, amount, status_id, refund_date)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;
    const { rows } = await queryDB(query, [paymentId, amount, statusId]);
    return rows[0];
  }

  static async confirmBooking(bookingId, paymentId = null) {
    const client = await getDBClient();

    try {
      // Begin transaction
      await client.query("BEGIN");

      const query = `
        UPDATE ${this.TABLE}
        SET status_id = (
          SELECT id FROM booking_statuses WHERE name = 'Confirmed' LIMIT 1
        )
        WHERE id = $1
        RETURNING *
      `;
      const { rows } = await client.query(query, [bookingId]);

      // Only update payment if paymentId is provided
      if (paymentId) {
        await client.query(
          `UPDATE payments SET status_id = (
            SELECT id FROM payment_statuses WHERE name = 'SUCCESS' LIMIT 1
          )
          WHERE id = $1`,
          [paymentId],
        );
      }

      // Commit transaction
      await client.query("COMMIT");

      return rows[0];
    } catch (error) {
      // Rollback transaction on error
      await client.query("ROLLBACK");
      throw new Error(`Failed to confirm booking: ${error.message}`);
    } finally {
      // Release the client back to the pool
      client.release();
    }
  }

  static async cancelBooking(bookingId) {
    const client = await getDBClient();

    try {
      // Simply update the booking status - trigger handles the rest
      const bookingQuery = `
        UPDATE ${this.TABLE}
        SET status_id = (
          SELECT id FROM booking_statuses WHERE name = 'Cancelled' LIMIT 1
        ),
        updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      const { rows: bookingRows } = await client.query(bookingQuery, [
        bookingId,
      ]);
      
      return bookingRows[0] || null;
    } catch (error) {
      throw new Error(`Failed to cancel booking: ${error.message}`);
    } finally {
      client.release();
    }
  }
}

export default Booking;
