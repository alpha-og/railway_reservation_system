import dotenv from "dotenv";

const loadConfig = () => {
  const NODE_ENV = process.env.NODE_ENV || "development";
  if (NODE_ENV === "development") {
    dotenv.config({
      path: ".env.development",
    });
  } else {
    dotenv.config({
      path: ".env.production",
    });
  }

  return {
    port: process.env.PORT || 8080,
    db: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      name: process.env.DB_NAME || "sidetrack-dev-db",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      type: process.env.DB_TYPE || "postgres",
    },
    jwt: {
      secret: process.env.JWT_SECRET || "secret",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    },
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  };
};

export default loadConfig();
