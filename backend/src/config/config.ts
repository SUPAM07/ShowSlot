import { config as conf } from 'dotenv';
conf();

const _config = {
    port: process.env.PORT || 9000,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    frontendUrl: process.env.FRONTEND_URL,
    jwtSecret: process.env.JWT_SECRET || "bms-jwt-secret-key-2024",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "bms-refresh-secret-key-2024",
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
};

// Object.freeze ensures the config cannot be modified at runtime
export const config = Object.freeze(_config);