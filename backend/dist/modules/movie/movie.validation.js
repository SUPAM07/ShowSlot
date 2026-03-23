"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieSchema = void 0;
// src/modules/movie/movie.validation.ts
const zod_1 = require("zod");
exports.MovieSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1, "Title is required"),
    description: zod_1.z.string().trim().min(1, "Description is required"),
    duration: zod_1.z.string().trim(),
    genre: zod_1.z.array(zod_1.z.string()).nonempty("At least one genre is required"),
    releaseDate: zod_1.z.string().transform((val) => new Date(val)),
    languages: zod_1.z.array(zod_1.z.string()).nonempty("At least one language is required"),
    certification: zod_1.z.string(),
    posterUrl: zod_1.z.string().url("Poster must be a valid URL"),
    rating: zod_1.z.number().min(0).max(10),
    votes: zod_1.z.number().min(0),
    format: zod_1.z.array(zod_1.z.string()).default(["2D"]),
});
