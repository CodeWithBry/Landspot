import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { sendError } from '../utils/response'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return sendError(res, "Invalid or expired token", 401);
  }
}