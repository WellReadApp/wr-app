import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BookmarkIcon, ShareIcon, Volume2Icon, StarIcon } from 'lucide-react';
import { mockBooks } from '../utils/mockData';
import AudioPlayer from '../components/AudioPlayer';
import InlineFlashcards from '../components/InlineFlashcards';
const BookDetail = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const book = mockBooks.find(b => b.id === id);
  const [isPlaying, setIsPlaying] = useState(false);
  // Inline flashcards will replace modal approach
  if (!book) return null;
  const handleStartReading = () => {
    navigate(`/book/${id}/read`);
  };
  const handleStartListening = () => {
    setIsPlaying(true);
  };
  return <div className="max-w-md mx-auto min-h-screen bg-[#FCF8F5] pb-24">
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
      {/* Book Info */}
      <div className="px-4 py-6">
        <div className="flex gap-4 mb-6">
          <img src={book.cover} alt={book.title} className="w-32 h-48 rounded-xl object-cover shadow-lg" />
          <div className="flex-1">
            <span className="inline-block px-3 py-1 bg-[#F7B8A1]/30 text-[#E87968] rounded-full text-xs font-semibold mb-3">
              {book.category}
            </span>
            <h1 className="text-2xl font-bold text-[#333333] mb-2">
              {book.title}
            </h1>
            <p className="text-gray-600 mb-4">{book.author}</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <StarIcon size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-sm font-semibold text-[#333333]">{book.rating}</span>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1 text-[#E87968] font-medium">
                {book.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Volume2Icon size={16} className="text-[#E87968]" />
                {book.listenTime}
              </span>
            </div>
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
            className="flex-1 bg-white border-2 border-[#E87968] text-[#E87968] font-semibold py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Volume2Icon size={18} />
            Listen
          </button>
        </div>
        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#333333] mb-3">
            About this book
          </h3>
          <p className="text-gray-600 leading-relaxed">{book.description}</p>
        </div>
        {/* Key Takeaways */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#333333] mb-3">
            Key Takeaways
          </h3>
          <div className="space-y-3">
            {book.keyTakeaways.map((takeaway, index) => <div key={index} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-600 leading-relaxed">{takeaway}</p>
              </div>)}
          </div>
        </div>
        {/* Inline Flashcards */}
        <InlineFlashcards quotes={book.quotes} />
        {/* Inline flashcards will appear below */}
        {/* Amazon Link */}
        <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 text-gray-600 text-sm">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-4" />
          Buy the Full Book
        </a>
      </div>
      {/* Audio Player */}
      {isPlaying && <AudioPlayer bookTitle={book.title} onClose={() => setIsPlaying(false)} />}
    </div>;
};
export default BookDetail;