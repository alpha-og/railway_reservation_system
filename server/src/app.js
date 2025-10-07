import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  authRoutes,
  trainRoutes,
  stationRoutes,
  stationDistanceRoutes,
  scheduleRoutes,
  auditLogRoutes,
  coachTypeRoutes,
  seatTypeRoutes,
  profileRoutes,
  bookingRoutes,
  bookingRoutesAdmin,
  trainRoutesUser,
  stationRoutesUser,
  coachTypeRoutesUser,
  roleRoutes,
  scheduleRoutesUser,
  fareRoutes,
} from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import authenticate from "./middleware/authenticate.js";
import responseTransformer from "./middleware/responseTransformer.js";

export default function createApp(config) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: [
        config.clientUrl,
        "http://localhost:5173",
        "http://34.93.174.157:80",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  // register response transformer middleware
  app.use(responseTransformer);

  const api = express.Router();

  api.get("/", (req, res) => {
    res.send("This is the Railway Reservation System API");
  });

  api.use("/trains", trainRoutesUser);
  api.use("/schedules", scheduleRoutesUser);
  api.use("/roles", roleRoutes);
  api.use("/stations", stationRoutesUser);
  api.use("/coach-types", coachTypeRoutesUser);
  api.use("/fares", fareRoutes);

  api.use("/auth", authRoutes);
  api.use("/admin/trains", authenticate("admin"), trainRoutes);
  api.use("/admin/stations", authenticate("admin"), stationRoutes);
  api.use(
    "/admin/station-distances",
    authenticate("admin"),
    stationDistanceRoutes,
  );
  api.use("/admin/audit-log", authenticate("admin"), auditLogRoutes);
  api.use("/admin/coach-types", authenticate("admin"), coachTypeRoutes);
  api.use("/admin/schedules", authenticate("admin"), scheduleRoutes);
  api.use("/admin/seat-types", authenticate("admin"), seatTypeRoutes);

  api.use("/profile", authenticate(["customer", "admin"]), profileRoutes);
  api.use("/bookings", authenticate("customer"), bookingRoutes);
  api.use("/admin/bookings", authenticate("admin"), bookingRoutesAdmin);

  api.get("/", (req, res) => {
    res.send("This is the Railway Reservation System API");
  });

  app.use("/api/v1", api);

  // register global error handler middleware
  app.use(errorHandler);

  return app;
}
