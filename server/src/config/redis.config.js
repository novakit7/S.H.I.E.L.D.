import { createClient } from "redis";
import { env } from "./env.js";

export const redisClient = createClient({
    username: "default",
    password: env.REDIS_PASS,
    socket: {
        host: env.REDIS_HOST,
        port: Number(env.REDIS_PORT)
    }
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
});