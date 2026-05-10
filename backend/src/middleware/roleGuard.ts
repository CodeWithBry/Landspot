import { Request, Response, NextFunction } from "express"
import { sendError } from "../utils/response";
export const requireRole = (...roles: string[]) => 
    (req: Request, res: Response, next: NextFunction) => {
        if(!req.user || !req.user.role || !roles.includes(req.user.role)) {
            sendError(res, 'Forbidden', 403);
            return 
        }
        next()
    } 