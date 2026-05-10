import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { sendError } from '../utils/response'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization

  if (!header?.startsWith("Bearer ")) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  try {
    const token = header.split(" ")[1]
    req.user = verifyToken(token)
    next()
  } catch {
    return sendError(res, "Invalid or expired token", 401)
  }
}