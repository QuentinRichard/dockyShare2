import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'ton_secret_secure_ici';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export function signJwt(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
