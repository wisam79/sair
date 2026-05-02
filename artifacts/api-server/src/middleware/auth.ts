import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.SESSION_SECRET || "uniride-secret-2024";

export function signToken(userId: string, isAdmin = false): string {
  return jwt.sign({ userId, isAdmin }, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): { userId: string; isAdmin: boolean } {
  return jwt.verify(token, JWT_SECRET) as { userId: string; isAdmin: boolean };
}

export interface AuthRequest extends Request {
  userId?: string;
  user?: { userId: string; isAdmin: boolean };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "غير مصرح" });
    return;
  }
  try {
    const decoded = verifyToken(auth.slice(7));
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "رمز غير صالح" });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "غير مصرح" });
    return;
  }
  try {
    const decoded = verifyToken(auth.slice(7));
    if (!decoded.isAdmin) {
      res.status(403).json({ error: "صلاحيات المدير مطلوبة" });
      return;
    }
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "رمز غير صالح" });
  }
}
