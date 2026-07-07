import type { FastifyInstance } from "fastify";
import { pool } from "../db/index.js";

interface IParams {
  id: string;
}

interface IQuery {
  from: string;
  to: string;
}

export default async function VehicleStory(route: FastifyInstance) {
  route.get<{
    Params: IParams;
    Querystring: IQuery;
  }>("/api/vehicles/:id/pings", async (request, reply) => {
    const id = Number(request.params.id);
    const { from, to } = request.query;

    try {
      const { rows } = await pool.query(
        `
        SELECT
          lat,
          lng,
          speed,
          ignition,
          occurred_at
        FROM pings
        WHERE vehicle_id = $1
          AND occurred_at BETWEEN $2 AND $3
        ORDER BY occurred_at;
        `,
        [id, from, to]
      );

      let cnt = 0;
      let max = 0;
      let sum = 0;

      rows.forEach((item, i) => {
        if (item.speed > max) {
          max = item.speed;
        }

        sum += Number(item.speed);

        if (
          i > 0 &&
          rows[i - 1].ignition === false &&
          item.ignition === true
        ) {
          cnt++;
        }
      });

      const avg = rows.length ? sum / rows.length : 0;

      return reply.send({
        vehicle_id: id,
        trace: rows.map((item) => ({
          ...item,
          ignition: item.ignition ? 1 : 0,
        })),
        ignition_cycles: cnt,
        max_speed: max,
        avg_speed: Number(avg.toFixed(2)),
      });
    } catch (err) {
      console.error(err);

      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  });
}