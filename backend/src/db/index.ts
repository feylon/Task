import { configDotenv } from "dotenv";
import { Pool } from "pg";

configDotenv();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function initDb() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY,
        plate_number VARCHAR(20) NOT NULL,
        model_name VARCHAR(100) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS pings (
    id BIGSERIAL PRIMARY KEY,

    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),

    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,

    speed REAL NOT NULL,

    ignition BOOLEAN NOT NULL,

    occurred_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(vehicle_id, occurred_at)
);
    `);

    await client.query(`
      INSERT INTO vehicles (id, plate_number, model_name)
      VALUES
        (1, 'CAR-001', 'Vehicle 1'),
        (2, 'CAR-002', 'Vehicle 2'),
        (3, 'CAR-003', 'Vehicle 3'),
        (4, 'CAR-004', 'Vehicle 4'),
        (5, 'CAR-005', 'Vehicle 5'),
        (6, 'CAR-006', 'Vehicle 6'),
        (7, 'CAR-007', 'Vehicle 7'),
        (8, 'CAR-008', 'Vehicle 8'),
        (9, 'CAR-009', 'Vehicle 9'),
        (10, 'CAR-010', 'Vehicle 10')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Hammasi saqlandi.");
  } catch (error) {
    console.error(" Err:", error);
    throw error;
  } finally {
    client.release();
  }
}