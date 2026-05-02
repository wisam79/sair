import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/drivers", requireAuth, async (req, res) => {
  try {
    const drivers = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.role, "driver"), eq(usersTable.isOnline, true)));
    res.json(drivers);
  } catch (err) {
    req.log.error(err, "list drivers error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/drivers/all", requireAuth, async (req, res) => {
  try {
    const drivers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "driver"));
    res.json(drivers);
  } catch (err) {
    req.log.error(err, "list all drivers error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.patch("/drivers/online", requireAuth, async (req: AuthRequest, res) => {
  const { isOnline } = req.body;
  try {
    const [user] = await db
      .update(usersTable)
      .set({ isOnline: Boolean(isOnline) })
      .where(eq(usersTable.id, req.userId!))
      .returning();
    res.json(user);
  } catch (err) {
    req.log.error(err, "toggle online error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
