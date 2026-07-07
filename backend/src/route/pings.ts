import type { FastifyInstance, FastifyReply } from "fastify";
import type { JSONSchema7 } from "json-schema"
import { pool } from "../db/index.js";


interface IPing {
    vehicle_id: number;
    lat: number;
    long: number;
    speed: number;
    ignition: 0 | 1;
    occurred_at: string;
}

export default async function PingFunction(route: FastifyInstance) {

    route.post<{ Body: IPing[] }>(
        "/",
        {
            schema: {
                body: {
                    type: "array",
                    items: {
                        type: "object",
                        required: [
                            "vehicle_id",
                            "lat",
                            "long",
                            "speed",
                            "ignition",
                            "occurred_at",
                        ],
                        properties: {
                            vehicle_id: {
                                type: "integer",
                                minimum: 1,
                                maximum: 10,
                            },
                            lat: { type: "number" },
                            long: { type: "number" },
                            speed: {
                                type: "number",
                                minimum: 0,
                            },
                            ignition: {
                                type: "integer",
                                enum: [0, 1],
                            },
                            occurred_at: {
                                type: "string",
                                format: "date-time",
                            },
                        },
                    },
                },
            },
        },
        async (request, reply) => {
            request.body.forEach(async (p) => {
                await pool.query(
                    `
        INSERT INTO pings
        (
          vehicle_id,
          lat,
          lng,
          speed,
          ignition,
          occurred_at
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (vehicle_id, occurred_at)
        DO NOTHING
        `,
                    [
                        p.vehicle_id,
                        p.lat,
                        p.long,
                        p.speed,
                        p.ignition === 1,
                        p.occurred_at,
                    ]
                );
            });
            console.log("Saqlandi")

            return reply.send({
                ok: true,
            });
        }
    );

}