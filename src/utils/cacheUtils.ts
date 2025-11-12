import client from '../services/apolloClient';
import { LIST_POPULAR_BOOKS, LIST_RECENT_BOOKS } from '../services/bookQueries';

/**
 * Cache utilities for managing Apollo Client cache
 */

// Cache durations in milliseconds
export const CACHE_DURATIONS = {
  BOOK_DETAILS: 24 * 60 * 60 * 1000,      // 24 hours - book data rarely changes
  POPULAR_BOOKS: 15 * 60 * 1000,          // 15 minutes - moderate refresh
  RECENT_BOOKS: 10 * 60 * 1000,           // 10 minutes - more frequent updates
  SEARCH_RESULTS: 5 * 60 * 1000,          // 5 minutes - search results can change
  SUMMARY_PAGES: 24 * 60 * 60 * 1000,     // 24 hours - summary content is static
  USER_READING_LIST: 2 * 60 * 1000,       // 2 minutes - user actions change frequently
} as const;

/**
 * Clear specific query from cache
 */
export const clearQueryCache = (queryName: string, variables?: Record<string, any>) => {
  try {
    client.cache.evict({
      fieldName: queryName,
      args: variables || {},
    });
    client.cache.gc(); // Garbage collect orphaned cache entries
  } catch (error) {
    console.warn(`Failed to clear cache for ${queryName}:`, error);
  }
};

/**
 * Clear all book-related caches (useful after user actions that might affect book data)
 */
export const clearBookCaches = () => {
  const queries = [
    'list_popular_books',
    'list_recent_books', 
    'search_books'
  ];
  
  queries.forEach(query => clearQueryCache(query));
};

/**
 * Clear specific book cache (useful when book details are updated)
 */
export const clearBookCache = (bookId: string) => {
  clearQueryCache('get_book', { id: bookId });
  clearQueryCache('list_book_summary_pages', { bookId });
};

/**
 * Refresh a specific query by refetching from network
 */
export const refreshQuery = async (queryName: string, _variables?: Record<string, any>) => {
  try {
    await client.refetchQueries({
      include: [queryName],
    });
    console.log(`Refreshed ${queryName} with fresh data`);
  } catch (error) {
    console.warn(`Failed to refresh ${queryName}:`, error);
  }
};

/**
 * Get cache statistics for debugging
 */
export const getCacheStats = () => {
  const cache = client.cache as any;
  return {
    cacheSize: cache.data?.data ? Object.keys(cache.data.data).length : 0,
    memoryUsage: cache.getMemoryInternals?.() || 'Not available',
  };
};

/**
 * Preload critical data for better UX
 */
export const preloadCriticalData = async () => {
  try {
    // Preload popular and recent books in parallel
    await Promise.all([
      client.query({
        query: LIST_POPULAR_BOOKS,
        variables: { limit: 10, offset: 0 },
        fetchPolicy: 'cache-first',
      }),
      client.query({
        query: LIST_RECENT_BOOKS,
        variables: { limit: 15, offset: 0 },
        fetchPolicy: 'cache-first',
      }),
    ]);
  } catch (error) {
    console.warn('Failed to preload critical data:', error);
  }
};

/**
 * Setup periodic cache refresh for frequently changing data
 */
export const setupCacheRefresh = () => {
  // Refresh popular books every 15 minutes
  setInterval(() => {
    refreshQuery('list_popular_books', { limit: 10, offset: 0 });
  }, CACHE_DURATIONS.POPULAR_BOOKS);

  // Refresh recent books every 10 minutes  
  setInterval(() => {
    refreshQuery('list_recent_books', { limit: 15, offset: 0 });
  }, CACHE_DURATIONS.RECENT_BOOKS);
};

export default {
  clearQueryCache,
  clearBookCaches,
  clearBookCache,
  refreshQuery,
  getCacheStats,
  preloadCriticalData,
  setupCacheRefresh,
  CACHE_DURATIONS,
};