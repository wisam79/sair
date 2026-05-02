import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, subscriptionsTable, tripsTable, subscriptionCardsTable } from "@workspace/db/schema";
import { eq, desc, count, sum, and } from "drizzle-orm";
import { requireAdmin, type AuthRequest } from "../middleware/auth";
import { z } from "zod";
import crypto from "crypto";

const router = Router();

const CARD_CHARS = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
function generateCode(): string {
  const bytes = crypto.randomBytes(12);
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += CARD_CHARS[bytes[i]! % CARD_CHARS.length];
    if (i === 3 || i === 7) code += "-";
  }
  return code;
}

router.get("/admin/stats", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [totalStudents] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.role, "student"));
    const [totalDrivers] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.role, "driver"));
    const [activeSubs] = await db.select({ count: count() }).from(subscriptionsTable).where(eq(subscriptionsTable.isActive, true));
    const [totalTrips] = await db.select({ count: count() }).from(tripsTable).where(eq(tripsTable.status, "completed"));
    const [revenue] = await db.select({ total: sum(tripsTable.appCommission) }).from(tripsTable).where(eq(tripsTable.status, "completed"));
    const [unusedCards] = await db.select({ count: count() }).from(subscriptionCardsTable).where(eq(subscriptionCardsTable.status, "unused"));
    const [usedCards] = await db.select({ count: count() }).from(subscriptionCardsTable).where(eq(subscriptionCardsTable.status, "activated"));
    const [totalCards] = await db.select({ count: count() }).from(subscriptionCardsTable);

    res.json({
      students: totalStudents?.count ?? 0,
      drivers: totalDrivers?.count ?? 0,
      activeSubscriptions: activeSubs?.count ?? 0,
      completedTrips: totalTrips?.count ?? 0,
      totalRevenue: Number(revenue?.total ?? 0),
      cards: {
        total: totalCards?.count ?? 0,
        unused: unusedCards?.count ?? 0,
        used: usedCards?.count ?? 0,
      },
    });
  } catch (err) {
    req.log.error(err, "admin stats error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/admin/users", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
    res.json(users);
  } catch (err) {
    req.log.error(err, "admin users error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.patch("/admin/users/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params as { id: string };
  const allowed = ["name", "isOnline", "isAdmin", "basicFare", "standardFare", "premiumFare", "university", "vehicleType", "vehiclePlate", "vehicleColor"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }
  try {
    const [user] = await db.update(usersTable).set(updates as any).where(eq(usersTable.id, id)).returning();
    if (!user) { res.status(404).json({ error: "المستخدم غير موجود" }); return; }
    res.json(user);
  } catch (err) {
    req.log.error(err, "admin update user error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.delete("/admin/users/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params as { id: string };
  if (id === req.userId) { res.status(400).json({ error: "لا يمكن حذف حسابك الخاص" }); return; }
  try {
    await db.delete(usersTable).where(eq(usersTable.id, id));
    res.json({ message: "تم حذف المستخدم" });
  } catch (err) {
    req.log.error(err, "admin delete user error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/admin/subscriptions", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const subs = await db.select().from(subscriptionsTable).orderBy(desc(subscriptionsTable.startDate));
    res.json(subs);
  } catch (err) {
    req.log.error(err, "admin subscriptions error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/admin/cards", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const cards = await db.select().from(subscriptionCardsTable).orderBy(desc(subscriptionCardsTable.createdAt));
    res.json(cards);
  } catch (err) {
    req.log.error(err, "admin cards list error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

const generateSchema = z.object({
  plan: z.enum(["basic", "standard", "premium"]),
  durationMonths: z.number().int().min(1).max(12).default(1),
  count: z.number().int().min(1).max(500).default(10),
  driverId: z.string().uuid().optional(),
  batchId: z.string().optional(),
});

router.post("/admin/cards/generate", requireAdmin, async (req: AuthRequest, res) => {
  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { plan, durationMonths, count, driverId, batchId } = parsed.data;
  const batch = batchId ?? `batch-${Date.now()}`;

  try {
    const cards: { code: string; plan: "basic" | "standard" | "premium"; durationMonths: number; batchId: string; driverId?: string }[] = [];

    for (let i = 0; i < count; i++) {
      let code = generateCode();
      for (let a = 0; a < 5; a++) {
        const existing = await db.select({ id: subscriptionCardsTable.id }).from(subscriptionCardsTable).where(eq(subscriptionCardsTable.code, code)).limit(1);
        if (existing.length === 0) break;
        code = generateCode();
      }
      const card: typeof cards[number] = { code, plan, durationMonths, batchId: batch };
      if (driverId) card.driverId = driverId;
      cards.push(card);
    }

    const inserted = await db.insert(subscriptionCardsTable).values(cards).returning();
    res.json({
      message: `تم إنشاء ${inserted.length} بطاقة`,
      batchId: batch,
      cards: inserted.map(c => ({ id: c.id, code: c.code, plan: c.plan, durationMonths: c.durationMonths, status: c.status })),
    });
  } catch (err) {
    req.log.error(err, "admin generate cards error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.delete("/admin/cards/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params as { id: string };
  try {
    const [card] = await db.select().from(subscriptionCardsTable).where(eq(subscriptionCardsTable.id, id)).limit(1);
    if (!card) { res.status(404).json({ error: "البطاقة غير موجودة" }); return; }
    if (card.status === "activated") { res.status(400).json({ error: "لا يمكن حذف بطاقة مفعّلة" }); return; }
    await db.delete(subscriptionCardsTable).where(eq(subscriptionCardsTable.id, id));
    res.json({ message: "تم حذف البطاقة" });
  } catch (err) {
    req.log.error(err, "admin delete card error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/admin/trips", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const trips = await db.select().from(tripsTable).orderBy(desc(tripsTable.startTime)).limit(100);
    res.json(trips);
  } catch (err) {
    req.log.error(err, "admin trips error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
