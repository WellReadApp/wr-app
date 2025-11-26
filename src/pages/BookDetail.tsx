import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BookmarkIcon, ShareIcon, Volume2Icon, StarIcon } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_BOOK } from '../services/bookQueries';
import { 
  GET_USER_LIBRARY, 
  ADD_TO_LIBRARY, 
  REMOVE_FROM_LIBRARY 
} from '../services/libraryQueries';
import { useAuth } from '../utils/AuthContext';
import AudioPlayer from '../components/AudioPlayer';
import InlineFlashcards from '../components/InlineFlashcards';
import { useScrollToTop } from '../utils/useScrollToTop';
import { progressTracker } from '../utils/progressTracker';

interface BookData {
  get_book: {
    id: string;
    title: string | null;
    primary_author_name: string | null;
    description: string | null;
    picture_url: string | null;
    first_publish_year: number | null;
    readinglog_count: number | null;
    status: string | null;
    library_status: {
      user_id: string;
      book_id: string;
      status: string;
      added_at: string;
      updated_at: string;
    } | null;
    reading_progress: {
      progress: number;
      current_page?: number;
      last_read_at?: string;
    } | null;
    quotes: {
      id: string;
      text: string;
      author: string | null;
      page_number: number | null;
      order_index: number | null;
    }[];
    key_points: {
      id: string;
      point: string;
      order_index: number | null;
    }[];
  };
}

