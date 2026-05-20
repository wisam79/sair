import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.EXPO_OS = 'ios';

// Mock react-native before importing ErrorBoundary
vi.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
  },
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
  EventEmitter: class {},
  Platform: { OS: 'ios' },
}));

vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
  AFTER_FIRST_UNLOCK: 0,
}));

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDerivedStateFromError', () => {
    it('stores the exact error object passed', () => {
      const mockError = new Error('Test static error');
      const state = ErrorBoundary.getDerivedStateFromError(mockError);

      expect(state.hasError).toBe(true);
      expect(state.error).toBe(mockError);
    });
  });

  describe('handleReset', () => {
    it('resets hasError and error state', () => {
      const instance = new ErrorBoundary({ children: null });
      instance.state = {
        hasError: true,
        error: new Error('Initial error'),
      };

      // Mock setState
      instance.setState = vi.fn((newState) => {
        Object.assign(instance.state, newState);
      });

      instance.handleReset();

      expect(instance.setState).toHaveBeenCalledWith({
        hasError: false,
        error: null,
      });

      expect(instance.state.hasError).toBe(false);
      expect(instance.state.error).toBeNull();
    });
  });

  describe('initial state', () => {
    it('starts with hasError: false, error: null', () => {
      const instance = new ErrorBoundary({ children: null });

      expect(instance.state.hasError).toBe(false);
      expect(instance.state.error).toBeNull();
    });
  });
});
