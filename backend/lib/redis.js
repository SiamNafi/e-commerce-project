import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
export const redis = new Redis(process.env.UPSTASH_URL);
// await client.set("foo", "bar");
