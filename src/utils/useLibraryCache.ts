import { useQuery, useMutation, QueryHookOptions } from '@apollo/client/react';
import { 
  GET_USER_LIBRARY, 
  GET_LAST_READING_BOOK, 
  GET_READING_STATS, 
  GET_LIBRARY_ENTRY,
  GET_PROGRESS,
  ADD_TO_LIBRARY,
  REMOVE_FROM_LIBRARY,
  UPDATE_PROGRESS,
  UPDATE_LIBRARY_STATUS,
  MARK_AS_COMPLETED,
  RESET_PROGRESS
} from '../services/libraryQueries';

// Cache configuration for library queries
const CACHE_CONFIG = {
  // Cache library data for 5 minutes
  LIBRARY_CACHE_TIME: 5 * 60 * 1000,
  // Cache progress data for 2 minutes  
  PROGRESS_CACHE_TIME: 2 * 60 * 1000,
  // Cache stats for 10 minutes
  STATS_CACHE_TIME: 10 * 60 * 1000,
};

// Custom hook for library queries with optimized caching
export const useLibraryCache = () => {
  // Get user library with caching
  const useGetUserLibrary = (options?: QueryHookOptions) => {
    return useQuery(GET_USER_LIBRARY, {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
      pollInterval: CACHE_CONFIG.LIBRARY_CACHE_TIME,
      ...options,
    });
  };

  // Get last reading book with caching
  const useGetLastReadingBook = (options?: QueryHookOptions) => {
    return useQuery(GET_LAST_READING_BOOK, {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
      pollInterval: CACHE_CONFIG.PROGRESS_CACHE_TIME,
      ...options,
    });
  };

  // Get reading stats with caching
  const useGetReadingStats = (options?: QueryHookOptions) => {
    return useQuery(GET_READING_STATS, {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
      pollInterval: CACHE_CONFIG.STATS_CACHE_TIME,
      ...options,
    });
  };

  // Get library entry with caching
  const useGetLibraryEntry = (bookId: string, options?: QueryHookOptions) => {
    return useQuery(GET_LIBRARY_ENTRY, {
      variables: { bookId },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
      skip: !bookId,
      ...options,
    });
  };

  // Get reading progress with caching
  const useGetProgress = (bookId: string, options?: QueryHookOptions) => {
    return useQuery(GET_PROGRESS, {
      variables: { bookId },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
      pollInterval: CACHE_CONFIG.PROGRESS_CACHE_TIME,
      skip: !bookId,
      ...options,
    });
  };

  return {
    useGetUserLibrary,
    useGetLastReadingBook,
    useGetReadingStats,
    useGetLibraryEntry,
    useGetProgress,
  };
};

// Custom hook for library mutations with cache invalidation
export const useLibraryMutations = () => {
  const [addToLibrary] = useMutation(ADD_TO_LIBRARY, {
    refetchQueries: [
      { query: GET_USER_LIBRARY },
      { query: GET_READING_STATS },
      { query: GET_LAST_READING_BOOK },
    ],
    awaitRefetchQueries: false,
    errorPolicy: 'all',
  });

  const [removeFromLibrary] = useMutation(REMOVE_FROM_LIBRARY, {
    refetchQueries: [
      { query: GET_USER_LIBRARY },
      { query: GET_READING_STATS },
      { query: GET_LAST_READING_BOOK },
    ],
    awaitRefetchQueries: false,
    errorPolicy: 'all',
  });

  const [updateProgress] = useMutation(UPDATE_PROGRESS, {
    refetchQueries: [
      { query: GET_LAST_READING_BOOK },
      { query: GET_READING_STATS },
    ],
    awaitRefetchQueries: false,
    errorPolicy: 'all',
  });

  const [updateLibraryStatus] = useMutation(UPDATE_LIBRARY_STATUS, {
    refetchQueries: [
      { query: GET_USER_LIBRARY },
      { query: GET_READING_STATS },
      { query: GET_LAST_READING_BOOK },
    ],
    awaitRefetchQueries: false,
    errorPolicy: 'all',
  });

  const [markAsCompleted] = useMutation(MARK_AS_COMPLETED, {
    refetchQueries: [
      { query: GET_USER_LIBRARY },
      { query: GET_READING_STATS },
      { query: GET_LAST_READING_BOOK },
    ],
    awaitRefetchQueries: false,
    errorPolicy: 'all',
  });

  const [resetProgress] = useMutation(RESET_PROGRESS, {
    refetchQueries: [
      { query: GET_USER_LIBRARY },
      { query: GET_READING_STATS },
    ],
    awaitRefetchQueries: false,
    errorPolicy: 'all',
  });

  return {
    addToLibrary,
    removeFromLibrary,
    updateProgress,
    updateLibraryStatus,
    markAsCompleted,
    resetProgress,
  };
};