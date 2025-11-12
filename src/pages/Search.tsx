import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { SearchIcon, XIcon, BookOpenIcon } from 'lucide-react';
import { SEARCH_BOOKS, LIST_POPULAR_BOOKS, LIST_RECENT_BOOKS } from '../services/bookQueries';
import { collections, categories } from '../utils/mockData';
import { useScrollToTop } from '../utils/useScrollToTop';

// Types for book data
interface Book {
  id: string;
  title: string;
  primary_author_name: string;
  description?: string;
  picture_url?: string;
  first_publish_year?: number;
  readinglog_count: number;
  status: string;
}

interface SearchVars {
  query: string;
  limit?: number;
  offset?: number;
}

interface ListVars {
  limit?: number;
  offset?: number;
}
const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Scroll to top when navigating to this page
  useScrollToTop();

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch popular books - cache for 15 minutes
  const { data: popularData, loading: popularLoading, error: popularError } = useQuery<{ list_popular_books: Book[] }, ListVars>(LIST_POPULAR_BOOKS, {
    variables: { limit: 10, offset: 0 },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
    // Refetch every 15 minutes
    pollInterval: 15 * 60 * 1000,
  });

  // Fetch recent books - cache for 10 minutes  
  const { data: recentData, loading: recentLoading, error: recentError } = useQuery<{ list_recent_books: Book[] }, ListVars>(LIST_RECENT_BOOKS, {
    variables: { limit: 10, offset: 0 },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
    // Refetch every 10 minutes
    pollInterval: 10 * 60 * 1000,
  });

  // Search books when query is provided - cache search results
  const { data: searchData, loading: searchLoading, error: searchError } = useQuery<{ search_books: Book[] }, SearchVars>(SEARCH_BOOKS, {
    variables: { query: debouncedQuery, limit: 20, offset: 0 },
    skip: !debouncedQuery.trim(),
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
    // Cache search results for 5 minutes
    pollInterval: 5 * 60 * 1000,
  });

  const popularBooks = popularData?.list_popular_books || [];
  const recentBooks = recentData?.list_recent_books || [];
  const searchResults = searchData?.search_books || [];

  // For trending, we'll use popular books as a fallback since trending isn't implemented yet
  const trendingBooks = popularBooks;

  const showDefaultView = !searchQuery;

  // Debug logging
  if (popularError) console.error('Popular books error:', popularError);
  if (recentError) console.error('Recent books error:', recentError);
  if (searchError) console.error('Search error:', searchError);

  // Helper function to render book cover with proper placeholder
  const renderBookCover = (book: Book, className: string = "w-full h-48 rounded-xl object-cover shadow-md mb-3") => {
    if (book.picture_url) {
      return (
        <img
          src={book.picture_url}
          alt={book.title}
          className={className}
        />
      );
    } else {
      return (
        <div className={`${className} bg-gradient-to-br from-[#F7B8A1] to-[#E87968] flex flex-col items-center justify-center`}>
          <BookOpenIcon size={32} className="text-white/80 mb-2" />
          <div className="text-white/70 text-xs font-medium text-center px-2 leading-tight">
            {book.title}
          </div>
        </div>
      );
    }
  };

  return <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#333333] mb-6">Discover</h1>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search books, authors, topics..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-full text-[#333333] placeholder-gray-400 focus:outline-none focus:border-[#E87968]" 
        />
        {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <XIcon className="text-gray-400" size={20} />
          </button>}
      </div>

      {showDefaultView ? (
        <>
          {/* Categories */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#333333] mb-3">Categories</h2>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedCategory(null)} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory ? 'bg-[#E87968] text-white' : 'bg-white border border-gray-200 text-[#333333]'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button 
                  key={category} 
                  onClick={() => setSelectedCategory(category)} 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category ? 'bg-[#E87968] text-white' : 'bg-white border border-gray-200 text-[#333333]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#333333]">Popular</h2>
              <button className="text-[#E87968] text-sm font-semibold">
                More
              </button>
            </div>
            {popularError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Error loading popular books</p>
                <p className="text-xs text-gray-400">{popularError.message}</p>
              </div>
            ) : popularLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-36">
                    <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse mb-3" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                ))}
              </div>
            ) : popularBooks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No popular books found</p>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {popularBooks.slice(0, 10).map(book => (
                  <div key={book.id} onClick={() => navigate(`/book/${book.id}`)} className="flex-shrink-0 w-36 cursor-pointer">
                    {renderBookCover(book)}
                    <h4 className="font-semibold text-sm text-[#333333] mb-1 line-clamp-2">
                      {book.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">{book.primary_author_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#333333]">Latest</h2>
              <button className="text-[#E87968] text-sm font-semibold">
                More
              </button>
            </div>
            {recentLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-36">
                    <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse mb-3" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {recentBooks.slice(0, 10).map(book => (
                  <div key={book.id} onClick={() => navigate(`/book/${book.id}`)} className="flex-shrink-0 w-36 cursor-pointer">
                    {renderBookCover(book)}
                    <h4 className="font-semibold text-sm text-[#333333] mb-1 line-clamp-2">
                      {book.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">{book.primary_author_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#333333]">Trending</h2>
              <button className="text-[#E87968] text-sm font-semibold">
                More
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {trendingBooks.slice(0, 10).map(book => (
                <div key={`trending-${book.id}`} onClick={() => navigate(`/book/${book.id}`)} className="flex-shrink-0 w-36 cursor-pointer">
                  {renderBookCover(book)}
                  <h4 className="font-semibold text-sm text-[#333333] mb-1 line-clamp-2">
                    {book.title}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">{book.primary_author_name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Collections Section - Keep as is since not supported in graph */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#333333]">Collections</h2>
              <button className="text-[#E87968] text-sm font-semibold">
                More
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {collections.map(collection => (
                <div key={collection.id} className="flex-shrink-0 w-36 cursor-pointer">
                  {/* Stacked Books Visual - Mock for now */}
                  <div className="relative w-full h-48 mb-3">
                    <div 
                      className="absolute w-full h-48 bg-[#E87968] rounded-xl shadow-md"
                      style={{ left: '0px', top: '0px', zIndex: 1 }}
                    />
                    <div 
                      className="absolute w-full h-48 bg-[#F7B8A1] rounded-xl shadow-md"
                      style={{ left: '8px', top: '4px', zIndex: 2 }}
                    />
                    <div 
                      className="absolute w-full h-48 bg-[#333333] rounded-xl shadow-md"
                      style={{ left: '16px', top: '8px', zIndex: 3 }}
                    />
                  </div>
                  <h3 className="font-semibold text-sm text-[#333333] mb-1 line-clamp-2">
                    {collection.title}
                  </h3>
                  <p className="text-xs text-gray-500">{collection.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Search Results */
        <div>
          <h2 className="text-lg font-bold text-[#333333] mb-3">
            Results for "{searchQuery}"
          </h2>
          {searchError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">Error searching books</p>
              <p className="text-xs text-gray-400">{searchError.message}</p>
            </div>
          ) : searchLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-16 h-24 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3 mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No books found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map(book => (
                <div key={book.id} onClick={() => navigate(`/book/${book.id}`)} className="flex gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
                  {renderBookCover(book, "w-16 h-24 rounded-lg object-cover")}
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#333333] mb-1">
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">{book.primary_author_name}</p>
                    {book.first_publish_year && (
                      <div className="flex items-center text-xs">
                        <span className="text-gray-600">
                          Published {book.first_publish_year}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>;
};
export default Search;