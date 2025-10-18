import React, { useState } from 'react';
import { AppBar } from '../components/Layout/AppBar';
import { BottomNavigation } from '../components/Layout/BottomNavigation';
import { StatItem } from '../components/StatItem';
import { books, userProfile } from '../utils/mockData';
import { FlameIcon, TrophyIcon, BookOpenIcon, TicketIcon, BookmarkIcon, GiftIcon } from 'lucide-react';
export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reading-list');
  return <div className="min-h-screen bg-background pb-16">
      <AppBar title="Profile" />
      <div className="p-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-3">
          {userProfile.name.split(' ').map(n => n[0]).join('')}
        </div>
        <h2 className="text-xl font-semibold">{userProfile.name}</h2>
        <p className="text-text-secondary mb-6">Member since May 2023</p>
        <div className="flex justify-between w-full mb-8">
          <StatItem icon={<FlameIcon size={20} className="text-accent" />} value={userProfile.streak} label="Day Streak" />
          <StatItem icon={<TrophyIcon size={20} className="text-primary" />} value={userProfile.points} label="Points" />
          <StatItem icon={<BookOpenIcon size={20} className="text-green-500" />} value={userProfile.booksRead} label="Books Read" />
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="flex border-b">
          <button className={`flex-1 py-3 text-center ${activeTab === 'reading-list' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`} onClick={() => setActiveTab('reading-list')}>
            Reading List
          </button>
          <button className={`flex-1 py-3 text-center ${activeTab === 'growth-plan' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`} onClick={() => setActiveTab('growth-plan')}>
            Growth Plan
          </button>
          <button className={`flex-1 py-3 text-center ${activeTab === 'coupons' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`} onClick={() => setActiveTab('coupons')}>
            Coupons
          </button>
        </div>
        <div className="p-4 mobile-scrollbar overflow-y-auto pb-20">
          {activeTab === 'reading-list' && <div>
              {userProfile.readingList.length > 0 ? userProfile.readingList.map(bookId => {
            const book = books.find(b => b.id === bookId);
            if (!book) return null;
            return <div key={book.id} className="flex items-center p-3 border-b">
                      <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded" />
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-sm text-text-secondary">
                          {book.author}
                        </p>
                      </div>
                      <button className="text-text-secondary">
                        <BookmarkIcon size={18} />
                      </button>
                    </div>;
          }) : <div className="text-center py-10">
                  <BookmarkIcon size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-text-secondary">
                    Your reading list is empty
                  </p>
                  <button className="mt-3 text-primary">Discover Books</button>
                </div>}
            </div>}
          {activeTab === 'growth-plan' && <div className="py-4">
              <h3 className="font-semibold mb-4">
                Your Personal Growth Journey
              </h3>
              <div className="bg-surface rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm text-text-secondary">
                      Current Focus
                    </span>
                    <h4 className="font-medium">Leadership Skills</h4>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded">
                    In Progress
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs mr-3">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-medium">Atomic Habits</p>
                      <p className="text-xs text-text-secondary">
                        Completed on May 15
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-3">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium">Think Again</p>
                      <p className="text-xs text-text-secondary">
                        In progress - 75% complete
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-text flex items-center justify-center text-xs mr-3">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium">Deep Work</p>
                      <p className="text-xs text-text-secondary">
                        Coming up next
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {activeTab === 'coupons' && <div>
              <div className="bg-surface rounded-lg p-4 shadow-sm mb-4">
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                    <GiftIcon size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">25% off any physical book</h3>
                    <p className="text-sm text-text-secondary mb-2">
                      Valid until June 30, 2023
                    </p>
                    <button className="text-xs bg-primary text-white py-1 px-3 rounded">
                      Redeem
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-surface rounded-lg p-4 shadow-sm mb-4">
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                    <TicketIcon size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Free audiobook credit</h3>
                    <p className="text-sm text-text-secondary mb-2">
                      Redeem for any audiobook
                    </p>
                    <button className="text-xs bg-primary text-white py-1 px-3 rounded">
                      Redeem
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg">
                <h3 className="font-medium mb-2">Earn More Rewards</h3>
                <p className="text-sm text-text-secondary mb-3">
                  Complete quizzes and maintain your reading streak to earn
                  points for more rewards!
                </p>
                <div className="flex items-center">
                  <TrophyIcon size={16} className="text-accent mr-2" />
                  <span className="text-sm">
                    <span className="font-medium">{userProfile.points}</span>{' '}
                    points earned so far
                  </span>
                </div>
              </div>
            </div>}
        </div>
      </div>
      <BottomNavigation />
    </div>;
};