"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
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
exports.config = Object.freeze(_config);
