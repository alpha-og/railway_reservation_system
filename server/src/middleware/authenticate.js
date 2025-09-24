import * as z from "zod";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/errors.js";
import { queryDB } from "../utils/db.js";

const authenticate =
  (role = "customer") =>
  async (req, res, next) => {
    // validate authorization header
    const schema = z.object({
      authorization: z.string().startsWith("Bearer ").optional(),
    });
    const { authorization } = schema.parse(req.headers);
    if (!authorization) {
      throw new AppError(401, "Authorization header missing");
    }

    // extract token from authorization header
    const [, token] = authorization.split(" ");
    if (!token) {
      throw new AppError(401, "Token missing");
    }

    // verify token
    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      throw new AppError(401, "Invalid token");
    }

    // extract user id from token
    const { userId } = verifiedToken;

    // retrieve user's role
    const query =
      "SELECT roles.name FROM users JOIN roles ON users.role_id = roles.id WHERE users.id = $1";
    const values = [userId];
    const { rows } = await queryDB(query, values);

    if (rows.length === 0) {
      throw new AppError(401, "User not found");
    }

    if (rows[0].name !== role) {
      throw new AppError(401, "User not authorized");
    }

    req.userId = userId;
    next();
  };

export default authenticate;
