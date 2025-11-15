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
const SWIPE_THRESHOLD = 60;

const InlineFlashcards: React.FC<InlineFlashcardsProps> = ({ quotes, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goNext = () => {
    setDirection('left');
    setTimeout(() => {
      setCurrentIndex(i => (i + 1) % quotes.length);
      setDirection(null);
    }, 300);
  };

  const goPrevious = () => {
    setDirection('right');
    setTimeout(() => {
      setCurrentIndex(i => (i - 1 + quotes.length) % quotes.length);
      setDirection(null);
    }, 300);
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (direction) return; // Prevent interaction during animation
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX.current !== null && !direction) {
      const deltaX = e.touches[0].clientX - touchStartX.current;
      
      // Prevent swiping right on first quote
      if (currentIndex === 0 && deltaX > 0) {
        setDragOffset(0);
        return;
      }
      
      // Prevent swiping left on last quote
      if (currentIndex === quotes.length - 1 && deltaX < 0) {
        setDragOffset(0);
        return;
      }
      
      setDragOffset(deltaX);
    }
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (direction) return;
    setIsDragging(false);
    
    // Only allow left swipe if not on last quote
    if (dragOffset < -SWIPE_THRESHOLD && currentIndex < quotes.length - 1) {
      goNext();
    } 
    // Only allow right swipe if not on first quote
    else if (dragOffset > SWIPE_THRESHOLD && currentIndex > 0) {
      goPrevious();
    }
    
    touchStartX.current = null;
    setDragOffset(0);
  };

  if (!quotes.length) return null;

  const currentQuote = quotes[currentIndex];
  const prevIndex = (currentIndex - 1 + quotes.length) % quotes.length;
  const nextIndex = (currentIndex + 1) % quotes.length;
  const prevQuote = quotes[prevIndex];
  const nextQuote = quotes[nextIndex];

  // Calculate transforms based on drag or animation state
  const getCardStyle = (position: 'prev' | 'current' | 'next') => {
    if (direction === 'left') {
      // Swiping left - current goes left, next comes in from right
      if (position === 'current') {
        return {
          transform: 'translateX(-100%)',
          opacity: 0,
          zIndex: 10,
        };
      } else if (position === 'next') {
        return {
          transform: 'translateX(0)',
          opacity: 1,
          zIndex: 20,
        };
      }
      return { transform: 'translateX(-100%)', opacity: 0, zIndex: 5 };
    } else if (direction === 'right') {
      // Swiping right - current goes right, prev comes in from left
      if (position === 'current') {
        return {
          transform: 'translateX(100%)',
          opacity: 0,
          zIndex: 10,
        };
      } else if (position === 'prev') {
        return {
          transform: 'translateX(0)',
          opacity: 1,
          zIndex: 20,
        };
      }
      return { transform: 'translateX(100%)', opacity: 0, zIndex: 5 };
    } else if (isDragging) {
      // While dragging
      if (position === 'current') {
        const rotation = dragOffset * 0.02;
        return {
          transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
          opacity: 1,
          zIndex: 30,
        };
      } else if (position === 'next' && dragOffset < 0) {
        // Next card ready but hidden
        return {
          transform: 'translateX(100%)',
          opacity: 0,
          zIndex: 20,
        };
      } else if (position === 'prev' && dragOffset > 0) {
        // Prev card ready but hidden
        return {
          transform: 'translateX(-100%)',
          opacity: 0,
          zIndex: 20,
        };
      }
      return {
        transform: dragOffset < 0 ? 'translateX(100%)' : 'translateX(-100%)',
        opacity: 0,
        zIndex: 5,
      };
    } else {
      // Default state - only show current card
      if (position === 'current') {
        return {
          transform: 'translateX(0)',
          opacity: 1,
          zIndex: 30,
        };
      }
      return {
        transform: position === 'next' ? 'translateX(100%)' : 'translateX(-100%)',
        opacity: 0,
        zIndex: 5,
      };
    }
  };

  const renderCard = (quote: Quote, position: 'prev' | 'current' | 'next') => {
    const style = getCardStyle(position);
    const transition = direction || isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    if (direction) {
      // During animation, use transition
      return (
        <div
          key={`${position}-${quote.text.substring(0, 20)}`}
          className="absolute inset-0 w-full"
          style={{
            ...style,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
              <p className="text-base leading-relaxed mb-4 line-clamp-6">{quote.text}</p>
              {quote.author && (
                <p className="text-sm font-semibold">— {quote.author}</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={`${position}-${quote.text.substring(0, 20)}`}
        className="absolute inset-0 w-full"
        style={{
          ...style,
          transition,
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
            <p className="text-base leading-relaxed mb-4 line-clamp-6">{quote.text}</p>
            {quote.author && (
              <p className="text-sm font-semibold">— {quote.author}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      <div
        className="relative h-[240px] overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ 
          touchAction: 'pan-y',
        }}
      >
        {/* Render all three cards in the stack */}
        {quotes.length > 1 && renderCard(prevQuote, 'prev')}
        {renderCard(currentQuote, 'current')}
        {quotes.length > 1 && renderCard(nextQuote, 'next')}
      </div>
      
      {/* Counter at bottom */}
      <div className="flex justify-center mt-3">
        <span className="text-sm font-medium text-gray-500">
          {currentIndex + 1} / {quotes.length}
        </span>
      </div>
      
      <p className="text-xs text-gray-400 mt-2 text-center">
        {quotes.length > 1 ? 'Swipe left or right to navigate quotes' : 'Only one quote available'}
      </p>
    </div>
  );
};

export default InlineFlashcards;
