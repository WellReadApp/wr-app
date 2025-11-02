import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayIcon, ClockIcon, ChevronRightIcon } from 'lucide-react';
import { mockBooks, categories, growthPlan } from '../utils/mockData';
const Home = () => {
  const navigate = useNavigate();
  const continueBook = mockBooks[0];
  return <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#333333] mb-1">Good morning</h1>
        <p className="text-gray-500">Ready to grow today?</p>
      </div>
      {/* Continue Learning Card */}
      <div onClick={() => navigate(`/book/${continueBook.id}`)} className="bg-gradient-to-br from-[#F7B8A1] to-[#E87968] rounded-2xl p-5 mb-6 shadow-lg cursor-pointer">
        <div className="flex gap-4">
          <img src={continueBook.cover} alt={continueBook.title} className="w-24 h-32 rounded-lg object-cover shadow-md" />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-white/90 text-xs font-medium mb-1">
                CONTINUE LEARNING
              </p>
              <h3 className="text-white font-bold text-lg mb-1">
                {continueBook.title}
              </h3>
              <p className="text-white/90 text-sm">{continueBook.author}</p>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 text-xs font-medium">
                  {continueBook.progress}% complete
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2 mb-3">
                <div className="bg-white rounded-full h-2 transition-all" style={{
                width: `${continueBook.progress}%`
              }} />
              </div>
              <button className="w-full bg-white text-[#E87968] font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 shadow-md">
                <PlayIcon size={18} fill="currentColor" />
                Resume Reading
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Growth Plan Tracker */}
      <div onClick={() => navigate('/growth-plan')} className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100 cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">
              YOUR GROWTH JOURNEY
            </p>
            <h3 className="text-[#333333] font-bold text-lg">
              {growthPlan.currentMilestone}
            </h3>
          </div>
          <ChevronRightIcon className="text-[#E87968]" size={24} />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {growthPlan.completedBooks} of {growthPlan.totalBooks} books
          </span>
          <span className="text-sm font-semibold text-[#E87968]">
            {growthPlan.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-gradient-to-r from-[#F7B8A1] to-[#E87968] rounded-full h-3 transition-all" style={{
          width: `${growthPlan.progress}%`
        }} />
        </div>
      </div>
      {/* For You Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#333333]">For You</h2>
          <button className="text-[#E87968] text-sm font-semibold">
            See all
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {mockBooks.slice(1).map(book => <div key={book.id} onClick={() => navigate(`/book/${book.id}`)} className="flex-shrink-0 w-36 cursor-pointer">
              <img src={book.cover} alt={book.title} className="w-full h-48 rounded-xl object-cover shadow-md mb-3" />
              <h4 className="font-semibold text-sm text-[#333333] mb-1 line-clamp-2">
                {book.title}
              </h4>
              <p className="text-xs text-gray-500 mb-2">{book.author}</p>
              <div className="flex items-center gap-1 text-[#E87968]">
                <ClockIcon size={12} />
                <span className="text-xs font-medium">{book.readTime}</span>
              </div>
            </div>)}
        </div>
      </div>
      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#333333] mb-4">
          Popular Topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => <button key={category} className="px-4 py-2 bg-white border border-[#F7B8A1] text-[#333333] rounded-full text-sm font-medium hover:bg-[#F7B8A1] hover:text-white transition-colors">
              {category}
            </button>)}
        </div>
      </div>
      {/* Recently Added */}
      <div>
        <h2 className="text-xl font-bold text-[#333333] mb-4">
          Recently Added
        </h2>
        <div className="space-y-3">
          {mockBooks.map(book => <div key={book.id} onClick={() => navigate(`/book/${book.id}`)} className="flex gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
              <img src={book.cover} alt={book.title} className="w-16 h-24 rounded-lg object-cover" />
              <div className="flex-1">
                <h4 className="font-semibold text-[#333333] mb-1">
                  {book.title}
                </h4>
                <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-[#E87968]">
                    <ClockIcon size={12} />
                    {book.readTime}
                  </span>
                  <span className="px-2 py-1 bg-[#F7B8A1]/20 text-[#E87968] rounded-full font-medium">
                    {book.category}
                  </span>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default Home;