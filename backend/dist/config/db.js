"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const connectDB = async () => {
    try {
        // Listening for connection events can help with debugging
        mongoose_1.default.connection.on("connected", () => {
            console.log("Connected to database successfully");
        });
        mongoose_1.default.connection.on("error", (err) => {
            console.log("Error in database connection:", err);
        });
        await mongoose_1.default.connect(config_1.config.databaseUrl);
    }
    catch (error) {
        console.error("Failed to connect to database", error);
        // Exit process with failure
        process.exit(1);
    }
};
exports.default = connectDB;
