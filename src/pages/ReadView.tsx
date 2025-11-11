import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, TypeIcon, CheckCircleIcon } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { LIST_BOOK_SUMMARY_PAGES } from '../services/bookQueries';

interface SummaryPage {
  id: string;
  page_number: number;
  content: string;
}

interface SummaryData {
  list_book_summary_pages: SummaryPage[];
}

interface SummaryVars { bookId: string; }

const ReadView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'small' | 'base' | 'large' | 'xlarge'>('base');

  const { data, loading, error } = useQuery<SummaryData, SummaryVars>(LIST_BOOK_SUMMARY_PAGES, {
    variables: { bookId: id! },
    skip: !id
  });

  const pages = data?.list_book_summary_pages || [];
  const totalPages = pages.length;
  const progress = totalPages ? ((currentPageIndex + 1) / totalPages) * 100 : 0;

  const fontSizes: Record<string, string> = {
    small: 'text-sm',
    base: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  const cycleFont = () => {
    const order: Array<'small' | 'base' | 'large' | 'xlarge'> = ['small', 'base', 'large', 'xlarge'];
    const idx = order.indexOf(fontSize);
    setFontSize(order[(idx + 1) % order.length]);
  };

  const handleMarkAsDone = () => {
    // Navigate back to book detail or home page
    navigate(`/book/${id}`);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FCF8F5]">
      {/* Header */}
      <div className="sticky top-0 bg-[#FCF8F5] z-10 px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeftIcon className="text-[#333333]" size={24} />
          </button>
          <div className="flex gap-2">
            <button onClick={cycleFont} className="p-2">
              <TypeIcon className="text-[#333333]" size={22} />
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#F7B8A1] to-[#E87968] rounded-full h-2 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {loading ? 'Loading…' : totalPages ? `Page ${currentPageIndex + 1} of ${totalPages}` : 'No pages'}
          </span>
          {totalPages > 0 && (
            <span className="text-xs font-semibold text-[#E87968]">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 min-h-[60vh]">
        {error && <p className="text-red-500 text-sm">Failed to load summary.</p>}
        {loading && <p className="text-gray-500">Loading summary…</p>}
        {!loading && !error && totalPages > 0 && (
          <div className={`${fontSizes[fontSize]} text-gray-700 leading-relaxed whitespace-pre-line`}>
            {pages[currentPageIndex].content}
          </div>
        )}
        {!loading && !error && totalPages === 0 && (
          <p className="text-gray-500">No summary pages available.</p>
        )}
      </div>

      {/* Navigation */}
      {totalPages > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <button
              onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
              disabled={currentPageIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold ${currentPageIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#F7B8A1] text-white'}`}
            >
              <ChevronLeftIcon size={20} />
              Previous
            </button>
            {currentPageIndex === totalPages - 1 ? (
              <button
                onClick={handleMarkAsDone}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-[#E87968] text-white hover:shadow-lg transition-all"
              >
                <CheckCircleIcon size={20} />
                Mark as Read
              </button>
            ) : (
              <button
                onClick={() => setCurrentPageIndex(Math.min(totalPages - 1, currentPageIndex + 1))}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-[#E87968] text-white"
              >
                Next
                <ChevronRightIcon size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadView;