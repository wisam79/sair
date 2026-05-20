import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Set EXPO_PUBLIC_SUPABASE_URL before importing logger
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';

// Mock fetch before importing logger
const mockFetch = vi.fn().mockResolvedValue({ ok: true });
vi.stubGlobal('fetch', mockFetch);

// Mock __DEV__ global
vi.stubGlobal('__DEV__', true);

import { logger } from './logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logger.clearLogs();
  });

  it('debug logs are added to buffer in dev mode', () => {
    logger.debug('test debug', { key: 'value' });
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('debug');
    expect(logs[0].message).toBe('test debug');
    expect(logs[0].context).toEqual({ key: 'value' });
  });

  it('info logs are added to buffer', () => {
    logger.info('test info');
    const logs = logger.getLogs();
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('test info');
  });

  it('warn logs are added to buffer', () => {
    logger.warn('test warn', { reason: 'network' });
    const logs = logger.getLogs();
    expect(logs[0].level).toBe('warn');
    expect(logs[0].context?.reason).toBe('network');
  });

  it('error logs are added to buffer', () => {
    logger.error('test error', { code: 500 });
    const logs = logger.getLogs();
    expect(logs[0].level).toBe('error');
    expect(logs[0].context?.code).toBe(500);
  });

  it('all log entries have a timestamp', () => {
    logger.info('timestamped');
    const logs = logger.getLogs();
    expect(logs[0].timestamp).toBeTruthy();
    expect(new Date(logs[0].timestamp).getTime()).not.toBeNaN();
  });

  it('buffer does not exceed MAX_BUFFER (100)', () => {
    for (let i = 0; i < 110; i++) {
      logger.info(`message ${i}`);
    }
    const logs = logger.getLogs();
    expect(logs.length).toBeLessThanOrEqual(100);
  });

  it('clearLogs empties the buffer', () => {
    logger.info('one');
    logger.info('two');
    logger.clearLogs();
    expect(logger.getLogs()).toHaveLength(0);
  });

  it('getLogs returns a copy, not the internal array', () => {
    logger.info('original');
    const logs = logger.getLogs();
    logs.push({ level: 'debug', message: 'injected', timestamp: '' });
    expect(logger.getLogs()).toHaveLength(1); // internal unchanged
  });

  it('error calls reportError with fetch', () => {
    logger.error('server error', { code: 500 });
    expect(mockFetch).toHaveBeenCalled();
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[0]).toContain('/functions/v1/log-error');
    expect(callArgs[1].method).toBe('POST');
    const body = JSON.parse(callArgs[1].body);
    expect(body.message).toBe('server error');
    expect(body.level).toBe('error');
  });

  it('reportError handles fetch failure silently', () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'));
    expect(() => logger.error('silent fail')).not.toThrow();
  });
});

describe('Logger — production mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logger.clearLogs();
  });

  it('debug is silenced in production', () => {
    vi.stubGlobal('__DEV__', false);
    const entry = {
      level: 'debug' as const,
      message: 'prod debug',
      timestamp: new Date().toISOString(),
    };
    (logger as any).push(entry);
    const beforeLength = logger.getLogs().length;
    logger.debug('should not appear');
    expect(logger.getLogs()).toHaveLength(beforeLength);
    vi.stubGlobal('__DEV__', true);
  });

  it('info still works in production', () => {
    vi.stubGlobal('__DEV__', false);
    logger.info('prod info');
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('prod info');
    vi.stubGlobal('__DEV__', true);
  });

  it('warn still works in production', () => {
    vi.stubGlobal('__DEV__', false);
    logger.warn('prod warn');
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    vi.stubGlobal('__DEV__', true);
  });

  it('error still works and reports in production', () => {
    vi.stubGlobal('__DEV__', false);
    logger.error('prod error');
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalled();
    vi.stubGlobal('__DEV__', true);
  });
});

describe('Logger — reportError edge cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logger.clearLogs();
  });

  it('does not call fetch when EXPO_PUBLIC_SUPABASE_URL is missing', () => {
    const originalUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete (process.env as Record<string, string>).EXPO_PUBLIC_SUPABASE_URL;
    logger.error('no url error');
    expect(mockFetch).not.toHaveBeenCalled();
    if (originalUrl) {
      (process.env as Record<string, string>).EXPO_PUBLIC_SUPABASE_URL = originalUrl;
    }
  });
});
