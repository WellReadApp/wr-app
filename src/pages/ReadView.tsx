import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, TypeIcon } from 'lucide-react';
import { mockBooks } from '../utils/mockData';
const ReadView = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const book = mockBooks.find(b => b.id === id);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState('base');
  if (!book || !book.summary) return null;
  const totalPages = book.summary.pages.length;
  const progress = (currentPage + 1) / totalPages * 100;
  const fontSizes = {
    small: 'text-sm',
    base: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };
  return <div className="max-w-md mx-auto min-h-screen bg-[#FCF8F5]">
      {/* Header */}
      <div className="sticky top-0 bg-[#FCF8F5] z-10 px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeftIcon className="text-[#333333]" size={24} />
          </button>
          <div className="flex gap-2">
            <button onClick={() => {
            const sizes = Object.keys(fontSizes);
            const currentIndex = sizes.indexOf(fontSize);
            const nextIndex = (currentIndex + 1) % sizes.length;
            setFontSize(sizes[nextIndex]);
          }} className="p-2">
              <TypeIcon className="text-[#333333]" size={22} />
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-[#F7B8A1] to-[#E87968] rounded-full h-2 transition-all" style={{
          width: `${progress}%`
        }} />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            Page {currentPage + 1} of {totalPages}
          </span>
          <span className="text-xs font-semibold text-[#E87968]">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-[#333333] mb-6">
          {book.summary.pages[currentPage].title}
        </h2>
        <div className={`${fontSizes[fontSize]} text-gray-700 leading-relaxed whitespace-pre-line`}>
          {book.summary.pages[currentPage].content}
        </div>
      </div>
      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0} className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold ${currentPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#F7B8A1] text-white'}`}>
            <ChevronLeftIcon size={20} />
            Previous
          </button>
          <button onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage === totalPages - 1} className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold ${currentPage === totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#E87968] text-white'}`}>
            Next
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>
    </div>;
};
export default ReadView;