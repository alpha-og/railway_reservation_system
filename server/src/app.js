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

  // --- force the CORS header manually ---
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (
      origin === "http://34.93.174.157" ||
      origin === "http://localhost:5173"
    ) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );

    // stop OPTIONS early
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  // const corsOptions = {
  //   origin: function (origin, callback) {
  //     const allowed = ["http://34.93.174.157", "http://localhost:5173"];
  //     if (!origin || allowed.includes(origin)) {
  //       callback(null, origin);
  //     } else {
  //       callback(new Error("Not allowed by CORS"));
  //     }
  //   },
  //   credentials: true,
  //   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
  // };
  //
  // app.use(cors(corsOptions));
  // app.options("*", cors(corsOptions));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

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
