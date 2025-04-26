import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { FaMicrophone, FaHistory, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-extrabold text-white mb-6"
          >
            Welcome to <span className="text-indigo-200">EchoVerse</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/90 max-w-2xl mx-auto mb-12"
          >
            Record your thoughts today, hear them tomorrow. Your personal time capsule of audio memories.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl hover:bg-white/20 transition-all duration-300"
          >
            <div className="text-white mb-4">
              <FaMicrophone className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Record Your Thoughts</h3>
            <p className="text-white/80">Capture your voice and emotions in the moment</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl hover:bg-white/20 transition-all duration-300"
          >
            <div className="text-white mb-4">
              <FaHistory className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Time Capsule</h3>
            <p className="text-white/80">Set a future date to unlock your memories</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl hover:bg-white/20 transition-all duration-300"
          >
            <div className="text-white mb-4">
              <FaUserPlus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Create Account</h3>
            <p className="text-white/80">Start your journey with EchoVerse</p>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="mt-4 inline-block px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-white/90 transition-all duration-200"
              >
                Sign Up
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl hover:bg-white/20 transition-all duration-300"
          >
            <div className="text-white mb-4">
              <FaSignInAlt className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Sign In</h3>
            <p className="text-white/80">Continue your journey</p>
            {!isAuthenticated && (
              <Link 
                to="/login" 
                className="mt-4 inline-block px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-white/90 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </motion.div>
        </div>

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <Link 
              to="/timeline" 
              className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-white/90 transition-all duration-200 shadow-lg"
            >
              Go to Timeline
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home; 