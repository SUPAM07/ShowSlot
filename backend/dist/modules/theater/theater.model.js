"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheaterModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const theaterSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    logo: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
}, { timestamps: true });
exports.TheaterModel = mongoose_1.default.model("Theater", theaterSchema);
