import { Response } from "express";

// Error handling function
export const ResponseHandler = (res: Response, status: number,success:boolean, data: object = {},) => {
  return res.status(status).json({
    success,
    status,
    data,
  });
};