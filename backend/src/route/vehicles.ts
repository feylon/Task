import type { FastifyInstance } from "fastify";
import { pool } from "../db/index.js"; 

export default async function Vehicles(route: FastifyInstance) {
  route.get("/", async (_, reply) => {
    try {
      const { rows } = await pool.query(
        `
        SELECT
          v.id,
          v.plate_number,
          v.model_name,
          p.lat,
          p.lng,
          p.speed,
          p.ignition,
          p.occurred_at
        FROM vehicles v
        LEFT JOIN LATERAL (
          SELECT
            lat,
            lng,
            speed,
            ignition,
            occurred_at
          FROM pings
          WHERE vehicle_id = v.id
          ORDER BY occurred_at DESC
          LIMIT 1
        ) p ON TRUE
        ORDER BY v.id;
        `
      );

      return reply.send(rows);
    } catch (error) {
      console.error(error);

      return reply.status(500).send({
        message: "Xatolik",
      });
    }
  });
}