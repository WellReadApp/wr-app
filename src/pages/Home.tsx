import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppBar } from '../components/Layout/AppBar';
import { BottomNavigation } from '../components/Layout/BottomNavigation';
import { BookCoverCard } from '../components/BookCoverCard';
import { ProgressBar } from '../components/ProgressBar';
import { books, growthPlan } from '../utils/mockData';
import { FlameIcon } from 'lucide-react';
export const Home: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'home';
  return <div className="min-h-screen bg-background pb-16">
      <AppBar title="WellRead" showNotification={true} showProfile={true} />
      {activeTab === 'home' ? <HomeTab /> : <PlanTab />}
      <BottomNavigation />
    </div>;
};
const HomeTab: React.FC = () => {
  return <div className="mobile-scrollbar overflow-y-auto pb-16">
      {/* Gamification Header Card */}
      <div className="bg-surface m-4 p-5 rounded-xl shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Your Reading Streak</h3>
            <div className="flex items-baseline mt-1">
              <span className="text-3xl font-bold">12</span>
              <span className="text-text-secondary ml-1">days</span>
            </div>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full">
            <FlameIcon size={24} className="text-accent" />
          </div>
        </div>
        <p className="text-text-secondary mt-3">Total Points: 450</p>
      </div>
      {/* Recommended for You Section */}
      <section className="mt-6 px-4">
        <h2 className="text-lg font-semibold mb-3">Recommended for You</h2>
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 mobile-scrollbar">
          {books.map(book => <BookCoverCard key={book.id} id={book.id} cover={book.cover} title={book.title} author={book.author} />)}
        </div>
      </section>
      {/* Your Growth Plan Section */}
      <section className="mt-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Your Growth Plan</h2>
          <button className="text-primary text-sm">View Full Plan</button>
        </div>
        <div className="bg-surface rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <img src={books.find(b => b.id === growthPlan[0].id)?.cover} alt="Current book" className="w-12 h-16 object-cover rounded" />
            <div className="ml-3 flex-1">
              <h3 className="font-medium">
                {books.find(b => b.id === growthPlan[0].id)?.title}
              </h3>
              <p className="text-sm text-text-secondary">
                {books.find(b => b.id === growthPlan[0].id)?.author}
              </p>
              <div className="mt-2">
                <ProgressBar progress={growthPlan[0].progress} />
                <div className="flex justify-between text-xs mt-1">
                  <span>{growthPlan[0].progress}% complete</span>
                  <span>15 min left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Trending Now Section */}
      <section className="mt-6 px-4">
        <h2 className="text-lg font-semibold mb-3">Trending Now</h2>
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 mobile-scrollbar">
          {[...books].reverse().map(book => <BookCoverCard key={book.id} id={book.id} cover={book.cover} title={book.title} author={book.author} />)}
        </div>
      </section>
    </div>;
};
const PlanTab: React.FC = () => {
  return <div className="p-4 mobile-scrollbar overflow-y-auto pb-16">
      <h2 className="text-xl font-bold mb-4">Your Personalized Growth Plan</h2>
      <p className="text-text-secondary mb-6">
        Follow this curated reading journey to achieve your goals.
      </p>
      {growthPlan.map((item, index) => {
      const book = books.find(b => b.id === item.id);
      return <div key={item.id} className="relative mb-8 last:mb-0">
            {index < growthPlan.length - 1 && <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200 -z-10"></div>}
            <div className="flex">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.progress > 0 ? 'bg-accent text-white' : 'bg-gray-200'}`}>
                  {item.progress === 100 ? <span>✓</span> : <span>{index + 1}</span>}
                </div>
              </div>
              <div className="ml-4 bg-surface p-4 rounded-lg shadow-sm flex-1">
                <div className="flex items-center">
                  <img src={book?.cover} alt={book?.title} className="w-12 h-16 object-cover rounded" />
                  <div className="ml-3">
                    <h3 className="font-medium">{book?.title}</h3>
                    <p className="text-sm text-text-secondary">
                      {book?.author}
                    </p>
                    {item.progress > 0 ? <div className="mt-2 w-full">
                        <ProgressBar progress={item.progress} />
                        <div className="flex justify-between text-xs mt-1">
                          <span>{item.progress}% complete</span>
                        </div>
                      </div> : <button className="mt-2 text-sm text-primary">
                        Start Reading
                      </button>}
                  </div>
                </div>
              </div>
            </div>
          </div>;
    })}
    </div>;
};