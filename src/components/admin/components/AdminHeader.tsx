import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAdmin } from '../../../contexts/AdminContext';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { logout } = useAdmin();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 w-full sticky top-0 z-30">
      <div className="flex items-center justify-between h-14 sm:h-16 px-2 sm:px-4 lg:px-6">
        <div className="flex items-center min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex-shrink-0"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div className="ml-2 sm:ml-4 lg:ml-0 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
              Admin Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Notifications */}
          <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md relative">
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={logout}
              className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <User className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:block text-sm font-medium">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
