import fastify, { type FastifyInstance } from "fastify";
import PingFunction from "./route/pings.js";
import { configDotenv } from "dotenv";
import { initDb } from "./db/index.js";
import VehicleStory from "./route/story.js";
import Vehicles from "./route/vehicles.js";
import cors from "@fastify/cors";


const app:FastifyInstance = fastify({});
configDotenv();
await app.register(cors, {
  origin: true, 
});


app.get("/", (req, reply)=>{
    reply.send({id : 1})
});

app.register(PingFunction, {prefix: "/api/pings"});
app.register(VehicleStory);
app.register(Vehicles, {  prefix: "/api/vehicles"})


;(async()=>{
    try {
        
        await initDb(); 
        await app.listen({port: 3000, host: '0.0.0.0' })
        console.log("Tizim ishga tushdi");

    } catch (error) {
        console.log("Xatolik", error)
    }
})()