interface BookVars { id: string; }

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [localProgress, setLocalProgress] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  // Scroll to top when navigating to this page or when book ID changes
  useScrollToTop([id]);

  // Check for local progress
  useEffect(() => {
    if (id) {
      const progress = progressTracker.getProgress(id);
      if (progress) {
        setLocalProgress(progress.progress);
      }
    }
  }, [id]);

  const { data, loading, error } = useQuery<BookData, BookVars>(GET_BOOK, {
    variables: { id: id! },
    skip: !id,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
    // Cache book details for a long time since they don't change often
    notifyOnNetworkStatusChange: true,
  });

  // Also query user library to check if book is saved
  const { data: libraryData, loading: libraryLoading } = useQuery(GET_USER_LIBRARY, {
    skip: !user,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  });

  if (!id) return null;

  const book = data?.get_book;

  // Check if book is in library using both methods - but be more careful about loading states
  const isInLibraryFromBook = !!book?.library_status;
  const isInLibraryFromList = (libraryData as any)?.get_library?.some((item: any) => item.book_id === id);
  
  // Only use library list check if it's actually loaded
  const isInLibrary = isInLibraryFromBook || (!libraryLoading && isInLibraryFromList);
  
  const readingProgress = book?.reading_progress;
  const progressPercentage = Math.max(readingProgress?.progress || 0, localProgress);

  // Enhanced debug logging
  console.log('📖 BookDetail state:', {
    bookId: id,
    bookLoading: loading,
    libraryLoading,
    isInLibraryFromBook,
    isInLibraryFromList,
    finalIsInLibrary: isInLibrary,
    userAuthenticated: !!user,
    isSaving,
    hasLibraryData: !!(libraryData as any)?.get_library,
    libraryCount: (libraryData as any)?.get_library?.length || 0
  });

  // Mutations with optimistic updates
  const [addToLibrary] = useMutation(ADD_TO_LIBRARY, {
    optimisticResponse: {
      add_to_library: {
        user_id: user?.id || '',
        book_id: id || '',
        status: 'want-to-read',
        added_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
    update: (cache) => {
      // Immediately update the book cache to show as saved
      if (book) {
        const libraryStatus = {
          user_id: user?.id || '',
          book_id: id || '',
          status: 'want-to-read',
          added_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        cache.writeQuery({
          query: GET_BOOK,
          variables: { id },
          data: {
            get_book: {
              ...book,
              library_status: libraryStatus
            }
          }
        });

        // Also update the library list cache
        try {
          const libraryQuery = cache.readQuery({ query: GET_USER_LIBRARY });
          if (libraryQuery) {
            const newLibraryItem = {
              ...libraryStatus,
              book: {
                id: book.id,
                title: book.title,
                primary_author_name: book.primary_author_name,
                picture_url: book.picture_url,
                first_publish_year: book.first_publish_year,
                __typename: 'Book'
              },
              reading_progress: null,
              __typename: 'Library'
            };

            cache.writeQuery({
              query: GET_USER_LIBRARY,
              data: {
                get_library: [newLibraryItem, ...(libraryQuery as any).get_library]
              }
            });
          }
        } catch (error) {
          console.log('Library cache not available yet:', error);
        }
      }
    },
    onCompleted: () => {
      // Successfully added to library
    },
    onError: (error) => {
      console.error('❌ Error adding to library:', error);
    },
  });
  
  const [removeFromLibrary] = useMutation(REMOVE_FROM_LIBRARY, {
    optimisticResponse: {
      remove_from_library: true,
    },
    update: (cache) => {
      // Immediately update the book cache to show as not saved
      if (book) {
        cache.writeQuery({
          query: GET_BOOK,
          variables: { id },
          data: {
            get_book: {
              ...book,
              library_status: null
            }
          }
        });

        // Also update the library list cache by removing the book
        try {
          const libraryQuery = cache.readQuery({ query: GET_USER_LIBRARY });
          if (libraryQuery) {
            const updatedLibrary = (libraryQuery as any).get_library.filter(
              (item: any) => item.book_id !== id
            );

            cache.writeQuery({
              query: GET_USER_LIBRARY,
              data: {
                get_library: updatedLibrary
              }
            });
          }
        } catch (error) {
          console.log('Library cache not available:', error);
        }
      }
    },
    onCompleted: () => {
      // Successfully removed from library
      progressTracker.resetProgress(id!);
    },
    onError: (error) => {
      console.error('❌ Error removing from library:', error);
    },
  });

  if (!id) return null;
  
  // Debug logging
  console.log('📖 BookDetail:', {
    bookId: id,
    isInLibrary,
    userAuthenticated: !!user,
    isSaving
  });

  const handleSaveToLibrary = async () => {
    if (isSaving) return; // Prevent multiple clicks
    
    console.log('🔄 Starting save operation:', { 
      bookId: id, 
      currentlyInLibrary: isInLibrary,
      operation: isInLibrary ? 'REMOVE' : 'ADD'
    });
    
    setIsSaving(true);

    try {
      if (isInLibrary) {
        console.log('🗑️ Removing from library...');
        const result = await removeFromLibrary({
          variables: { bookId: id },
        });
        console.log('✅ Remove successful:', result);
        // Progress reset happens in onCompleted callback
      } else {
        console.log('➕ Adding to library...');
        const result = await addToLibrary({
          variables: { 
            bookId: id, 
            status: 'want-to-read' 
          },
        });
        console.log('✅ Add successful:', result);
      }
      
      console.log('✅ Save operation completed successfully');
    } catch (error) {
      console.error('❌ Error updating library:', error);
      
      // Show more detailed error information
      if ((error as any).graphQLErrors?.length > 0) {
        console.error('GraphQL errors:', (error as any).graphQLErrors);
      }
      if ((error as any).networkError) {
        console.error('Network error:', (error as any).networkError);
      }
      
      // TODO: Show user-friendly error message
      alert('Failed to update reading list. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartReading = () => {
    // Pass the book detail page as source for navigation back
    navigate(`/book/${id}/read`, { state: { from: `/book/${id}` } });
  };

  const handleStartListening = () => {
    setIsPlaying(true);
  };

  // Get quotes and key points from the main book data
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FCF8F5] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#FCF8F5] z-10 px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeftIcon className="text-[#333333]" size={24} />
        </button>
        <div className="flex gap-2">
          <button className="p-2">
            <ShareIcon className="text-[#333333]" size={22} />
          </button>
          <button 
            onClick={handleSaveToLibrary} 
            disabled={isSaving}
            className={`p-2 transition-all duration-200 ${
              isSaving 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-110 hover:bg-gray-100 rounded-full'
            }`}
          >
            <BookmarkIcon 
              className={`${
                isInLibrary 
                  ? "text-[#E87968] fill-[#E87968]" 
                  : "text-[#333333]"
              } transition-colors duration-200`} 
              size={22} 
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-48 bg-gray-200 rounded-xl animate-pulse mx-auto" />
              <div className="w-3/4 max-w-md space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-sm">Failed to load book.</p>
          </div>
        ) : book ? (
          <>
            {/* Book Info */}
            <div className="flex gap-4 mb-6">
              {book.picture_url && (
                <img 
                  src={book.picture_url} 
                  alt={book.title || 'Book cover'} 
                  className="w-32 h-48 rounded-xl object-cover shadow-lg" 
                />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#333333] mb-2">
                  {book.title}
                </h1>
                <p className="text-gray-600 mb-4">{book.primary_author_name}</p>
                <div className="flex items-center gap-2 mb-3">
                  {book.readinglog_count !== null && (
                    <div className="flex items-center gap-1">
                      <StarIcon size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-sm font-semibold text-[#333333]">
                        {book.readinglog_count} reads
                      </span>
                    </div>
                  )}
                </div>
                {book.first_publish_year && (
                  <div className="text-sm text-gray-500">
                    Published: {book.first_publish_year}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleStartReading}
                className="flex-1 bg-gradient-to-r from-[#F7B8A1] to-[#E87968] text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {progressPercentage >= 100 ? 'Read Again' : 
                 progressPercentage > 0 ? 'Continue Reading' : 
                 'Start Reading'}
              </button>
              <button
                onClick={handleStartListening}
                title="Coming Soon"
                className="flex-1 bg-white border-2 border-[#E87968] text-[#E87968] font-semibold py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Volume2Icon size={18} />
                Listen
              </button>
            </div>

            {/* Description */}
            {book.description && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#333333] mb-3">
                  About this book
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#333333] mb-3">
                Key Takeaways
              </h3>
              {book.key_points.length > 0 ? (
                <div className="space-y-3">
                  {book.key_points.map((keyPoint, index) => (
                    <div key={keyPoint.id} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#E87968] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-600 leading-relaxed">{keyPoint.point}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No key takeaways available for this book.</p>
                </div>
              )}
            </div>

            {/* Inline Flashcards */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#333333] mb-3">
                Flashcard Quotes
              </h3>
              {book.quotes.length > 0 ? (
                <div className="mt-2">
                  <InlineFlashcards quotes={book.quotes.map(quote => ({
                    text: quote.text,
                    author: quote.author || undefined
                  }))} />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No quotes available for this book.</p>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* Audio Player */}
      {isPlaying && book?.title && (
        <AudioPlayer 
          bookTitle={book.title} 
          onClose={() => setIsPlaying(false)} 
        />
      )}
    </div>
  );
};

export default BookDetail;