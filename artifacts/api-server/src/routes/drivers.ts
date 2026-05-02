import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq, and, ilike } from "drizzle-orm";
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

router.get("/drivers/search", requireAuth, async (req, res) => {
  const { university } = req.query;
  try {
    const drivers = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.role, "driver"),
          university ? ilike(usersTable.university, `%${university}%`) : undefined
        )
      );
    res.json(drivers);
  } catch (err) {
    req.log.error(err, "search drivers error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.patch("/drivers/fares", requireAuth, async (req: AuthRequest, res) => {
  const { basicFare, standardFare, premiumFare } = req.body;
  try {
    const [currentUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.userId!));

    if (!currentUser || currentUser.role !== "driver") {
      return res.status(403).json({ error: "غير مصرح لك بالوصول" });
    }

    const [user] = await db
      .update(usersTable)
      .set({
        ...(basicFare !== undefined && { basicFare }),
        ...(standardFare !== undefined && { standardFare }),
        ...(premiumFare !== undefined && { premiumFare }),
      })
      .where(eq(usersTable.id, req.userId!))
      .returning();
    res.json(user);
  } catch (err) {
    req.log.error(err, "update fares error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/drivers/:driverId", requireAuth, async (req, res) => {
  const { driverId } = req.params;
  try {
    const [driver] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, driverId), eq(usersTable.role, "driver")));

    if (!driver) {
      return res.status(404).json({ error: "السائق غير موجود" });
    }

    const { id, name, rating, totalTrips, vehicleType, vehicleColor, vehiclePlate, university, basicFare, standardFare, premiumFare, isOnline } = driver;
    res.json({ id, name, rating, totalTrips, vehicleType, vehicleColor, vehiclePlate, university, basicFare, standardFare, premiumFare, isOnline });
  } catch (err) {
    req.log.error(err, "get driver profile error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
