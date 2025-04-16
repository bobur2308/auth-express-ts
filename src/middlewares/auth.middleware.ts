// auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { handleError } from "../helpers/error.handler";
import { IAuth } from "../models/auth.model";

export interface AuthenticatedRequest extends Request {
  user?: IAuth;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      status:401,
      message: "Unauthorized: No token provided",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    req.user = decoded as IAuth;
    next(); 
  } catch (error:any) {
    handleError(res,401,"Forbidden: Invalid or expired token",error)
    return;
  }
};
