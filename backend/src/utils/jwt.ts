import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET as string

export interface JwtPayload {
  userId: string
  role: 'user' | 'agent'
}

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, SECRET, { expiresIn: '7d' })

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, SECRET) as JwtPayload