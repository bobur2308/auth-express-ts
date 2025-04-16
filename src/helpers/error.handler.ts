// src/utils/errorHandler.ts
import { Response } from "express";

// Define a custom error type
interface AppError {
  status: number;
  message: string;
}

// Error handling function
export const handleError = (res: Response, status: number, message: string,error:any = {}) => {
  console.error(error)
  return res.status(status).json({
    success: false,
    status,
    message,
    err_message:error?.errorResponse?.errmsg
  });
};

// Optional: Utility to create an error object
export const createError = (status: number, message: string): AppError => {
  return { status, message };
};