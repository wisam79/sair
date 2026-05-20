import { dataProvider as supabaseDataProvider } from '@refinedev/supabase';
import { supabaseClient } from './supabaseClient';
import type { DataProvider } from '@refinedev/core';

const baseDataProvider = supabaseDataProvider(supabaseClient);

class RefineHttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'RefineHttpError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, RefineHttpError.prototype);
  }
}

function sanitizeError(err: unknown): Error {
  if (err instanceof Error) {
    return err;
  }
  if (typeof err === 'object' && err !== null) {
    const objErr = err as { message?: string; details?: string; status?: number };
    return new RefineHttpError(
      objErr.message || objErr.details || 'An unknown network error occurred',
      objErr.status || 500,
    );
  }
  return new Error(typeof err === 'string' ? err : 'An unknown network error occurred');
}

export const dataProvider: DataProvider = {
  ...baseDataProvider,
  getList: async (params) => {
    try {
      return await baseDataProvider.getList(params);
    } catch (error) {
      throw sanitizeError(error);
    }
  },
  getOne: async (params) => {
    try {
      return await baseDataProvider.getOne(params);
    } catch (error) {
      throw sanitizeError(error);
    }
  },
  getMany: baseDataProvider.getMany
    ? async (params) => {
        try {
          return await baseDataProvider.getMany(params);
        } catch (error) {
          throw sanitizeError(error);
        }
      }
    : undefined,
  create: async (params) => {
    try {
      return await baseDataProvider.create(params);
    } catch (error) {
      throw sanitizeError(error);
    }
  },
  update: async (params) => {
    try {
      return await baseDataProvider.update(params);
    } catch (error) {
      throw sanitizeError(error);
    }
  },
  deleteOne: async (params) => {
    try {
      return await baseDataProvider.deleteOne(params);
    } catch (error) {
      throw sanitizeError(error);
    }
  },
  custom: baseDataProvider.custom
    ? async (params) => {
        try {
          return await baseDataProvider.custom(params);
        } catch (error) {
          throw sanitizeError(error);
        }
      }
    : undefined,
};
