import { Router } from "express";
import { db } from "@workspace/db";
import { subscriptionsTable, usersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const subscribeSchema = z.object({
  driverId: z.string().uuid(),
  plan: z.enum(["basic", "standard", "premium"]),
});

router.get("/subscriptions/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const subs = await db
      .select()
      .from(subscriptionsTable)
      .where(and(eq(subscriptionsTable.studentId, req.userId!), eq(subscriptionsTable.isActive, true)))
      .limit(1);
    res.json(subs[0] ?? null);
  } catch (err) {
    req.log.error(err, "get subscription error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/subscriptions/driver", requireAuth, async (req: AuthRequest, res) => {
  try {
    const subs = await db
      .select()
      .from(subscriptionsTable)
      .where(and(eq(subscriptionsTable.driverId, req.userId!), eq(subscriptionsTable.isActive, true)));
    res.json(subs);
  } catch (err) {
    req.log.error(err, "get driver subscriptions error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/subscriptions", requireAuth, async (req: AuthRequest, res) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }
  const { driverId, plan } = parsed.data;

  try {
    const [driver] = await db.select().from(usersTable).where(eq(usersTable.id, driverId)).limit(1);
    if (!driver || driver.role !== "driver") {
      res.status(404).json({ error: "السائق غير موجود" });
      return;
    }

    await db
      .update(subscriptionsTable)
      .set({ isActive: false })
      .where(and(eq(subscriptionsTable.studentId, req.userId!), eq(subscriptionsTable.isActive, true)));

    const fareMap = { basic: driver.basicFare, standard: driver.standardFare, premium: driver.premiumFare };
    const tripsMap = { basic: 20, standard: 40, premium: 999 };
    const monthlyFare = fareMap[plan];

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const [sub] = await db
      .insert(subscriptionsTable)
      .values({
        studentId: req.userId!,
        driverId: driver.id,
        driverName: driver.name,
        plan,
        endDate,
        monthlyFare: String(monthlyFare),
        tripsPerMonth: tripsMap[plan],
      })
      .returning();

    res.status(201).json(sub);
  } catch (err) {
    req.log.error(err, "subscribe error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.delete("/subscriptions/:id", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    await db
      .update(subscriptionsTable)
      .set({ isActive: false })
      .where(and(eq(subscriptionsTable.id, id), eq(subscriptionsTable.studentId, req.userId!)));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "cancel subscription error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
