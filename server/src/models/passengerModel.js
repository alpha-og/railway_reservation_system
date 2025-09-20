import { queryDB } from "../utils/db.js";

class Passenger {
  static async listPassengers(userId) {
    const { rows } = await queryDB(
      `SELECT id, name, email, age, created_at
       FROM passengers
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async addPassenger(userId, { name, email, age }) {
    const { rows } = await queryDB(
      `INSERT INTO passengers (user_id, name, email, age)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, age, created_at`,
      [userId, name, email, age]
    );
    return rows[0];
  }

  static async updatePassenger(userId, passengerId, { name, email, age }) {
    const updates = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) {
      updates.push(`name = $${idx++}`);
      values.push(name);
    }
    if (email !== undefined) {
      updates.push(`email = $${idx++}`);
      values.push(email);
    }
    if (age !== undefined) {
      updates.push(`age = $${idx++}`);
      values.push(age);
    }

    if (updates.length === 0) return null;

    values.push(userId, passengerId);

    const { rows } = await queryDB(
      `UPDATE passengers
       SET ${updates.join(", ")}
       WHERE user_id = $${idx++} AND id = $${idx}
       RETURNING id, name, email, age, created_at`,
      values
    );
    return rows[0];
  }

  static async deletePassenger(userId, passengerId) {
    const { rows } = await queryDB(
      `DELETE FROM passengers
       WHERE user_id = $1 AND id = $2
       RETURNING id, name, email, age, created_at`,
      [userId, passengerId]
    );
    return rows[0];
  }
}
export default Passenger;
