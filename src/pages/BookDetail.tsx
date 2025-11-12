import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BookmarkIcon, ShareIcon, Volume2Icon, StarIcon } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { GET_BOOK } from '../services/bookQueries';
import AudioPlayer from '../components/AudioPlayer';
import InlineFlashcards from '../components/InlineFlashcards';
import { useScrollToTop } from '../utils/useScrollToTop';

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
  const [isPlaying, setIsPlaying] = useState(false);

  // Scroll to top when navigating to this page or when book ID changes
  useScrollToTop([id]);

  const { data, loading, error } = useQuery<BookData, BookVars>(GET_BOOK, {
    variables: { id: id! },
    skip: !id,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
    // Cache book details for a long time since they don't change often
    notifyOnNetworkStatusChange: true,
  });

  if (!id) return null;

  const handleStartReading = () => {
    navigate(`/book/${id}/read`);
  };

  const handleStartListening = () => {
    setIsPlaying(true);
  };

  // Get quotes and key points from the main book data
  const quotes = data?.get_book?.quotes?.map(quote => ({
    text: quote.text,
    author: quote.author || undefined
  })) || [];

  const keyTakeaways = data?.get_book?.key_points?.map(keyPoint => keyPoint.point) || [];

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
          <button className="p-2">
            <BookmarkIcon className="text-[#333333]" size={22} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {loading && <p className="text-gray-500">Loading book…</p>}
        {error && <p className="text-red-500 text-sm">Failed to load book.</p>}
        
        {data && data.get_book && (
          <>
            {/* Book Info */}
            <div className="flex gap-4 mb-6">
              {data.get_book.picture_url && (
                <img 
                  src={data.get_book.picture_url} 
                  alt={data.get_book.title || 'Book cover'} 
                  className="w-32 h-48 rounded-xl object-cover shadow-lg" 
                />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#333333] mb-2">
                  {data.get_book.title}
                </h1>
                <p className="text-gray-600 mb-4">{data.get_book.primary_author_name}</p>
                <div className="flex items-center gap-2 mb-3">
                  {data.get_book.readinglog_count !== null && (
                    <div className="flex items-center gap-1">
                      <StarIcon size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-sm font-semibold text-[#333333]">
                        {data.get_book.readinglog_count} reads
                      </span>
                    </div>
                  )}
                </div>
                {data.get_book.first_publish_year && (
                  <div className="text-sm text-gray-500">
                    Published: {data.get_book.first_publish_year}
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
                Read
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
            {data.get_book.description && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#333333] mb-3">
                  About this book
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {data.get_book.description}
                </p>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#333333] mb-3">
                Key Takeaways
              </h3>
              {loading ? (
                <p className="text-gray-500">Loading key takeaways...</p>
              ) : error ? (
                <div className="text-red-500">
                  <p>Error loading data: {error.message}</p>
                </div>
              ) : data?.get_book ? (
                keyTakeaways.length > 0 ? (
                  <div className="space-y-3">
                    {keyTakeaways.map((takeaway, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#E87968] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-600 leading-relaxed">{takeaway}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No key takeaways available for this book.</p>
                )
              ) : (
                <p className="text-gray-500">Book not found</p>
              )}
            </div>

            {/* Inline Flashcards */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#333333] mb-3">
                Flashcard Quotes
              </h3>
              {loading ? (
                <p className="text-gray-500">Loading quotes...</p>
              ) : quotes.length > 0 ? (
                <div className="mt-2">
                  <InlineFlashcards quotes={quotes} />
                </div>
              ) : (
                <p className="text-gray-500">No quotes available for this book.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Audio Player */}
      {isPlaying && data?.get_book?.title && (
        <AudioPlayer 
          bookTitle={data.get_book.title} 
          onClose={() => setIsPlaying(false)} 
        />
      )}
    </div>
  );
};

export default BookDetail;