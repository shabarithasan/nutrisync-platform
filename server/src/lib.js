import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const publicUser = (user) => ({ id: user.id, email: user.email, name: user.name, role: user.role, isEmailVerified: user.isEmailVerified });
export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
export const randomToken = () => crypto.randomBytes(32).toString('base64url');
const parseTTL = (ttl) => {
  if (!ttl) return '7d';
  const str = String(ttl).trim();
  if (/^\d+$/.test(str)) return Number(str);
  return str;
};

export const accessToken = (user) => jwt.sign(
  { sub: user.id, role: user.role, email: user.email },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: parseTTL(process.env.ACCESS_TOKEN_TTL) }
);
export const hashPassword = (password) => bcrypt.hash(password, 12);
export const verifyPassword = (password, hash) => bcrypt.compare(password, hash);
export const expiresInDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
export const tokenCookie = (token) => ({
  httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/',
  maxAge: Number(process.env.REFRESH_TOKEN_DAYS || 7) * 24 * 60 * 60 * 1000
});
