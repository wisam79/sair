import { db } from '../index';
import { profilesTable, institutionsTable } from '../schema/users';
import { driversTable } from '../schema/drivers';
import { eq, and, desc, asc, sql, SQL, or, ilike } from 'drizzle-orm';
import type { Profile, InsertProfile } from '../schema/users';
import type { InsertDriver, Driver } from '../schema/drivers';

export interface ProfileWithDriver extends Profile {
  driver?: Driver | null;
}

export const profileRepository = {
  async findAll(limit = 50, offset = 0): Promise<Profile[]> {
    return db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.isDeleted, false))
      .orderBy(desc(profilesTable.createdAt))
      .limit(limit)
      .offset(offset);
  },

  async findAllFiltered(
    limit = 50,
    offset = 0,
    filters?: { search?: string; role?: string; status?: string },
  ): Promise<Profile[]> {
    const conditions = [eq(profilesTable.isDeleted, false)];

    if (filters?.search) {
      conditions.push(
        or(
          ilike(profilesTable.fullName, `%${filters.search}%`),
          ilike(profilesTable.phone, `%${filters.search}%`),
        )!,
      );
    }
    if (filters?.role) {
      conditions.push(eq(profilesTable.role, filters.role as Profile['role']));
    }
    if (filters?.status === 'active') {
      conditions.push(eq(profilesTable.isActivated, true));
    } else if (filters?.status === 'inactive') {
      conditions.push(eq(profilesTable.isActivated, false));
    }

    return db
      .select()
      .from(profilesTable)
      .where(and(...conditions))
      .orderBy(desc(profilesTable.createdAt))
      .limit(limit)
      .offset(offset);
  },

  async countFiltered(filters?: { search?: string; role?: string; status?: string }): Promise<number> {
    const conditions = [eq(profilesTable.isDeleted, false)];

    if (filters?.search) {
      conditions.push(
        or(
          ilike(profilesTable.fullName, `%${filters.search}%`),
          ilike(profilesTable.phone, `%${filters.search}%`),
        )!,
      );
    }
    if (filters?.role) {
      conditions.push(eq(profilesTable.role, filters.role as Profile['role']));
    }
    if (filters?.status === 'active') {
      conditions.push(eq(profilesTable.isActivated, true));
    } else if (filters?.status === 'inactive') {
      conditions.push(eq(profilesTable.isActivated, false));
    }

    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(profilesTable)
      .where(and(...conditions));
    return Number(result?.count ?? 0);
  },

  async findById(id: string): Promise<Profile | undefined> {
    const [result] = await db
      .select()
      .from(profilesTable)
      .where(and(eq(profilesTable.id, id), eq(profilesTable.isDeleted, false)));
    return result;
  },

  async findByPhone(phone: string): Promise<Profile | undefined> {
    const [result] = await db
      .select()
      .from(profilesTable)
      .where(and(eq(profilesTable.phone, phone), eq(profilesTable.isDeleted, false)));
    return result;
  },

  async findByRole(role: Profile['role']): Promise<Profile[]> {
    return db
      .select()
      .from(profilesTable)
      .where(and(eq(profilesTable.role, role), eq(profilesTable.isDeleted, false)))
      .orderBy(desc(profilesTable.createdAt));
  },

  async findAllWithDrivers(): Promise<ProfileWithDriver[]> {
    const results = await db
      .select()
      .from(profilesTable)
      .leftJoin(driversTable, eq(profilesTable.id, driversTable.userId))
      .where(eq(profilesTable.isDeleted, false))
      .orderBy(desc(profilesTable.createdAt));

    return results.map((r) => ({
      ...r.profiles,
      driver: r.drivers || null,
    }));
  },

  async create(data: Omit<InsertProfile, 'isDeleted'>): Promise<Profile> {
    const [result] = await db
      .insert(profilesTable)
      .values({ ...data, isDeleted: false })
      .returning();
    return result;
  },

  async update(id: string, data: Partial<InsertProfile>): Promise<Profile> {
    const [result] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.id, id))
      .returning();
    return result;
  },

  async softDelete(id: string): Promise<void> {
    await db
      .update(profilesTable)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(profilesTable.id, id));
  },

  async count(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(profilesTable)
      .where(eq(profilesTable.isDeleted, false));
    return Number(result?.count ?? 0);
  },
};
