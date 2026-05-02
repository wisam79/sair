import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { signToken, requireAuth, type AuthRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  role: z.enum(["student", "driver"]),
  university: z.string().optional(),
  vehicleType: z.string().optional(),
  vehiclePlate: z.string().optional(),
  vehicleColor: z.string().optional(),
  basicFare: z.number().optional(),
  standardFare: z.number().optional(),
  premiumFare: z.number().optional(),
});

router.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة", details: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.phone, data.phone)).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "رقم الهاتف مسجل مسبقاً" });
      return;
    }
    const [user] = await db.insert(usersTable).values({
      name: data.name,
      phone: data.phone,
      role: data.role,
      university: data.university,
      vehicleType: data.vehicleType,
      vehiclePlate: data.vehiclePlate,
      vehicleColor: data.vehicleColor,
      basicFare: data.basicFare ?? 50000,
      standardFare: data.standardFare ?? 80000,
      premiumFare: data.premiumFare ?? 120000,
    }).returning();
    const token = signToken(user.id);
    res.status(201).json({ token, user });
  } catch (err) {
    req.log.error(err, "register error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/auth/login", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ error: "رقم الهاتف مطلوب" });
    return;
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.phone, String(phone))).limit(1);
    if (!user) {
      res.status(404).json({ error: "المستخدم غير موجود" });
      return;
    }
    const token = signToken(user.id);
    res.json({ token, user });
  } catch (err) {
    req.log.error(err, "login error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) {
      res.status(404).json({ error: "المستخدم غير موجود" });
      return;
    }
    res.json(user);
  } catch (err) {
    req.log.error(err, "me error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.patch("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  const allowed = ["name", "university", "vehicleType", "vehiclePlate", "vehicleColor", "basicFare", "standardFare", "premiumFare", "isOnline"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }
  try {
    const [user] = await db.update(usersTable).set(updates as any).where(eq(usersTable.id, req.userId!)).returning();
    res.json(user);
  } catch (err) {
    req.log.error(err, "update me error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
