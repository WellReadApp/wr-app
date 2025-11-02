import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon, ClockIcon, TrashIcon } from 'lucide-react';
import { mockBooks } from '../utils/mockData';
const ReadingList = () => {
  const navigate = useNavigate();
  const savedBooks = mockBooks.slice(0, 2);
  return <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#333333] mb-2">Reading List</h1>
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
        </div> : <div className="space-y-4">
          {savedBooks.map(book => <div key={book.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div onClick={() => navigate(`/book/${book.id}`)} className="flex gap-4 mb-3 cursor-pointer">
                <img src={book.cover} alt={book.title} className="w-20 h-28 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold text-[#333333] mb-1">
                    {book.title}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                  <div className="flex items-center gap-3 text-xs mb-3">
                    <span className="flex items-center gap-1 text-[#E87968]">
                      <ClockIcon size={12} />
                      {book.readTime}
                    </span>
                    <span className="px-2 py-1 bg-[#F7B8A1]/20 text-[#E87968] rounded-full font-medium">
                      {book.category}
                    </span>
                  </div>
                  {book.progress > 0 && <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">
                          {book.progress}% complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-gradient-to-r from-[#F7B8A1] to-[#E87968] rounded-full h-2 transition-all" style={{
                  width: `${book.progress}%`
                }} />
                      </div>
                    </div>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/book/${book.id}`)} className="flex-1 bg-[#E87968] text-white font-semibold py-2.5 rounded-full">
                  {book.progress > 0 ? 'Continue' : 'Start Reading'}
                </button>
                <button className="p-2.5 bg-gray-100 rounded-full">
                  <TrashIcon size={20} className="text-gray-500" />
                </button>
              </div>
            </div>)}
        </div>}
    </div>;
};
export default ReadingList;