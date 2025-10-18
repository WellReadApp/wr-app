import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppBar } from '../components/Layout/AppBar';
import { Chip } from '../components/Chip';
import { QuoteCard } from '../components/QuoteCard';
import { books } from '../utils/mockData';
import { BookOpenIcon, PlayCircleIcon, StarIcon, BookmarkIcon, ShoppingCartIcon, MapPinIcon } from 'lucide-react';
export const BookDetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const book = books.find(b => b.id === id);
  if (!book) {
    return <div>Book not found</div>;
  }
  return <div className="min-h-screen bg-background pb-6">
      <AppBar title="" showBack={true} backTo="/home" rightAction={<button className="text-primary">
            <BookmarkIcon size={20} />
          </button>} />
      <div className="mobile-scrollbar overflow-y-auto pb-6">
        <div className="px-4 pt-2 pb-6 flex flex-col items-center">
          <img src={book.cover} alt={`${book.title} cover`} className="w-36 h-52 object-cover rounded-lg shadow-md" />
          <h1 className="text-xl font-bold mt-4 text-center">{book.title}</h1>
          <p className="text-text-secondary">{book.author}</p>
          <div className="flex mt-3 mb-5">
            {book.genres.map(genre => <Chip key={genre} label={genre} />)}
          </div>
          <div className="flex space-x-3 w-full">
            <Link to={`/reader/${book.id}`} className="flex-1 bg-primary text-white py-3 rounded-lg flex items-center justify-center">
              <BookOpenIcon size={18} className="mr-2" />
              <span>Read Summary</span>
            </Link>
            <Link to={`/audio/${book.id}`} className="flex-1 border border-primary text-primary py-3 rounded-lg flex items-center justify-center">
              <PlayCircleIcon size={18} className="mr-2" />
              <span>Listen</span>
            </Link>
          </div>
        </div>
        <div className="bg-surface px-4 py-6">
          <h2 className="text-lg font-semibold mb-3">About this Book</h2>
          <p className="text-text-secondary">{book.summary}</p>
        </div>
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold mb-3">Quotes & Snippets</h2>
          <div className="space-y-4">
            {book.quotes.map((quote, index) => <QuoteCard key={index} quote={quote.quote} attribution={quote.attribution} />)}
          </div>
        </div>
        <div className="bg-surface px-4 py-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">User Reviews</h2>
            <button className="text-primary text-sm">See All</button>
          </div>
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => <StarIcon key={i} size={18} className={i < Math.floor(book.rating) ? 'text-accent fill-accent' : 'text-gray-300'} />)}
            </div>
            <span className="ml-2 font-medium">{book.rating}</span>
            <span className="ml-1 text-text-secondary">/ 5</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex">
              {[...Array(5)].map((_, i) => <StarIcon key={i} size={16} className={i < 5 ? 'text-accent fill-accent' : 'text-gray-300'} />)}
            </div>
            <p className="text-sm mt-2">
              "This book completely changed how I approach habits. The practical
              advice is easy to implement and has made a real difference in my
              life."
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Sarah T. - 2 weeks ago
            </p>
          </div>
        </div>
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold mb-4">Purchase Options</h2>
          <div className="space-y-3">
            <button className="w-full bg-gray-100 text-text py-3 rounded-lg flex items-center justify-center">
              <ShoppingCartIcon size={18} className="mr-2" />
              <span>Buy on Amazon</span>
            </button>
            <button className="w-full bg-gray-100 text-text py-3 rounded-lg flex items-center justify-center">
              <MapPinIcon size={18} className="mr-2" />
              <span>Find in Nearby Stores</span>
            </button>
          </div>
        </div>
      </div>
    </div>;
};