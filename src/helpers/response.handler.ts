import { Response } from "express";

// Error handling function
export const ResponseHandler = (res: Response, status: number, data: object = {},) => {
  return res.status(status).json({
    success: false,
    status,
    data,
  });
};