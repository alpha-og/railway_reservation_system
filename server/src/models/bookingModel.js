import { queryDB } from "../utils/db.js";

class Booking {
  static TABLE = "bookings";

  static async create(userId, scheduleId, fromStationId, toStationId, statusId, totalAmount) {
    const query = `
      INSERT INTO ${this.TABLE} 
        (user_id, schedule_id, from_station_id, to_station_id, status_id, total_amount, pnr, booking_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    const pnr = Booking.generatePNR();
    const values = [userId, scheduleId, fromStationId, toStationId, statusId, totalAmount, pnr];
    const result = await queryDB(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `SELECT * FROM ${this.TABLE} WHERE id = $1`;
    const result = await queryDB(query, [id]);
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



  static generatePNR() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }


  static async getBookedPassengers(bookingId) {
    const query = `
      SELECT bp.*, p.email AS passenger_email
      FROM booked_passengers bp
      JOIN passengers p ON bp.passenger_id = p.id
      WHERE bp.booking_id = $1
    `;
    const { rows } = await queryDB(query, [bookingId]);
    return rows;
  }

  static async getBookedSeats(bookingId) {
    const query = `
      SELECT bs.*, s.seat_number, ct.name AS seat_type
      FROM booked_seats bs
      JOIN seats s ON bs.seat_id = s.id
      JOIN seat_types ct ON s.seat_type_id = ct.id
      WHERE bs.booking_id = $1
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

  static async confirmBooking(bookingId, paymentId) {
    const query = `
      UPDATE ${this.TABLE}
      SET status_id = (
        SELECT id FROM booking_statuses WHERE name = 'CONFIRMED' LIMIT 1
      )
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await queryDB(query, [bookingId]);


    await queryDB(
      `UPDATE payments SET status_id = (
        SELECT id FROM payment_statuses WHERE name = 'SUCCESS' LIMIT 1
      )
      WHERE id = $1`,
      [paymentId]
    );

    return rows[0];
  }



  static async cancelBooking(bookingId) {
    const bookingQuery = `
      UPDATE ${this.TABLE}
      SET status_id = (
        SELECT id FROM booking_statuses WHERE name = 'CANCELLED' LIMIT 1
      )
      WHERE id = $1
      RETURNING *
    `;
    const { rows: bookingRows } = await queryDB(bookingQuery, [bookingId]);
    const booking = bookingRows[0];

    if (!booking) return null;


    const paymentQuery = `SELECT * FROM payments WHERE booking_id = $1 LIMIT 1`;
    const { rows: paymentRows } = await queryDB(paymentQuery, [bookingId]);
    const payment = paymentRows[0];

    if (payment) {

      const refundQuery = `
        INSERT INTO refunds (payment_id, amount, status_id, refund_date)
        VALUES ($1, $2, (SELECT id FROM refund_statuses WHERE name='SUCCESS' LIMIT 1), NOW())
        RETURNING *
      `;
      await queryDB(refundQuery, [payment.id, payment.amount]);
    }

    return booking;
  }
}

export default Booking;