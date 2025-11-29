import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BookmarkIcon, ShareIcon, Volume2Icon } from 'lucide-react';
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
    type: string | null;
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
    book_themes: {
      id: string;
      title: string;
      description: string;
    }[];
    enjoyment_criteria: {
      id: string;
      criteria: string;
      order_index: number | null;
    }[];
    actionable_benefits: {
      id: string;
      benefit: string;
      order_index: number | null;
    }[];
    contrasting_viewpoints: {
      id: string;
      viewpoint: string;
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
  const [activeTab, setActiveTab] = useState<'about' | 'keypoints' | 'quotes'>('about');
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

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
    // Coming soon feature
    setShowComingSoonModal(true);
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
                {book.type && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-[#E87968]/10 text-[#E87968] text-sm font-medium rounded-full">
                      {book.type}
                    </span>
                  </div>
                )}
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

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 py-3 px-4 text-center font-semibold transition-all ${
                    activeTab === 'about'
                      ? 'text-[#E87968] border-b-2 border-[#E87968]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab('keypoints')}
                  className={`flex-1 py-3 px-4 text-center font-semibold transition-all ${
                    activeTab === 'keypoints'
                      ? 'text-[#E87968] border-b-2 border-[#E87968]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Key Points
                </button>
                <button
                  onClick={() => setActiveTab('quotes')}
                  className={`flex-1 py-3 px-4 text-center font-semibold transition-all ${
                    activeTab === 'quotes'
                      ? 'text-[#E87968] border-b-2 border-[#E87968]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Quotes
                </button>
              </div>

              {/* About Tab */}
              {activeTab === 'about' && (
                <div>
                  {/* Description */}
                  {book.description && (
                    <div className="mb-6">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {book.description}
                      </p>
                    </div>
                  )}

                  {/* Enjoyment Criteria */}
                  {book.enjoyment_criteria && book.enjoyment_criteria.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-[#333333] mb-3">
                        You'll enjoy this book if
                      </h3>
                      <div className="space-y-2">
                        {book.enjoyment_criteria.map((item) => (
                          <div key={item.id} className="flex gap-2 items-start">
                            <span className="text-[#E87968] text-xl font-bold mt-0.5">•</span>
                            <p className="text-gray-600 leading-relaxed flex-1">
                              {item.criteria}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actionable Benefits */}
                  {book.actionable_benefits && book.actionable_benefits.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-[#333333] mb-3">
                        This book can help you
                      </h3>
                      <div className="space-y-2">
                        {book.actionable_benefits.map((item) => (
                          <div key={item.id} className="flex gap-2 items-start">
                            <span className="text-[#E87968] text-xl font-bold mt-0.5">•</span>
                            <p className="text-gray-600 leading-relaxed flex-1">
                              {item.benefit}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Book Themes */}
                  {book.book_themes && book.book_themes.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {book.book_themes.map((theme) => (
                          <span 
                            key={theme.id}
                            className="inline-block px-3 py-1.5 bg-[#F7B8A1]/20 text-[#E87968] text-sm font-medium rounded-full border border-[#E87968]/20"
                          >
                            {theme.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Key Points Tab */}
              {activeTab === 'keypoints' && (
                <div>
                  {/* Key Takeaways */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#333333] mb-3">
                      Key Takeaways
                    </h3>
                    {book.key_points.length > 0 ? (
                      <div className="space-y-2">
                        {book.key_points.map((keyPoint) => (
                          <div key={keyPoint.id} className="flex gap-2 items-start">
                            <span className="text-[#E87968] text-xl font-bold mt-0.5">•</span>
                            <p className="text-gray-600 leading-relaxed flex-1">{keyPoint.point}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No key takeaways available for this book.</p>
                      </div>
                    )}
                  </div>

                  {/* Contrasting Viewpoints */}
                  {book.contrasting_viewpoints && book.contrasting_viewpoints.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-[#333333] mb-3">
                        Contrasting Viewpoints
                      </h3>
                      <div className="space-y-2">
                        {book.contrasting_viewpoints.map((item) => (
                          <div key={item.id} className="flex gap-2 items-start">
                            <span className="text-[#E87968] text-xl font-bold mt-0.5">•</span>
                            <p className="text-gray-600 leading-relaxed flex-1">
                              {item.viewpoint}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quotes Tab */}
              {activeTab === 'quotes' && (
                <div>
                  {/* Inline Flashcards */}
                  <div className="mb-6">
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

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#FCF8F5] to-[#FFF5F0] rounded-2xl shadow-2xl max-w-sm w-full p-6 border-2 border-[#F7B8A1]/30">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#F7B8A1] to-[#E87968] rounded-full flex items-center justify-center mb-4">
                <Volume2Icon className="text-white" size={28} />
              </div>
              
              {/* Message */}
              <h3 className="text-xl font-bold text-[#333333] mb-2">
                Coming Soon! 🎧
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Hope you enjoy reading the summaries, stay tuned, we will add the audio version soon :)
              </p>
              
              {/* Close Button */}
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="w-full bg-gradient-to-r from-[#F7B8A1] to-[#E87968] text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;