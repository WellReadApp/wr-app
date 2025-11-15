import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon, TrashIcon } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_USER_LIBRARY, REMOVE_FROM_LIBRARY } from '../services/libraryQueries';
import { useAuth } from '../utils/AuthContext';
import { useScrollToTop } from '../utils/useScrollToTop';
import { progressTracker } from '../utils/progressTracker';
interface LibraryBook {
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
}

interface LibraryData {
  get_library: LibraryBook[];
}

const ReadingList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Scroll to top when navigating to this page
  useScrollToTop();

  const { data: libraryData, loading, error } = useQuery<LibraryData>(GET_USER_LIBRARY, {
    skip: !user,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
  });

  const [removeFromLibrary] = useMutation(REMOVE_FROM_LIBRARY);

  const savedBooks = libraryData?.get_library || [];

  // Get combined progress (server + local)
  const getCombinedProgress = (bookId: string, serverProgress: number, status: string) => {
    // If book is completed, always show 100% regardless of local progress
    if (status === 'completed') {
      return 100;
    }
    const localProgress = progressTracker.getProgress(bookId);
    return Math.max(serverProgress || 0, localProgress?.progress || 0);
  };

  const handleRemoveBook = async (bookId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await removeFromLibrary({
        variables: { bookId },
        optimisticResponse: {
          remove_from_library: true
        },
        update(cache) {
          // Optimistically update cache by removing the book
          const existingLibrary = cache.readQuery<LibraryData>({ 
            query: GET_USER_LIBRARY 
          });
          
          if (existingLibrary) {
            cache.writeQuery({
              query: GET_USER_LIBRARY,
              data: {
                get_library: existingLibrary.get_library.filter(
                  book => book.book_id !== bookId
                )
              }
            });
          }
        }
      });
      
      // Reset local progress when removing from library
      progressTracker.resetProgress(bookId);
      
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 text-center mb-6">
            Please log in to view your reading list
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="bg-[#E87968] text-white font-semibold px-6 py-3 rounded-full"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Library</h1>
        </div>
        <p className="text-gray-500">Loading your books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Library</h1>
        </div>
        <p className="text-red-500">Error loading your reading list.</p>
      </div>
    );
  }
  
  return <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#333333] mb-2">Library</h1>
        <p className="text-gray-500">{savedBooks.length} books saved</p>
      </div>
      {/* Empty State */}
      {savedBooks.length === 0 ? <div className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookmarkIcon className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-[#333333] mb-2">
            No saved books yet
          </h3>
          <p className="text-gray-500 text-center mb-6">
            Start building your reading list by bookmarking books you want to
            read
          </p>
          <button onClick={() => navigate('/search')} className="bg-[#E87968] text-white font-semibold px-6 py-3 rounded-full">
            Browse Books
          </button>
        </div> :         <div className="space-y-4">
          {savedBooks.map((bookEntry: LibraryBook) => {
            const book = bookEntry.book;
            const progress = bookEntry.reading_progress;
            const serverProgress = progress?.progress || 0;
            const bookStatus = bookEntry.status || 'want-to-read';
            const progressValue = getCombinedProgress(book.id, serverProgress, bookStatus);
            const isCompleted = bookStatus === 'completed';
            
            return (
              <div key={book.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div onClick={() => navigate(`/book/${book.id}`)} className="flex gap-4 mb-3 cursor-pointer">
                  {book.picture_url ? (
                    <img src={book.picture_url} alt={book.title || 'Book'} className="w-20 h-28 rounded-lg object-cover" />
                  ) : (
                    <div className="w-20 h-28 rounded-lg bg-gray-200 flex items-center justify-center">
                      <BookmarkIcon size={24} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#333333] mb-1">
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                      {book.primary_author_name}
                      {book.primary_author_name && book.first_publish_year && ' • '}
                      {book.first_publish_year}
                    </p>
                    {progressValue > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">
                            {Math.round(progressValue)}% complete
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[#F7B8A1] to-[#E87968] rounded-full h-2 transition-all" 
                            style={{ width: `${progressValue}%` }} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/book/${book.id}/read`, { state: { from: '/library' } })} 
                    className={`flex-1 font-semibold py-2.5 rounded-full ${
                      isCompleted
                        ? 'bg-[#C8E6C9] text-[#2E7D32]'  // Light pastel green for completed
                        : 'bg-[#E87968] text-white'
                    }`}
                  >
                    {isCompleted ? 'Read Again' : 
                     progressValue > 0 ? 'Continue Reading' : 
                     'Start Reading'}
                  </button>
                  <button 
                    onClick={(e) => handleRemoveBook(book.id, e)}
                    className="p-2.5 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>}
    </div>;
};
export default ReadingList;