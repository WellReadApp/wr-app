import { useNavigate } from 'react-router-dom';
import { PlayIcon, BookOpenIcon } from 'lucide-react';
import { mockBooks, categories, growthPlan } from '../utils/mockData';
import { useQuery } from '@apollo/client/react';
import { LIST_RECENT_BOOKS, LIST_POPULAR_BOOKS } from '../services/bookQueries';
import { useScrollToTop } from '../utils/useScrollToTop';

interface RecentBooksData {
  list_recent_books: Array<{
    id: string;
    title: string | null;
    primary_author_name: string | null;
    picture_url: string | null;
  }>;
}

interface PopularBooksData {
  list_popular_books: Array<{
    id: string;
    title: string | null;
    primary_author_name: string | null;
    picture_url: string | null;
  }>;
}

interface RecentBooksVars { limit?: number; offset?: number }
const Home = () => {
  const navigate = useNavigate();
  const continueBook = mockBooks[0];
  
  // Scroll to top when navigating to this page
  useScrollToTop();
  
  const { data: recentData, loading: recentLoading, error: recentError } = useQuery<RecentBooksData, RecentBooksVars>(LIST_RECENT_BOOKS, {
    variables: { limit: 15, offset: 0 },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
    // Refetch every 10 minutes
    pollInterval: 10 * 60 * 1000,
  });

  const { data: popularData, loading: popularLoading, error: popularError } = useQuery<PopularBooksData, RecentBooksVars>(LIST_POPULAR_BOOKS, {
    variables: { limit: 10, offset: 0 },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
    // Refetch every 15 minutes
    pollInterval: 15 * 60 * 1000,
  });
  return <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#333333] mb-1">WellRead</h1>
        <p className="text-gray-500">Ready to grow today?</p>
      </div>
      {/* Continue Learning Card */}
      <div onClick={() => navigate(`/book/${continueBook.id}`)} className="bg-gradient-to-br from-[#F7B8A1] to-[#E87968] rounded-2xl p-5 mb-6 shadow-lg cursor-pointer">
        <div className="flex gap-4">
          <img src={continueBook.cover} alt={continueBook.title} className="w-24 h-32 rounded-lg object-cover shadow-md" />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-white/90 text-xs font-medium mb-1">
                CONTINUE LEARNING
              </p>
              <h3 className="text-white font-bold text-lg mb-1">
                {continueBook.title}
              </h3>
              <p className="text-white/90 text-sm">{continueBook.author}</p>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 text-xs font-medium">
                  {continueBook.progress}% complete
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2 mb-3">
                <div className="bg-white rounded-full h-2 transition-all" style={{
                width: `${continueBook.progress}%`
              }} />
              </div>
              <button className="w-full bg-white text-[#E87968] font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 shadow-md">
                <PlayIcon size={18} fill="currentColor" />
                Resume Reading
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Growth Journey Tracker */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
        <div className="mb-3">
          <h3 className="text-[#333333] font-bold text-lg">
            Your Growth Journey
          </h3>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {growthPlan.completedBooks} of {growthPlan.totalBooks} books
          </span>
          <span className="text-sm font-semibold text-[#E87968]">
            {growthPlan.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-gradient-to-r from-[#F7B8A1] to-[#E87968] rounded-full h-3 transition-all" style={{
          width: `${growthPlan.progress}%`
        }} />
        </div>
      </div>
      {/* For You Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#333333]">For You</h2>
          <button className="text-[#E87968] text-sm font-semibold">
            More
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {popularLoading && <p className="text-sm text-gray-500">Loading…</p>}
          {popularError && <p className="text-sm text-red-500">Failed to load.</p>}
          {!popularLoading && !popularError && popularData?.list_popular_books?.length === 0 && (
            <p className="text-sm text-gray-500">No popular books available.</p>
          )}
          {!popularLoading && !popularError && popularData?.list_popular_books?.map(book => (
            <div
              key={book.id}
              onClick={() => navigate(`/book/${book.id}`)}
              className="flex-shrink-0 w-36 cursor-pointer"
            >
              {book.picture_url ? (
                <img
                  src={book.picture_url}
                  alt={book.title || 'Book'}
                  className="w-full h-48 rounded-xl object-cover shadow-md mb-3"
                />
              ) : (
                <div className="w-full h-48 rounded-xl shadow-md mb-3 bg-gradient-to-br from-[#F7B8A1] to-[#E87968] flex flex-col items-center justify-center">
                  <BookOpenIcon size={32} className="text-white/80 mb-2" />
                  <div className="text-white/70 text-xs font-medium text-center px-2 leading-tight">
                    {book.title || 'Untitled'}
                  </div>
                </div>
              )}
              <h4 className="font-semibold text-sm text-[#333333] mb-1 line-clamp-2">
                {book.title}
              </h4>
              <p className="text-xs text-gray-500 mb-2">{book.primary_author_name}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#333333] mb-4">
          Popular Topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => <button key={category} className="px-4 py-2 bg-white border border-[#F7B8A1] text-[#333333] rounded-full text-sm font-medium hover:bg-[#F7B8A1] hover:text-white transition-colors">
              {category}
            </button>)}
        </div>
      </div>
      {/* Recently Added (real data) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#333333]">Recently Added</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {recentLoading && <p className="text-sm text-gray-500">Loading…</p>}
          {recentError && <p className="text-sm text-red-500">Failed to load.</p>}
          {!recentLoading && !recentError && recentData?.list_recent_books?.length === 0 && (
            <p className="text-sm text-gray-500">No recent books.</p>
          )}
          {!recentLoading && !recentError && recentData?.list_recent_books?.map(book => (
            <div
              key={book.id}
              onClick={() => navigate(`/book/${book.id}`)}
              className="flex-shrink-0 w-36 cursor-pointer"
            >
              {book.picture_url ? (
                <img
                  src={book.picture_url}
                  alt={book.title || 'Book'}
                  className="w-full h-48 rounded-xl object-cover shadow-md mb-3"
                />
              ) : (
                <div className="w-full h-48 rounded-xl shadow-md mb-3 bg-gradient-to-br from-[#F7B8A1] to-[#E87968] flex flex-col items-center justify-center">
                  <BookOpenIcon size={32} className="text-white/80 mb-2" />
                  <div className="text-white/70 text-xs font-medium text-center px-2 leading-tight">
                    {book.title || 'Untitled'}
                  </div>
                </div>
              )}
              <h4 className="font-semibold text-sm text-[#333333] mb-1 line-clamp-2">
                {book.title}
              </h4>
              <p className="text-xs text-gray-500 mb-2">{book.primary_author_name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>;
};
export default Home;