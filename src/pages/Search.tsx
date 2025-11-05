import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, ClockIcon, XIcon, StarIcon } from 'lucide-react';
import { mockBooks, categories } from '../utils/mockData';
const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#333333] mb-6">Discover</h1>
      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search books, authors, topics..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-full text-[#333333] placeholder-gray-400 focus:outline-none focus:border-[#E87968]" />
        {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <XIcon className="text-gray-400" size={20} />
          </button>}
      </div>
      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#333333] mb-3">Categories</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCategory ? 'bg-[#E87968] text-white' : 'bg-white border border-gray-200 text-[#333333]'}`}>
            All
          </button>
          {categories.map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-[#E87968] text-white' : 'bg-white border border-gray-200 text-[#333333]'}`}>
              {category}
            </button>)}
        </div>
      </div>
      {/* Results */}
      <div>
        <h2 className="text-lg font-bold text-[#333333] mb-3">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Books'}
        </h2>
        {filteredBooks.length === 0 ? <div className="text-center py-12">
            <p className="text-gray-500">No books found</p>
          </div> : <div className="space-y-3">
            {filteredBooks.map(book => <div key={book.id} onClick={() => navigate(`/book/${book.id}`)} className="flex gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
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
                    <span className="flex items-center gap-1">
                      <StarIcon size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-gray-600 font-medium">{book.rating}</span>
                    </span>
                    <span className="px-2 py-1 bg-[#F7B8A1]/20 text-[#E87968] rounded-full font-medium">
                      {book.category}
                    </span>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
};
export default Search;