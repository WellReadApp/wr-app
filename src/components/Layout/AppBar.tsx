import React from 'react';
import { ChevronLeftIcon, BellIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
interface AppBarProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
  showNotification?: boolean;
  showProfile?: boolean;
  rightAction?: React.ReactNode;
}
export const AppBar: React.FC<AppBarProps> = ({
  title,
  showBack = false,
  backTo = '/home',
  showNotification = false,
  showProfile = false,
  rightAction
}) => {
  return <div className="bg-surface p-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center">
        {showBack && <Link to={backTo} className="mr-2">
            <ChevronLeftIcon size={24} />
          </Link>}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center">
        {showNotification && <div className="relative mr-4">
            <BellIcon size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
          </div>}
        {showProfile && <Link to="/profile">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="text-xs">JD</span>
            </div>
          </Link>}
        {rightAction}
      </div>
    </div>;
};