"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes")); // Imports from routes/index.ts
const error_middleware_1 = require("./middlewares/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// 1. Pre-route Middlewares
app.use((0, cors_1.default)({
    credentials: true,
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// 2. Health Check / Root Route
app.get("/", (_, res) => {
    res.json({
        message: "Welcome to BookMyScreen API",
    });
});
// 3. Centralized API Routes
// This matches: /api/v1/movies AND /api/v1/theaters
app.use("/api/v1", routes_1.default);
// 4. Catch-all for 404s (Routes not found)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `The requested path ${req.originalUrl} was not found on this server.`,
    });
});
// 5. Global error handler (MUST be the absolute last thing)
app.use(error_middleware_1.globalErrorHandler);
exports.default = app;
