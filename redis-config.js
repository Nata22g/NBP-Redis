import { createClient } from 'redis';

const client = createClient({
    password: 'jliSkSWtEvh2eGREr8QIzFkMVRPL5AmR',
    socket: {
        host: 'redis-12248.c300.eu-central-1-1.ec2.cloud.redislabs.com',
        port: 12248
    }
});

client.on("ready", () => console.log("Redis is ready."));
client.on("error", err => console.log("Redis Client Error", err));

export default client