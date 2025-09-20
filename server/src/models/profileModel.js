import { queryDB } from "../utils/db.js";

class Profile {
  static async getProfile(userId) {
    const { rows } = await queryDB(
      `SELECT id, name, email, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );
    return rows[0];
  }

  static async updateProfile(userId, { name, email }) {
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

    if (updates.length === 0) return null;

    values.push(userId);

    const { rows } = await queryDB(
      `UPDATE users
       SET ${updates.join(", ")}
       WHERE id = $${idx}
       RETURNING id, name, email, created_at`,
      values
    );
    return rows[0];
  }
}
export default Profile;
