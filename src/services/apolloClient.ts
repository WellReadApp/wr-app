import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Ensure VITE_GRAPH_URL is defined
const graphqlUrl = import.meta.env.VITE_GRAPH_URL;
if (!graphqlUrl) {
  throw new Error('VITE_GRAPH_URL environment variable is required but not defined. Please check your .env file.');
}

const httpLink = createHttpLink({
  uri: graphqlUrl,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Enhanced cache configuration with type policies for better caching
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Cache popular books for 15 minutes
        list_popular_books: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
        // Cache recent books for 10 minutes
        list_recent_books: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
        // Cache search results with pagination
        search_books: {
          keyArgs: ['query'], // Different caches for different search queries
          merge(existing = [], incoming, { args }) {
            if (args?.offset === 0) {
              // New search, replace cache
              return incoming;
            }
            // Pagination, append to existing
            return [...existing, ...incoming];
          },
        },
        // Individual book data - cache indefinitely until manually updated
        get_book: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
        // Book summary pages - cache for a long time
        list_book_summary_pages: {
          keyArgs: ['bookId'],
          merge(_existing, incoming) {
            return incoming;
          },
        },
      },
    },
    // Cache individual book objects
    Book: {
      keyFields: ['id'],
      merge: true,
    },
    // Cache quotes
    Quote: {
      keyFields: ['id'],
      merge: true,
    },
    // Cache key points  
    KeyPoint: {
      keyFields: ['id'],
      merge: true,
    },
    // Cache summary pages
    SummaryPage: {
      keyFields: ['id'],
      merge: true,
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  defaultOptions: {
    watchQuery: {
      // Use cache-first for most queries to improve performance
      fetchPolicy: 'cache-first',
      // Network policy for when cache is empty
      nextFetchPolicy: 'cache-first',
      // Show cached data while refetching
      notifyOnNetworkStatusChange: true,
    },
    query: {
      // Use cache-first with stale-while-revalidate behavior
      fetchPolicy: 'cache-first',
      // Refresh data every 5 minutes automatically
      errorPolicy: 'all',
    },
  },
});

export default client;
