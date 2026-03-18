// src/middleware/validate.ts
import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = 
  (schema: AnyZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // schema.parse returns the validated data and strips unknown fields
      req.body = schema.parse(req.body); // ensures type safety at runtime
      next();
    } catch (error) {
      // Passing the error to next() triggers your global error handler
      next(error); // global error handler takes care of formatting the Zod error
    }
};