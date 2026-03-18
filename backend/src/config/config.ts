import { config as conf } from 'dotenv';
conf();

const _config = {
    port: process.env.PORT || 9000,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    frontendUrl: process.env.FRONTEND_URL,
};

// Object.freeze ensures the config cannot be modified at runtime
export const config = Object.freeze(_config);