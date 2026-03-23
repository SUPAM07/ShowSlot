"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheaterSchema = void 0;
const zod_1 = require("zod");
exports.TheaterSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    location: zod_1.z.string().min(1, "Location is required"),
    logo: zod_1.z.string().min(1, "Logo is required"),
    city: zod_1.z.string().min(1, "City is required"),
    state: zod_1.z.string().min(1, "State is required"),
});
