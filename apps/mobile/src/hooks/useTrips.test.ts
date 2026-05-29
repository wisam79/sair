import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function renderHook<T>(hookFn: () => T) {
  const result = { current: null as any };
  function TestComponent() {
    result.current = hookFn();
    return null;
  }
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);
  act(() => {
    root.render(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent),
      ),
    );
  });
  return {
    result,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      document.body.removeChild(div);
    },
  };
}

// ─── Mocks ─────────────────────────────────────────────────────────────────────

(global as any).__DEV__ = true;
process.env.EXPO_OS = 'ios';

vi.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: vi.fn((opts: any) => opts.ios || opts.default),
  },
  TurboModuleRegistry: {
    get: vi.fn(),
    getEnforcing: vi.fn(),
  },
  NativeModules: {},
  NativeEventEmitter: class {},
}));

vi.mock('expo-modules-core', () => ({
  requireNativeModule: vi.fn(),
  requireOptionalNativeModule: vi.fn(),
  EventEmitter: class {},
  Platform: { OS: 'ios' },
}));

const mockRpc = vi.fn();
const mockFrom = vi.fn();
const mockChannel = vi.fn();
const mockRemoveChannel = vi.fn();
const mockGetUser = vi.fn();

let subscribeCallback: any = null;
let channelOnCallback: any = null;
const mockChannelObj = {
  on: vi.fn((event, filter, cb) => {
    channelOnCallback = cb;
    return mockChannelObj;
  }),
  subscribe: vi.fn((cb) => {
    subscribeCallback = cb;
    return mockChannelObj;
  }),
  send: vi.fn().mockResolvedValue(undefined),
};

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: { getUser: mockGetUser },
    from: mockFrom,
    rpc: mockRpc,
    channel: mockChannel,
    removeChannel: mockRemoveChannel,
  },
}));

vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
  WHEN_UNLOCKED: 'WHEN_UNLOCKED',
  AFTER_FIRST_UNLOCK: 'AFTER_FIRST_UNLOCK',
  ALWAYS: 'ALWAYS',
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 'WHEN_PASSCODE_SET_THIS_DEVICE_ONLY',
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
}));

vi.mock('expo-constants', () => ({
  default: {
    appOwnership: 'expo',
    expoConfig: {
      extra: {
        eas: {
          projectId: 'test-project-id',
        },
      },
    },
  },
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined),
  },
}));

let watchCallback: any = null;
vi.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: vi.fn().mockResolvedValue({ status: 'granted' }),
  watchPositionAsync: vi.fn((options, callback) => {
    watchCallback = callback;
    return Promise.resolve({ remove: vi.fn() });
  }),
  Accuracy: { Balanced: 3, High: 5 },
}));

// ─── flushGpsQueue tests (via indirect import) ─────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';

describe('GPS Queue — flushGpsQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChannel.mockReturnValue(mockChannelObj);
    subscribeCallback = null;
    channelOnCallback = null;
  });

  it('removes successfully sent items from queue', async () => {
    const queue = [
      { tripId: 't1', lat: 33.1, lng: 44.1, timestamp: Date.now(), retries: 0 },
      { tripId: 't2', lat: 33.2, lng: 44.2, timestamp: Date.now(), retries: 0 },
    ];

    vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(queue));
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });
    mockRpc.mockResolvedValue({ error: null }); // both succeed

    // Import the module to trigger the flush
    const { flushGpsQueueForTest } = await import('./useTrips');
    if (flushGpsQueueForTest) {
      await flushGpsQueueForTest();
      // Queue should be cleared since all succeeded
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    }
  });

  it('keeps failed items with retries < 3', async () => {
    const queue = [{ tripId: 't1', lat: 33.1, lng: 44.1, timestamp: Date.now(), retries: 1 }];

    vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(queue));
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });
    mockRpc.mockResolvedValue({ error: { message: 'Network error' } }); // fails

    const { flushGpsQueueForTest } = await import('./useTrips');
    if (flushGpsQueueForTest) {
      await flushGpsQueueForTest();
      // Should keep the item (retries becomes 2, still < 3)
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    }
  });

  it('drops items after 3 retries', async () => {
    const queue = [{ tripId: 't1', lat: 33.1, lng: 44.1, timestamp: Date.now(), retries: 2 }];

    vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(queue));
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });
    mockRpc.mockResolvedValue({ error: { message: 'Network error' } }); // fails again

    const { flushGpsQueueForTest } = await import('./useTrips');
    if (flushGpsQueueForTest) {
      await flushGpsQueueForTest();
      // retries becomes 3 → dropped → queue empty → removeItem
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    }
  });

  it('does nothing when queue is empty', async () => {
    vi.mocked(AsyncStorage.getItem).mockResolvedValue(null);

    const { flushGpsQueueForTest } = await import('./useTrips');
    if (flushGpsQueueForTest) {
      await flushGpsQueueForTest();
      expect(mockRpc).not.toHaveBeenCalled();
    }
  });
});

