import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock @refinedev/supabase ──────────────────────────────────────────────────
const mockBase = {
  getList: vi.fn(),
  getMany: vi.fn(),
  getOne: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  deleteOne: vi.fn(),
  getApiUrl: vi.fn(() => 'https://example.supabase.co'),
  custom: undefined,
};

vi.mock('@refinedev/supabase', () => ({
  dataProvider: () => mockBase,
}));

vi.mock('./supabaseClient', () => ({
  supabaseClient: {},
}));

// Import AFTER mocks
const { dataProvider } = await import('./dataProvider');

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('dataProvider — snake_case → camelCase (getList)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('converts snake_case keys to camelCase in getList', async () => {
    mockBase.getList.mockResolvedValue({
      data: [
        {
          id: '1',
          route_id: 'r1',
          scheduled_at: '2026-01-01T00:00:00Z',
          started_at: null,
          ended_at: null,
          last_lat: 33.3,
          last_lng: 44.4,
          driver_id: 'd1',
        },
      ],
      total: 1,
    });

    const result = await dataProvider.getList({
      resource: 'trips',
      pagination: { current: 1, pageSize: 10 },
    });

    expect(result.data[0]).toMatchObject({
      id: '1',
      route_id: 'r1',
      scheduled_at: '2026-01-01T00:00:00Z',
      started_at: null,
      ended_at: null,
      last_lat: 33.3,
      last_lng: 44.4,
      driver_id: 'd1',
    });
  });

  it('preserves snake_case in nested objects', async () => {
    mockBase.getList.mockResolvedValue({
      data: [
        {
          id: '1',
          student_id: 's1',
          route_id: 'r1',
          start_date: '2026-01-01',
          end_date: '2026-06-01',
        },
      ],
      total: 1,
    });

    const result = await dataProvider.getList({
      resource: 'subscriptions',
      pagination: { current: 1, pageSize: 10 },
    });

    expect(result.data[0]).toMatchObject({
      student_id: 's1',
      route_id: 'r1',
      start_date: '2026-01-01',
      end_date: '2026-06-01',
    });
  });
});

describe('dataProvider — snake_case preservation (create/update)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('preserves snake_case variables on create', async () => {
    mockBase.create.mockResolvedValue({ data: { id: '1' } });

    await dataProvider.create({
      resource: 'trips',
      variables: {
        driver_id: 'd1',
        route_id: 'r1',
        scheduled_at: '2026-01-01T00:00:00Z',
      },
    });

    expect(mockBase.create).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          driver_id: 'd1',
          route_id: 'r1',
          scheduled_at: '2026-01-01T00:00:00Z',
        }),
      }),
    );
  });

  it('preserves snake_case variables on update', async () => {
    mockBase.update.mockResolvedValue({ data: { id: '1' } });

    await dataProvider.update({
      resource: 'routes',
      id: '1',
      variables: {
        available_seats: 10,
        is_active: false,
      },
    });

    expect(mockBase.update).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          available_seats: 10,
          is_active: false,
        }),
      }),
    );
  });
});

describe('dataProvider — getOne', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('preserves snake_case in getOne', async () => {
    mockBase.getOne.mockResolvedValue({
      data: {
        id: '1',
        full_name: 'Ahmed Ali',
        institution_id: 'inst1',
        is_verified: true,
        created_at: '2026-01-01',
      },
    });

    const result = await dataProvider.getOne({ resource: 'profiles', id: '1' });

    expect(result.data).toMatchObject({
      full_name: 'Ahmed Ali',
      is_verified: true,
      institution_id: 'inst1',
      created_at: '2026-01-01',
    });
  });
});

describe('dataProvider — deleteOne', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('preserves snake_case in deleteOne response', async () => {
    mockBase.deleteOne.mockResolvedValue({
      data: {
        id: '1',
        route_id: 'r1',
        deleted_at: '2026-01-01',
      },
    });

    const result = await dataProvider.deleteOne({ resource: 'trips', id: '1' });

    expect(result.data).toMatchObject({
      id: '1',
      route_id: 'r1',
      deleted_at: '2026-01-01',
    });
  });
});

describe('dataProvider — getMany', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('preserves snake_case in getMany', async () => {
    mockBase.getMany.mockResolvedValue({
      data: [
        { id: '1', full_name: 'Ahmed', created_at: '2026-01-01' },
        { id: '2', full_name: 'Sara', created_at: '2026-01-02' },
      ],
    });

    const result = await dataProvider.getMany!({ resource: 'profiles', ids: ['1', '2'] });

    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toMatchObject({
      id: '1',
      full_name: 'Ahmed',
      created_at: '2026-01-01',
    });
  });
});

describe('dataProvider — getApiUrl', () => {
  it('passes through to base getApiUrl', () => {
    expect(dataProvider.getApiUrl()).toBe('https://example.supabase.co');
  });
});

describe('dataProvider — base utilities', () => {
  it('preserves total in getList response', async () => {
    mockBase.getList.mockResolvedValue({
      data: [{ id: '1' }],
      total: 100,
    });

    const result = await dataProvider.getList({
      resource: 'trips',
      pagination: { current: 1, pageSize: 10 },
    });

    expect(result.total).toBe(100);
  });

  it('throws an error for pageSize: 0 or mode: off', async () => {
    await expect(
      dataProvider.getList({
        resource: 'trips',
        pagination: { current: 1, pageSize: 0 },
      }),
    ).rejects.toThrow('Client-side pagination / fetching all records is prohibited');

    await expect(
      dataProvider.getList({
        resource: 'trips',
        pagination: { mode: 'off' },
      }),
    ).rejects.toThrow('Client-side pagination / fetching all records is prohibited');
  });
});
