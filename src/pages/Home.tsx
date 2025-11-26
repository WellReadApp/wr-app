import { useNavigate } from 'react-router-dom';
import { PlayIcon, BookOpenIcon } from 'lucide-react';
import { categories } from '../utils/mockData';
import { useQuery } from '@apollo/client/react';
import { LIST_RECENT_BOOKS, LIST_POPULAR_BOOKS } from '../services/bookQueries';
import { GET_CURRENT_BOOK, GET_READING_STATS, GET_USER_LIBRARY } from '../services/libraryQueries';
import { useScrollToTop } from '../utils/useScrollToTop';
import { useAuth } from '../utils/AuthContext';
import { progressTracker } from '../utils/progressTracker';

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

interface CurrentBookData {
  get_current_book: {
    user_id: string;
    book_id: string;
    status: string;
    added_at: string;
    updated_at: string;
    book: {
      id: string;
      title: string | null;
      primary_author_name: string | null;
      picture_url: string | null;
      first_publish_year: number | null;
    };
    reading_progress: {
      progress: number;
      current_page?: number;
      last_read_at?: string;
    } | null;
  } | null;
}

interface ReadingStatsData {
  get_reading_stats: {
    booksRead: number;
    totalBooksInList: number;
    progressPercentage: number;
  };
}

interface RecentBooksVars { limit?: number; offset?: number }
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Scroll to top when navigating to this page
  useScrollToTop();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  // Get user's first name from email (before @)
  const getUserFirstName = () => {
    if (!user?.email) return 'Reader';
    const emailName = user.email.split('@')[0];
    // Capitalize first letter
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };
  
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


  // Get all books in user's library
  const { data: libraryData, loading: libraryLoading } = useQuery<any>(GET_USER_LIBRARY, {
    skip: !user,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  // Get current reading book for the continue reading card
  const { data: currentBookData } = useQuery<CurrentBookData>(GET_CURRENT_BOOK, {
    skip: !user,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  // Get reading statistics for the growth journey
  const { data: readingStatsData, loading: readingStatsLoading } = useQuery<ReadingStatsData>(GET_READING_STATS, {
    skip: !user,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  const currentBook = currentBookData?.get_current_book;
  const readingStats = readingStatsData?.get_reading_stats;

  // Reading list books (all saved books)
  const readingListBooks = libraryData?.get_library || [];

  // Growth journey: completed/saved
  const completedBooks = readingListBooks.filter((b: any) => b.status === 'completed').length;
  const savedBooks = readingListBooks.length;
  const growthPercent = savedBooks > 0 ? Math.round((completedBooks / savedBooks) * 100) : 0;

  // Get local progress to supplement server data
  const getProgressForBook = (bookId: string) => {
    const localProgress = progressTracker.getProgress(bookId);
    const serverProgress = currentBook?.reading_progress?.progress || 0;
    return Math.max(localProgress?.progress || 0, serverProgress);
  };

  // Get combined progress (server + local) - same as Reading List
  const getCombinedProgress = (bookId: string, serverProgress: number, status: string) => {
    // If book is completed, always show 100% regardless of local progress
    if (status === 'completed') {
      return 100;
    }
    const localProgress = progressTracker.getProgress(bookId);
    return Math.max(serverProgress || 0, localProgress?.progress || 0);
  };

  const handleContinueReading = () => {
    if (currentBook) {
      // Navigate to reading view to continue from where they left off
      navigate(`/book/${currentBook.book.id}/read`);
    }
  };
  return <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#333333] mb-1">
          {getGreeting()}, {getUserFirstName()}
        </h1>
        <p className="text-gray-500">Ready to grow today?</p>
      </div>
      {/* Reading List Resume Scroll */}
      {readingListBooks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#333333] mb-2">Resume Reading</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {readingListBooks.map((entry: any) => {
              const serverProgress = entry.reading_progress?.progress || 0;
              const bookStatus = entry.status || 'want-to-read';
              const progressValue = getCombinedProgress(entry.book.id, serverProgress, bookStatus);
              const isCompleted = bookStatus === 'completed';
              
              return (
                <div key={entry.book.id} className="flex-shrink-0 w-48 bg-gradient-to-br from-[#F7B8A1] to-[#E87968] rounded-2xl p-4 shadow-lg cursor-pointer" onClick={() => navigate(`/book/${entry.book.id}`)}>
                  {entry.book.picture_url ? (
                    <img
                      src={entry.book.picture_url}
                      alt={entry.book.title || 'Book'}
                      className="w-full h-48 rounded-xl object-cover shadow-md mb-3"
                    />
                  ) : (
                    <div className="w-full h-48 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                      <BookOpenIcon size={32} className="text-white/60" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-sm text-white mb-1 line-clamp-2">{entry.book.title}</h4>
                    <p className="text-xs text-white/80 mb-3">{entry.book.primary_author_name}</p>
                    
                    {progressValue > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-white/90">
                            {Math.round(progressValue)}% complete
                          </span>
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-2">
                          <div 
                            className="bg-white rounded-full h-2 transition-all" 
                            style={{ width: `${progressValue}%` }} 
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center mt-auto">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/book/${entry.book.id}/read`, { state: { from: '/' } });
                        }} 
                        className={`font-semibold py-2 px-4 rounded-full text-xs hover:shadow-md transition-all flex items-center gap-2 w-full justify-center ${
                          isCompleted 
                            ? 'bg-[#C8E6C9] text-[#2E7D32]'  // Light pastel green for completed
                            : 'bg-white text-[#E87968]'
                        }`}
                      >
                        <PlayIcon size={12} fill="currentColor" />
                        {isCompleted ? 'Read Again' : 
                         progressValue > 0 ? 'Continue' : 
                         'Start Reading'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Growth Journey Tracker */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
        <div className="mb-3">
          <h3 className="text-[#333333] font-bold text-lg">
            Your Growth Journey
          </h3>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {savedBooks === 0 ? '0 of 0 books' : `${completedBooks} of ${savedBooks} books`}
          </span>
          <span className="text-sm font-semibold text-[#E87968]">
            {growthPercent}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-[#F7B8A1] to-[#E87968] rounded-full h-3 transition-all" 
            style={{
              width: `${growthPercent}%`
            }} 
          />
        </div>
      </div>
      {/* For You Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#333333]">For You</h2>
        </div>
        {popularLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-36">
                <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse mb-3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        ) : popularError ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Failed to load.</p>
          </div>
        ) : popularData?.list_popular_books?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No popular books available.</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {popularData?.list_popular_books?.map(book => (
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
        )}
      </div>
      {/* Recently Added (real data) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#333333]">Recently Added</h2>
        </div>
        {recentLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-36">
                <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse mb-3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        ) : recentError ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Failed to load.</p>
          </div>
        ) : recentData?.list_recent_books?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent books.</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {recentData?.list_recent_books?.map(book => (
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
        )}
      </div>
    </div>;
};
export default Home;