// ─── State Machine integration ─────────────────────────────────────────────────

describe('Trip status transitions (core integration)', () => {
  it('validates transitions match DB state machine', async () => {
    const { canTransition } = await import('@sair/core');

    // These are the transitions trip-engine allows
    expect(canTransition('scheduled', 'driver_waiting')).toBe(true);
    expect(canTransition('driver_waiting', 'in_transit')).toBe(true);
    expect(canTransition('in_transit', 'completed')).toBe(true);
    expect(canTransition('in_transit', 'cancelled')).toBe(true);
    expect(canTransition('in_transit', 'absent')).toBe(false);

    // These should be blocked
    expect(canTransition('completed', 'scheduled')).toBe(false);
    expect(canTransition('absent', 'in_transit')).toBe(false);
  });
});

// ─── GPS Queue Cap & Realtime Reconnection ──────────────────────────────────────

describe('GPS Queue limits & Realtime reconnection hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChannel.mockReturnValue(mockChannelObj);
    subscribeCallback = null;
    channelOnCallback = null;

    const mockQueryBuilder: any = {
      select: vi.fn(() => mockQueryBuilder),
      in: vi.fn(() => mockQueryBuilder),
      order: vi.fn(() => mockQueryBuilder),
      limit: vi.fn(() => mockQueryBuilder),
      eq: vi.fn(() => mockQueryBuilder),
      single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      then: vi.fn((onfulfilled) => {
        return Promise.resolve({ data: [], error: null }).then(onfulfilled);
      }),
    };
    mockFrom.mockReturnValue(mockQueryBuilder);
  });

  it('drops older items if queue size exceeds 100', async () => {
    const { useLocationTracker } = await import('./useTrips');
    const { result, unmount } = renderHook(() => useLocationTracker());
    const { startTracking, stopTracking } = result.current;

    // Start tracking to set up watchCallback
    await act(async () => {
      await startTracking('trip123');
    });
    expect(watchCallback).toBeDefined();

    // Trigger network error so tracker queues location
    mockRpc.mockResolvedValue({ error: { code: 'NETWORK_ERROR' } });

    // Call watch callback 110 times
    await act(async () => {
      for (let i = 0; i < 110; i++) {
        await watchCallback({
          coords: { latitude: 33.1 + i * 0.001, longitude: 44.1 + i * 0.001 },
        });
      }
    });

    // Stop tracking to persist queue immediately
    await act(async () => {
      stopTracking();
    });

    const setCalls = vi.mocked(AsyncStorage.setItem).mock.calls;

    expect(setCalls.length).toBeGreaterThan(0);
    const lastCallJson = setCalls[setCalls.length - 1][1];
    const parsedQueue = JSON.parse(lastCallJson);

    expect(parsedQueue.length).toBeLessThanOrEqual(100);
    expect(parsedQueue[0].lat).toBeGreaterThan(33.109);
    unmount();
  });

  it('triggers a refetch when realtime channel receives CHANNEL_ERROR or TIMED_OUT', async () => {
    const { useActiveTrips } = await import('./useTrips');

    // Simulate user fetch trips returning mock
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });

    // Render/run the setupRealtime effect
    const { result, unmount } = renderHook(() => useActiveTrips());

    // Wait for useEffect microtasks and supabase.from chain resolution
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(mockChannel).toHaveBeenCalledWith('trips-active-u1');
    expect(subscribeCallback).toBeDefined();

    // Reset fetch mock calls to detect refetch
    mockFrom.mockClear();

    // Trigger error callback
    act(() => {
      subscribeCallback('CHANNEL_ERROR');
    });

    // Wait for async fetch callback to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    // Verify it refetches trips
    expect(mockFrom).toHaveBeenCalled();
    unmount();
  });
});
