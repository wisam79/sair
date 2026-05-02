import { Router } from "express";
import { db } from "@workspace/db";
import { tripsTable, usersTable } from "@workspace/db/schema";
import { eq, or, and, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const createTripSchema = z.object({
  driverId: z.string().uuid().optional(),
  originLat: z.number(),
  originLng: z.number(),
  originAddress: z.string(),
  destLat: z.number(),
  destLng: z.number(),
  destAddress: z.string(),
  fare: z.number(),
  notes: z.string().optional(),
});

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

router.get("/trips/fare-estimate", async (req, res) => {
  const { originLat, originLng, destLat, destLng } = req.query;
  
  if (!originLat || !originLng || !destLat || !destLng) {
    res.status(400).json({ error: "الإحداثيات مطلوبة" });
    return;
  }

  const lat1 = Number(originLat);
  const lng1 = Number(originLng);
  const lat2 = Number(destLat);
  const lng2 = Number(destLng);

  if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
    res.status(400).json({ error: "إحداثيات غير صالحة" });
    return;
  }

  const distanceKm = haversineKm(lat1, lng1, lat2, lng2);
  const baseFare = 15000;
  const perKmRate = 3000;
  const distanceFare = distanceKm * perKmRate;
  
  let estimatedFare = baseFare + distanceFare;
  
  // Min 20000, Max 200000
  estimatedFare = Math.max(20000, Math.min(200000, estimatedFare));
  
  // Round to nearest 5000
  estimatedFare = Math.round(estimatedFare / 5000) * 5000;

  res.json({
    estimatedFare,
    distanceKm,
    breakdown: {
      baseFare,
      perKmRate,
      distanceFare
    }
  });
});

router.post("/trips", requireAuth, async (req: AuthRequest, res) => {
  const parsed = createTripSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة", details: parsed.error.flatten() });
    return;
  }
  try {
    const [student] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!student) {
      res.status(404).json({ error: "المستخدم غير موجود" });
      return;
    }

    let driverData: { driverId?: string; driverName?: string; driverPhone?: string; driverVehicle?: string; driverRating?: string; status: "waiting" | "accepted" } = {
      status: "waiting",
    };

    if (parsed.data.driverId) {
      const [driver] = await db.select().from(usersTable).where(eq(usersTable.id, parsed.data.driverId)).limit(1);
      if (driver) {
        driverData = {
          driverId: driver.id,
          driverName: driver.name,
          driverPhone: driver.phone,
          driverVehicle: driver.vehicleType && driver.vehicleColor ? `${driver.vehicleType} ${driver.vehicleColor}` : driver.vehicleType ?? undefined,
          driverRating: driver.rating,
          status: "accepted",
        };
      }
    }

    const [trip] = await db
      .insert(tripsTable)
      .values({
        studentId: student.id,
        studentName: student.name,
        originLat: String(parsed.data.originLat),
        originLng: String(parsed.data.originLng),
        originAddress: parsed.data.originAddress,
        destLat: String(parsed.data.destLat),
        destLng: String(parsed.data.destLng),
        destAddress: parsed.data.destAddress,
        fare: String(parsed.data.fare),
        notes: parsed.data.notes,
        ...driverData,
      })
      .returning();

    res.status(201).json(trip);
  } catch (err) {
    req.log.error(err, "create trip error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/trips/active", requireAuth, async (req: AuthRequest, res) => {
  try {
    const active = await db
      .select()
      .from(tripsTable)
      .where(
        and(
          or(eq(tripsTable.studentId, req.userId!), eq(tripsTable.driverId, req.userId!)) as any,
          or(
            eq(tripsTable.status, "waiting"),
            eq(tripsTable.status, "accepted"),
            eq(tripsTable.status, "pickup"),
            eq(tripsTable.status, "inprogress"),
            eq(tripsTable.status, "arrived"),
          ) as any,
        ),
      )
      .orderBy(desc(tripsTable.startTime))
      .limit(1);

    res.json(active[0] ?? null);
  } catch (err) {
    req.log.error(err, "active trip error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/trips/pending", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user || user.role !== "driver") {
      res.json(null);
      return;
    }
    const pending = await db
      .select()
      .from(tripsTable)
      .where(eq(tripsTable.status, "waiting"))
      .orderBy(desc(tripsTable.startTime))
      .limit(1);

    res.json(pending[0] ?? null);
  } catch (err) {
    req.log.error(err, "pending trips error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/trips/history", requireAuth, async (req: AuthRequest, res) => {
  try {
    const history = await db
      .select()
      .from(tripsTable)
      .where(
        and(
          or(eq(tripsTable.studentId, req.userId!), eq(tripsTable.driverId, req.userId!)) as any,
          or(eq(tripsTable.status, "completed"), eq(tripsTable.status, "cancelled")) as any,
        ),
      )
      .orderBy(desc(tripsTable.startTime))
      .limit(50);

    res.json(history);
  } catch (err) {
    req.log.error(err, "trip history error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.patch("/trips/:id/status", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["waiting", "accepted", "pickup", "inprogress", "arrived", "completed", "cancelled"];
  if (!allowed.includes(status)) {
    res.status(400).json({ error: "حالة غير صالحة" });
    return;
  }

  try {
    const [existing] = await db.select().from(tripsTable).where(eq(tripsTable.id, id)).limit(1);
    if (!existing) {
      res.status(404).json({ error: "الرحلة غير موجودة" });
      return;
    }

    const updates: Record<string, unknown> = { status };

    if (status === "accepted") {
      const [driver] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
      if (driver && driver.role === "driver") {
        updates.driverId = driver.id;
        updates.driverName = driver.name;
        updates.driverPhone = driver.phone;
        updates.driverVehicle = driver.vehicleType && driver.vehicleColor ? `${driver.vehicleType} ${driver.vehicleColor}` : driver.vehicleType;
        updates.driverRating = driver.rating;
      }
    }

    if (status === "completed") {
      updates.endTime = new Date();
      const fare = Number(existing.fare);
      updates.driverShare = String(Math.floor(fare * 0.85));
      updates.appCommission = String(Math.floor(fare * 0.15));
      if (existing.driverId) {
        await db
          .update(usersTable)
          .set({
            totalTrips: db.$count(tripsTable, eq(tripsTable.driverId, existing.driverId)) as any,
            balance: String(Number(0) + Math.floor(fare * 0.85)),
          } as any)
          .where(eq(usersTable.id, existing.driverId));
        await db.update(usersTable).set({ totalTrips: (db.$count(tripsTable, eq(tripsTable.studentId, existing.studentId))) as any } as any).where(eq(usersTable.id, existing.studentId));
      }
    }

    const [trip] = await db.update(tripsTable).set(updates as any).where(eq(tripsTable.id, id)).returning();
    res.json(trip);
  } catch (err) {
    req.log.error(err, "update trip status error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.delete("/trips/:id", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    await db
      .update(tripsTable)
      .set({ status: "cancelled" })
      .where(and(eq(tripsTable.id, id), or(eq(tripsTable.studentId, req.userId!), eq(tripsTable.driverId, req.userId!)) as any));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "cancel trip error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
