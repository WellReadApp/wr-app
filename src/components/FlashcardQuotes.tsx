import React, { useState } from 'react';
import { XIcon, ShareIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
interface Quote {
  text: string;
  author: string;
}
interface FlashcardQuotesProps {
  quotes: Quote[];
  onClose: () => void;
}
const FlashcardQuotes: React.FC<FlashcardQuotesProps> = ({
  quotes,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const handleLike = () => {
    if (liked.includes(currentIndex)) {
      setLiked(liked.filter(i => i !== currentIndex));
    } else {
      setLiked([...liked, currentIndex]);
    }
  };
  return <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FCF8F5] rounded-3xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md">
          <XIcon size={20} className="text-[#333333]" />
        </button>
        <h2 className="text-2xl font-bold text-[#333333] mb-6">
          Flashcard Quotes
        </h2>
        {/* Card */}
        <div className="bg-gradient-to-br from-[#F7B8A1] to-[#E87968] rounded-2xl p-8 mb-6 min-h-[300px] flex flex-col justify-center shadow-xl">
          <div className="text-white text-center">
            <p className="text-4xl mb-6">"</p>
            <p className="text-lg leading-relaxed mb-6">
              {quotes[currentIndex].text}
            </p>
            <p className="text-sm font-semibold">
              — {quotes[currentIndex].author}
            </p>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={handleLike} className="p-3 bg-white rounded-full shadow-md">
            <HeartIcon size={24} className={liked.includes(currentIndex) ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
          </button>
          <button className="p-3 bg-white rounded-full shadow-md">
            <ShareIcon size={24} className="text-gray-600" />
          </button>
        </div>
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${currentIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#F7B8A1] text-white'}`}>
            <ChevronLeftIcon size={20} />
            Previous
          </button>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {quotes.length}
          </span>
          <button onClick={() => setCurrentIndex(Math.min(quotes.length - 1, currentIndex + 1))} disabled={currentIndex === quotes.length - 1} className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${currentIndex === quotes.length - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#E87968] text-white'}`}>
            Next
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>
    </div>;
};
export default FlashcardQuotes;