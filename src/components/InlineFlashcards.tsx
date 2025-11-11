import React, { useState, useRef } from 'react';

interface Quote {
  text: string;
  author?: string;
}

interface InlineFlashcardsProps {
  quotes: Quote[];
  className?: string;
}

// Simple swipe threshold in pixels
const SWIPE_THRESHOLD = 50;

const InlineFlashcards: React.FC<InlineFlashcardsProps> = ({ quotes, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goNext = () => setCurrentIndex(i => (i + 1) % quotes.length);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX.current !== null) {
      const deltaX = e.touches[0].clientX - touchStartX.current;
      setDragOffset(Math.min(0, deltaX));
    }
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
    if (dragOffset < -SWIPE_THRESHOLD) {
      goNext();
    }
    touchStartX.current = null;
    setDragOffset(0);
  };

  if (!quotes.length) return null;

  // Only show current and next card (peek)
  const currentQuote = quotes[currentIndex];
  const nextIndex = (currentIndex + 1) % quotes.length;
  const nextQuote = quotes.length > 1 ? quotes[nextIndex] : null;

  return (
    <div className={`mt-8 ${className}`}>      
      <h3 className="text-lg font-bold text-[#333333] mb-3">Flashcard Quotes</h3>
      <div
        className="relative h-[240px] overflow-visible"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ 
          touchAction: 'pan-y',
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Current card */}
        <div
          className="absolute inset-0 w-full"
          style={{
            transform: `translateX(${isDragging ? dragOffset * 0.8 : 0}px) rotate(${isDragging ? dragOffset * 0.02 : 0}deg)`,
            zIndex: 40,
            opacity: 1,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div 
            className="bg-gradient-to-br from-[#F7B8A1] to-[#E87968] rounded-2xl p-6 h-full flex flex-col justify-center border border-white/15 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, #F7B8A1 0%, #E87968 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="text-white text-center px-1">
              <p className="text-4xl leading-none mb-2">"</p>
              <p className="text-base leading-relaxed mb-4 line-clamp-6">{currentQuote.text}</p>
              {currentQuote.author && (
                <p className="text-sm font-semibold">— {currentQuote.author}</p>
              )}
            </div>
          </div>
        </div>
        {/* Next card peek */}
        {nextQuote && (
          <div
            className="absolute inset-y-0 right-0 w-1/6 pointer-events-none"
            style={{
              transform: 'translateX(18px) scale(0.92)',
              zIndex: 10,
              opacity: 0.5,
              boxShadow: '0 10px 20px -15px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div 
              className="bg-gradient-to-br from-[#F7B8A1] to-[#E87968] rounded-2xl p-2 h-full flex flex-col justify-center border border-white/10 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, #F7B8A1 0%, #E87968 100%)',
                boxShadow: '0 10px 20px -15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="text-white text-center px-1">
                <p className="text-base leading-relaxed line-clamp-2">{nextQuote.text}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Swipe left to see next quote</p>
    </div>
  );
};

export default InlineFlashcards;
