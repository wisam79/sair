import { Router } from "express";
import { db } from "@workspace/db";
import { subscriptionCardsTable, subscriptionsTable, usersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { z } from "zod";
import crypto from "crypto";

const router = Router();

const ADMIN_KEY = process.env["ADMIN_KEY"] ?? "uniride-admin-2024";
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

const generateSchema = z.object({
  plan: z.enum(["basic", "standard", "premium"]),
  durationMonths: z.number().int().min(1).max(12).default(1),
  count: z.number().int().min(1).max(500).default(10),
  driverId: z.string().uuid().optional(),
  batchId: z.string().optional(),
  cardExpiresAt: z.string().datetime().optional(),
});

router.post("/cards/generate", async (req: AuthRequest, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== ADMIN_KEY) {
    res.status(403).json({ error: "غير مصرح" });
    return;
  }

  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { plan, durationMonths, count, driverId, batchId, cardExpiresAt } = parsed.data;
  const batch = batchId ?? `batch-${Date.now()}`;

  try {
    const cards: { code: string; plan: "basic" | "standard" | "premium"; durationMonths: number; batchId: string; driverId?: string; cardExpiresAt?: Date }[] = [];

    for (let i = 0; i < count; i++) {
      let code = generateCode();
      let attempts = 0;
      while (attempts < 5) {
        const existing = await db.select({ id: subscriptionCardsTable.id })
          .from(subscriptionCardsTable)
          .where(eq(subscriptionCardsTable.code, code))
          .limit(1);
        if (existing.length === 0) break;
        code = generateCode();
        attempts++;
      }
      const card: { code: string; plan: "basic" | "standard" | "premium"; durationMonths: number; batchId: string; driverId?: string; cardExpiresAt?: Date } = {
        code,
        plan,
        durationMonths,
        batchId: batch,
      };
      if (driverId) card.driverId = driverId;
      if (cardExpiresAt) card.cardExpiresAt = new Date(cardExpiresAt);
      cards.push(card);
    }

    const inserted = await db.insert(subscriptionCardsTable).values(cards).returning();
    res.json({
      message: `تم إنشاء ${inserted.length} بطاقة`,
      batchId: batch,
      cards: inserted.map(c => ({ id: c.id, code: c.code, plan: c.plan, durationMonths: c.durationMonths })),
    });
  } catch (err) {
    req.log.error(err, "generate cards error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/cards", async (req: AuthRequest, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== ADMIN_KEY) {
    res.status(403).json({ error: "غير مصرح" });
    return;
  }
  try {
    const cards = await db.select().from(subscriptionCardsTable).orderBy(subscriptionCardsTable.createdAt);
    res.json(cards);
  } catch (err) {
    req.log.error(err, "list cards error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/cards/validate/:code", requireAuth, async (req: AuthRequest, res) => {
  const raw = (req.params as { code: string }).code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const formatted = raw.length === 12
    ? `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`
    : req.params["code"]?.toUpperCase() ?? "";

  try {
    const [card] = await db.select().from(subscriptionCardsTable)
      .where(eq(subscriptionCardsTable.code, formatted))
      .limit(1);

    if (!card) {
      res.status(404).json({ error: "الرمز غير صحيح" });
      return;
    }
    if (card.status === "activated") {
      res.status(409).json({ error: "هذه البطاقة مُستخدمة مسبقاً" });
      return;
    }
    if (card.status === "expired" || (card.cardExpiresAt && new Date(card.cardExpiresAt) < new Date())) {
      res.status(410).json({ error: "انتهت صلاحية هذه البطاقة" });
      return;
    }

    const planNames: Record<string, string> = { basic: "الأساسي", standard: "القياسي", premium: "المميز" };
    res.json({
      valid: true,
      plan: card.plan,
      planName: planNames[card.plan],
      durationMonths: card.durationMonths,
      driverId: card.driverId,
    });
  } catch (err) {
    req.log.error(err, "validate card error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/cards/activate", requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({
    code: z.string().min(1),
    driverId: z.string().uuid().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صحيحة" });
    return;
  }

  const userId = req.user!.userId;
  const raw = parsed.data.code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const formatted = raw.length === 12
    ? `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`
    : parsed.data.code.toUpperCase();

  try {
    const [card] = await db.select().from(subscriptionCardsTable)
      .where(eq(subscriptionCardsTable.code, formatted))
      .limit(1);

    if (!card) {
      res.status(404).json({ error: "الرمز غير صحيح، تحقق من البطاقة وأعد المحاولة" });
      return;
    }
    if (card.status === "activated") {
      res.status(409).json({ error: "هذه البطاقة مُستخدمة مسبقاً ومرتبطة بحساب آخر" });
      return;
    }
    if (card.status === "expired" || (card.cardExpiresAt && new Date(card.cardExpiresAt) < new Date())) {
      res.status(410).json({ error: "انتهت صلاحية هذه البطاقة" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!user) {
      res.status(404).json({ error: "المستخدم غير موجود" });
      return;
    }

    const targetDriverId = card.driverId ?? parsed.data.driverId;
    if (!targetDriverId) {
      res.status(400).json({ error: "يجب تحديد سائق لتفعيل الاشتراك" });
      return;
    }

    const [driver] = await db.select().from(usersTable)
      .where(and(eq(usersTable.id, targetDriverId), eq(usersTable.role, "driver")))
      .limit(1);
    if (!driver) {
      res.status(404).json({ error: "السائق غير موجود" });
      return;
    }

    const planFareMap: Record<string, number> = {
      basic: driver.basicFare,
      standard: driver.standardFare,
      premium: driver.premiumFare,
    };
    const tripsMap: Record<string, number> = { basic: 20, standard: 45, premium: 999 };

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + card.durationMonths);

    const [subscription] = await db.insert(subscriptionsTable).values({
      studentId: userId,
      driverId: targetDriverId,
      driverName: driver.name,
      plan: card.plan,
      startDate,
      endDate,
      isActive: true,
      monthlyFare: String(planFareMap[card.plan] ?? 50000),
      tripsPerMonth: tripsMap[card.plan] ?? 20,
      tripsUsed: 0,
    }).returning();

    await db.update(subscriptionCardsTable)
      .set({ status: "activated", activatedBy: userId, activatedAt: new Date() })
      .where(eq(subscriptionCardsTable.id, card.id));

    const planNames: Record<string, string> = { basic: "الأساسي", standard: "القياسي", premium: "المميز" };

    res.json({
      message: "تم تفعيل الاشتراك بنجاح",
      subscription,
      plan: planNames[card.plan],
      driverName: driver.name,
      endDate: endDate.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "activate card error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/cards/my-history", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  try {
    const cards = await db.select().from(subscriptionCardsTable)
      .where(eq(subscriptionCardsTable.activatedBy, userId));
    res.json(cards);
  } catch (err) {
    req.log.error(err, "my cards history error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
