import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  Home,
  ShoppingCart,
  Users,
  FileText,
  BarChart3,
  LogOut,
  Shield,
  Podcast,
  BookOpen,
  Lock
} from 'lucide-react';
import { useAdmin } from '../../../contexts/AdminContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAdmin();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Resources', href: '/admin/resources', icon: BookOpen },
    { name: 'E-book', href: '/admin/ebook', icon: Lock },
    { name: 'Podcast', href: '/admin/podcast', icon: Podcast },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:inset-y-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 border-b border-gray-200">
          <div className="flex items-center min-w-0">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <span className="ml-2 text-lg sm:text-xl font-semibold text-gray-900 truncate">Admin Panel</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 sm:p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex-shrink-0"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <nav className="mt-4 sm:mt-6 px-2 sm:px-3 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/admin' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 flex-shrink-0
                      ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
            >
              <LogOut className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gray-500 flex-shrink-0" />
              <span className="truncate">Sign Out</span>
            </button>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>PR Science Admin</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
