// src/modules/movie/movie.validation.ts
import { z } from "zod";

export const MovieSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  duration: z.string().trim(),
  genre: z.array(z.string()).nonempty("At least one genre is required"),
  releaseDate: z.string().transform((val) => new Date(val)),
  languages: z.array(z.string()).nonempty("At least one language is required"),
  certification: z.string(),
  posterUrl: z.string().url("Poster must be a valid URL"),
  rating: z.number().min(0).max(10),
  votes: z.number().min(0),
  format: z.array(z.string()).default(["2D"]),
});

// This helps you keep your types in sync with your validation
export type MovieInput = z.infer<typeof MovieSchema>;