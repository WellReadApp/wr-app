import React from 'react';
import { TrendingUpIcon, CheckCircleIcon, CircleIcon, SparklesIcon } from 'lucide-react';
import { growthPlan } from '../utils/mockData';
import { useScrollToTop } from '../utils/useScrollToTop';
const GrowthPlan = () => {
  // Scroll to top when navigating to this page
  useScrollToTop();

  return <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#333333] mb-2">
          Your Growth Plan
        </h1>
        <p className="text-gray-500">
          Structured learning path to achieve your goals
        </p>
      </div>
      {/* Quiz CTA */}
      <div className="bg-gradient-to-br from-[#F7B8A1] to-[#E87968] rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <SparklesIcon className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-2">
              Personalize Your Journey
            </h3>
            <p className="text-white/90 text-sm mb-4">
              Take our 2-minute quiz to get a customized growth plan tailored to
              your goals
            </p>
            <button className="bg-white text-[#E87968] font-semibold px-6 py-2.5 rounded-full shadow-md">
              Take Growth Quiz
            </button>
          </div>
        </div>
      </div>
      {/* Overall Progress */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#F7B8A1]/20 rounded-full flex items-center justify-center">
            <TrendingUpIcon className="text-[#E87968]" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#333333] text-lg">
              Overall Progress
            </h3>
            <p className="text-sm text-gray-500">
              {growthPlan.completedBooks} of {growthPlan.totalBooks} books
              completed
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
          <div className="bg-gradient-to-r from-[#F7B8A1] to-[#E87968] rounded-full h-4 transition-all flex items-center justify-end pr-2" style={{
          width: `${growthPlan.progress}%`
        }}>
            <span className="text-white text-xs font-bold">
              {growthPlan.progress}%
            </span>
          </div>
        </div>
      </div>
      {/* Milestones */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#333333] mb-4">
          Your Milestones
        </h2>
        <div className="space-y-4">
          {growthPlan.milestones.map((milestone, index) => <div key={milestone.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${milestone.progress > 0 ? 'bg-[#E87968]' : 'bg-gray-200'}`}>
                  {milestone.progress === 100 ? <CheckCircleIcon className="text-white" size={20} /> : <span className="text-white font-bold text-sm">
                      {index + 1}
                    </span>}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#333333] mb-1">
                    {milestone.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {milestone.description}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {milestone.completed} of {milestone.total} completed
                    </span>
                    <span className="text-xs font-semibold text-[#E87968]">
                      {milestone.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#F7B8A1] to-[#E87968] rounded-full h-2 transition-all" style={{
                  width: `${milestone.progress}%`
                }} />
                  </div>
                </div>
              </div>
              <div className="space-y-2 pl-14">
                {milestone.books.map((book, bookIndex) => <div key={bookIndex} className="flex items-center gap-2 text-sm">
                    {bookIndex < milestone.completed ? <CheckCircleIcon size={16} className="text-[#E87968]" /> : <CircleIcon size={16} className="text-gray-300" />}
                    <span className={bookIndex < milestone.completed ? 'text-[#333333]' : 'text-gray-400'}>
                      {book}
                    </span>
                  </div>)}
              </div>
            </div>)}
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-[#E87968] mb-1">1,240</p>
          <p className="text-sm text-gray-500">Minutes Read</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-[#E87968] mb-1">24</p>
          <p className="text-sm text-gray-500">Topics Covered</p>
        </div>
      </div>
    </div>;
};
export default GrowthPlan;