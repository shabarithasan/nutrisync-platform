import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function requireAuth(req, res, next) {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try { req.auth = jwt.verify(token, process.env.JWT_ACCESS_SECRET); next(); }
  catch { return res.status(401).json({ error: 'Your access token is invalid or expired.' }); }
}

export function requireRole(role) {
  return (req, res, next) => req.auth?.role === role ? next() : res.status(403).json({ error: 'You do not have permission to access this resource.' });
}
