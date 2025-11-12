import { useQuery } from '@apollo/client/react';

/**
 * Enhanced useQuery hook that provides better cache awareness
 * This is a simplified version focused on the caching functionality
 */
export function useQueryWithCache(query: any, options: any = {}) {
  const { 
    data, 
    loading, 
    error, 
    refetch, 
    networkStatus 
  } = useQuery(query, {
    ...options,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // NetworkStatus values from Apollo Client:
  // 1: loading, 2: setVariables, 3: fetchMore, 4: refetch, 6: poll, 7: ready, 8: error
  const fromCache = networkStatus === 7 && !loading;

  return {
    data,
    loading,
    error,
    fromCache,
    refetch,
    networkStatus,
  };
}

export default useQueryWithCache;