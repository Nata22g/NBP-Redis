import express from 'express';
import redis from "redis";

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const app = express();

app.listen(PORT, () => {
    console.log(`backend server is running on port ${PORT}`);
})