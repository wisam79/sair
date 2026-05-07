import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
  parseAsStringLiteral,
} from 'nuqs/server';

export const userSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(''),
  role: parseAsString,
  status: parseAsString,
  sortBy: parseAsString.withDefault('created_at'),
  sortOrder: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
};

export const routeSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(''),
  status: parseAsString,
  institutionId: parseAsString,
  sortBy: parseAsString.withDefault('created_at'),
  sortOrder: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
};

export const subscriptionSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(''),
  status: parseAsStringLiteral(['active', 'cancelled', 'expired', 'pending'] as const),
  paymentStatus: parseAsStringLiteral(['paid', 'pending', 'failed', 'refunded'] as const),
  planType: parseAsString,
  sortBy: parseAsString.withDefault('created_at'),
  sortOrder: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
};

export const tripSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
  dateFrom: parseAsString,
  dateTo: parseAsString,
  status: parseAsString,
  driverId: parseAsString,
  sortBy: parseAsString.withDefault('created_at'),
  sortOrder: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
};

export const usersSearchParamsCache = createSearchParamsCache(userSearchParams);
export const routesSearchParamsCache = createSearchParamsCache(routeSearchParams);
export const subscriptionsSearchParamsCache = createSearchParamsCache(subscriptionSearchParams);
export const tripsSearchParamsCache = createSearchParamsCache(tripSearchParams);
