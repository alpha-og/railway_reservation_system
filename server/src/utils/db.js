import { Pool } from "pg";
import config from "./config.js";

const db_config = config.db;

const pool = new Pool({
  user: db_config.user,
  host: db_config.host,
  database: db_config.name,
  password: db_config.password,
  port: db_config.port,
});

export const queryDB = async (query, params) => {
  const start = Date.now();
  const result = await pool.query(query, params);
  const duration = Date.now() - start;
  console.log("executed query", { query, duration, rows: result.rowCount });
  return result;
};

export const getDBClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  const timeout = setTimeout(() => {
    console.error("A client has been checked out for more than 5 seconds!");
    console.error(
      `The last executed query on this client was: ${client.lastQuery}`,
    );
  }, 5000);

  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };
  client.release = () => {
    // clear our timeout
    clearTimeout(timeout);
    // set the methods back to their old un-monkey-patched version
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  return client;
};

export { pool };