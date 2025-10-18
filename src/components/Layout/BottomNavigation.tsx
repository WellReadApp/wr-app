import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, UserIcon } from 'lucide-react';
export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  return <div className="bottom-nav">
      <Link to="/home" className={`bottom-nav-item ${path === '/home' ? 'active' : 'inactive'}`}>
        <HomeIcon size={20} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link to="/home?tab=plan" className={`bottom-nav-item ${path.includes('plan') ? 'active' : 'inactive'}`}>
        <BookOpenIcon size={20} />
        <span className="text-xs mt-1">Plan</span>
      </Link>
      <Link to="/profile" className={`bottom-nav-item ${path === '/profile' ? 'active' : 'inactive'}`}>
        <UserIcon size={20} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>;
};