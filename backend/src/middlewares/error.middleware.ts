import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { isHttpError } from "http-errors";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default Response
  let statusCode = 500;
  let message = "Something went wrong!";
  let errors: {
    field?: string;
    message: string;
  }[] = [];

  // Zod Error Handling
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  } else if (isHttpError(err)) {
    // HTTP errors created by http-errors library (e.g. createHttpError(401, ...))
    statusCode = err.status;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};