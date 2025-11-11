import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlameIcon, TrophyIcon, SettingsIcon, LogOutIcon, ChevronRightIcon, KeyIcon } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { userStats } from '../utils/mockData';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { useScrollToTop } from '../utils/useScrollToTop';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Scroll to top when navigating to this page
  useScrollToTop();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get user initials
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const displayName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.first_name || user?.email || 'User';

  return <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#333333] mb-2">Profile</h1>
        <p className="text-gray-500">Track your progress and achievements</p>
      </div>
      {/* User Info */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          {user?.picture_url ? (
            <img 
              src={user.picture_url} 
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-[#F7B8A1] to-[#E87968] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {getInitials()}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-[#333333] text-lg">{displayName}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#E87968] mb-1">
              {userStats.booksCompleted}
            </p>
            <p className="text-xs text-gray-500">Books</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#E87968] mb-1">
              {userStats.streak}
            </p>
            <p className="text-xs text-gray-500">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#E87968] mb-1">
              {Math.round(userStats.totalMinutes / 60)}h
            </p>
            <p className="text-xs text-gray-500">Reading Time</p>
          </div>
        </div>
      </div>
      {/* Streak Card */}
      <div className="bg-gradient-to-br from-[#F7B8A1] to-[#E87968] rounded-2xl p-5 mb-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <FlameIcon className="text-white" size={32} fill="white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-2xl mb-1">
              {userStats.streak} Days
            </h3>
            <p className="text-white/90 text-sm">
              Keep your streak alive! Read today to continue
            </p>
          </div>
        </div>
      </div>
      {/* Bonus Points */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-[#333333] text-lg mb-1">
              Bonus Points
            </h3>
            <p className="text-sm text-gray-500">
              {userStats.pointsToNext} points to {userStats.nextMilestone}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#E87968]">
              {userStats.bonusPoints}
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-gradient-to-r from-[#F7B8A1] to-[#E87968] rounded-full h-3 transition-all" style={{
          width: `${userStats.bonusPoints / (userStats.bonusPoints + userStats.pointsToNext) * 100}%`
        }} />
        </div>
      </div>
      {/* Badges */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#333333] mb-4">Achievements</h2>
        <div className="grid grid-cols-3 gap-3">
          {userStats.badges.map(badge => <div key={badge.id} className={`bg-white rounded-xl p-4 shadow-sm border text-center ${badge.earned ? 'border-[#E87968]' : 'border-gray-100 opacity-50'}`}>
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className="text-xs font-medium text-[#333333]">{badge.name}</p>
            </div>)}
        </div>
      </div>
      {/* Menu Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <button className="w-full flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <SettingsIcon className="text-gray-600" size={20} />
            <span className="text-[#333333] font-medium">Settings</span>
          </div>
          <ChevronRightIcon className="text-gray-400" size={20} />
        </button>
        <button 
          onClick={() => setShowChangePassword(true)}
          className="w-full flex items-center justify-between p-4 border-b border-gray-100"
        >
          <div className="flex items-center gap-3">
            <KeyIcon className="text-gray-600" size={20} />
            <span className="text-[#333333] font-medium">Change Password</span>
          </div>
          <ChevronRightIcon className="text-gray-400" size={20} />
        </button>
        <button className="w-full flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <TrophyIcon className="text-gray-600" size={20} />
            <span className="text-[#333333] font-medium">Achievements</span>
          </div>
          <ChevronRightIcon className="text-gray-400" size={20} />
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <LogOutIcon className="text-gray-600" size={20} />
            <span className="text-[#333333] font-medium">Sign Out</span>
          </div>
          <ChevronRightIcon className="text-gray-400" size={20} />
        </button>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </div>;
};
export default Profile;