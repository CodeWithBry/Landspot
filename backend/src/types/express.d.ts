import { JwtPayload } from "jsonwebtoken"
import {Multer} from "multer"

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        userId: string
        role?: string
      }
    }
    interface Request {
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}

export { };