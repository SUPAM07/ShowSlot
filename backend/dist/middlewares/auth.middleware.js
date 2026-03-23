"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const http_errors_1 = __importDefault(require("http-errors"));
// Verify JWT access token from cookies or Authorization header
const verifyToken = (req, _res, next) => {
    try {
        const token = req.cookies?.accessToken ||
            req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            throw (0, http_errors_1.default)(401, "Access token is required");
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return next((0, http_errors_1.default)(401, "Access token has expired"));
        }
        next((0, http_errors_1.default)(401, "Invalid access token"));
    }
};
exports.verifyToken = verifyToken;
// Restrict to admin role only
const isAdmin = (req, _res, next) => {
    if (req.userRole !== "admin") {
        return next((0, http_errors_1.default)(403, "Admin access required"));
    }
    next();
};
exports.isAdmin = isAdmin;
