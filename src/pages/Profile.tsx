import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOutIcon, ChevronRightIcon } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
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
        <div className="flex items-center gap-4">
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
      </div>
      {/* Menu Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
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