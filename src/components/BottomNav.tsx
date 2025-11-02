import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, TrendingUpIcon, SearchIcon, BookmarkIcon, UserIcon } from 'lucide-react';
const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = [{
    path: '/',
    icon: HomeIcon,
    label: 'Home'
  }, {
    path: '/growth-plan',
    icon: TrendingUpIcon,
    label: 'Growth'
  }, {
    path: '/search',
    icon: SearchIcon,
    label: 'Search'
  }, {
    path: '/reading-list',
    icon: BookmarkIcon,
    label: 'Library'
  }, {
    path: '/profile',
    icon: UserIcon,
    label: 'Profile'
  }];
  return <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {tabs.map(({
        path,
        icon: Icon,
        label
      }) => {
        const isActive = location.pathname === path;
        return <button key={path} onClick={() => navigate(path)} className="flex flex-col items-center gap-1 py-2 px-3 transition-colors">
              <Icon size={24} className={isActive ? 'text-[#E87968]' : 'text-gray-400'} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs ${isActive ? 'text-[#E87968] font-semibold' : 'text-gray-400'}`}>
                {label}
              </span>
            </button>;
      })}
      </div>
    </nav>;
};
export default BottomNav;