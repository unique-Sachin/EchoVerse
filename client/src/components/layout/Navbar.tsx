import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHistory, FaPlus, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);
  
  const handleLogout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  EchoVerse
                </motion.span>
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link
                  to="/timeline"
                  className={`group inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive('/timeline')
                      ? 'text-purple-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <FaHistory className="mr-2" />
                  <span>Timeline</span>
                </Link>
                <Link
                  to="/new-entry"
                  className={`group inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive('/new-entry')
                      ? 'text-green-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <FaPlus className="mr-2" />
                  <span>New Entry</span>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaUser className="text-gray-500" />
                    </div>
                    <span className="text-gray-900 font-medium">{user?.name}</span>
                  </motion.button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 z-50"
                      >
                        <div className="px-4 py-3 bg-gray-50 rounded-t-lg">
                          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FaCog className="mr-3 text-gray-400" />
                            Settings
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                          >
                            <FaSignOutAlt className="mr-3 text-red-400" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-all duration-300 ${
                    isActive('/login')
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Login
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 