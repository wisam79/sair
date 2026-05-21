import { vi } from 'vitest';

// Define __DEV__ for expo-modules-core and other React Native dependencies
(globalThis as any).__DEV__ = true;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('react-native', () => ({
  Platform: { OS: 'ios', select: (obj: Record<string, unknown>) => obj.ios ?? obj.default },
}));

// Polyfill TextEncoder/TextDecoder for jsdom environment
if (typeof globalThis.TextEncoder === 'undefined') {
  (globalThis as unknown as Record<string, unknown>).TextEncoder = class TextEncoder {
    encode(input: string) {
      return new Uint8Array([...input].map((c) => c.charCodeAt(0)));
    }
  } as unknown as typeof TextEncoder;
}

if (typeof globalThis.TextDecoder === 'undefined') {
  (globalThis as unknown as Record<string, unknown>).TextDecoder = class TextDecoder {
    decode(bytes: Uint8Array) {
      return String.fromCharCode(...bytes);
    }
  } as unknown as typeof TextDecoder;
}

if (typeof globalThis.crypto === 'undefined') {
  (globalThis as unknown as Record<string, unknown>).crypto = {
    subtle: {
      importKey: vi.fn().mockResolvedValue({}),
      sign: vi.fn().mockResolvedValue(new Uint8Array()),
    },
    randomUUID: () => Math.random().toString(36).substring(2),
  } as unknown as Crypto;
}

if (typeof globalThis.fetch === 'undefined') {
  (globalThis as unknown as Record<string, unknown>).fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  });
}

if (typeof globalThis.AbortController === 'undefined') {
  (globalThis as unknown as Record<string, unknown>).AbortController = class AbortController {
    signal = { aborted: false };
    abort() {
      this.signal.aborted = true;
    }
  } as unknown as typeof AbortController;
}
