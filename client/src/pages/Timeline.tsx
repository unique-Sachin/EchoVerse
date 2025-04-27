import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChevronDown, FaChevronUp, FaClock, FaLock, FaMusic } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Entry } from '../types';
import api from '../api/config';
import ReminderButton from '../components/ReminderButton';

const Timeline = () => {
  const { data: entries, isLoading: isLoadingEntries } = useQuery<Entry[]>({
    queryKey: ['entries'],
    queryFn: async () => {
      const res = await api.get('/entries');
      return res.data;
    },
  });

  const { data: reminders, isLoading: isLoadingReminders } = useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const res = await api.get('/reminders');
      return res.data;
    },
  });

  

  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (entries && entries.length > 0) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear().toString();
      const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

      // Set current year as expanded
      setExpandedYears(prev => ({
        ...prev,
        [currentYear]: true
      }));

      // Set current month as expanded
      setExpandedMonths(prev => ({
        ...prev,
        [`${currentYear}-${currentMonth}`]: true
      }));
    }
  }, [entries]);

  const toggleYear = (year: string) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  const toggleMonth = (yearMonth: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [yearMonth]: !prev[yearMonth]
    }));
  };

  if (isLoadingEntries || isLoadingReminders) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
        />
      </motion.div>
    );
  }

  // Group entries by year and month
  const groupedEntries = entries?.reduce((acc, entry) => {
    const date = new Date(entry.createdAt);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][month]) {
      acc[year][month] = [];
    }

    acc[year][month].push(entry);
    return acc;
  }, {} as Record<string, Record<string, Entry[]>>);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Memory Timeline
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Your journey through time
          </p>
        </motion.div>

        <div className="space-y-8">
          {groupedEntries && Object.entries(groupedEntries).map(([year, months], yearIndex) => (
            <motion.div
              key={year}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: yearIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => toggleYear(year)}
                className="w-full px-8 py-5 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group"
              >
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">{year}</h3>
                <motion.div
                  animate={{ rotate: expandedYears[year] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {expandedYears[year] ? (
                    <FaChevronUp className="text-gray-600 w-5 h-5 group-hover:text-purple-600 transition-colors duration-300" />
                  ) : (
                    <FaChevronDown className="text-gray-600 w-5 h-5 group-hover:text-purple-600 transition-colors duration-300" />
                  )}
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {expandedYears[year] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 space-y-8"
                  >
                    {Object.entries(months).map(([month, monthEntries], monthIndex) => (
                      <motion.div
                        key={month}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: monthIndex * 0.1 }}
                        className="space-y-6"
                      >
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          onClick={() => toggleMonth(`${year}-${month}`)}
                          className="w-full flex items-center justify-between px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border border-purple-100 group"
                        >
                          <h4 className="text-lg font-semibold text-purple-800 group-hover:text-purple-900 transition-colors duration-300">{month}</h4>
                          <motion.div
                            animate={{ rotate: expandedMonths[`${year}-${month}`] ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {expandedMonths[`${year}-${month}`] ? (
                              <FaChevronUp className="text-purple-600 w-4 h-4 group-hover:text-purple-700 transition-colors duration-300" />
                            ) : (
                              <FaChevronDown className="text-purple-600 w-4 h-4 group-hover:text-purple-700 transition-colors duration-300" />
                            )}
                          </motion.div>
                        </motion.button>

                        <AnimatePresence>
                          {expandedMonths[`${year}-${month}`] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-6 pl-6 border-l-2 border-purple-200 ml-6"
                            >
                              {monthEntries.map((entry, entryIndex) => (
                                <motion.div
                                  key={entry._id}
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ duration: 0.3, delay: entryIndex * 0.1 }}
                                  className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-lg border border-gray-100"
                                >
                                  <motion.div
                                    className="p-6"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                          <h3 className="text-xl font-bold text-gray-900 hover:text-purple-700 transition-colors duration-300">
                                            {entry.title}
                                          </h3>
                                          <span className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${entry.isUnlocked
                                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300'
                                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300'
                                            }`}>
                                            {entry.isUnlocked ? 'Unlocked' : 'Locked'}
                                          </span>
                                        </div>
                                        <div className="flex flex-col space-y-3 text-gray-500 mb-4">
                                          <div className="flex items-center hover:text-purple-600 transition-colors duration-300">
                                            <FaCalendarAlt className="mr-2 text-purple-500 w-4 h-4" />
                                            <span>
                                              Created: {format(new Date(entry.createdAt), 'MMMM d, yyyy h:mm a')}
                                            </span>
                                          </div>
                                          <div className="flex items-center hover:text-purple-600 transition-colors duration-300">
                                            <FaClock className="mr-2 text-purple-500 w-4 h-4" />
                                            <span>
                                              {entry.isUnlocked ? "Unlocked: " : "Unlocks: "} {format(toZonedTime(new Date(entry.unlockAt), 'Asia/Kolkata'), 'MMMM d, yyyy h:mm a')}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="text-3xl bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-full border border-purple-200 hover:from-purple-200 hover:to-pink-200 transition-all duration-300">
                                          {entry.mood}
                                        </div>
                                        {!entry.isUnlocked && (
                                          <ReminderButton
                                            entryId={entry._id}
                                            unlockAt={new Date(entry.unlockAt)}
                                            existingReminder={reminders?.find((r: any) => r.entry._id === entry._id)}
                                          />
                                        )}
                                      </div>
                                    </div>

                                    {entry.isUnlocked ? (
                                      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 hover:from-purple-100 hover:to-pink-100 transition-all duration-300">
                                        <div className="flex items-center mb-3">
                                          <FaMusic className="text-purple-500 mr-2 w-5 h-5" />
                                          <span className="text-gray-700 font-medium">Your Memory</span>
                                        </div>
                                        <audio
                                          controls
                                          className="w-full rounded-lg hover:shadow-md transition-all duration-300"
                                          style={{ backgroundColor: '#f3f4f6' }}
                                        >
                                          <source src={entry.audioUrl} type="audio/mpeg" />
                                          Your browser does not support the audio element.
                                        </audio>
                                      </div>
                                    ) : (
                                      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 flex items-center justify-center border border-purple-100 hover:from-purple-100 hover:to-pink-100 transition-all duration-300">
                                        <FaLock className="text-gray-400 mr-2 w-5 h-5" />
                                        <span className="text-gray-500">
                                          This memory will unlock on {format(toZonedTime(new Date(entry.unlockAt), 'Asia/Kolkata'), 'MMMM d, yyyy h:mm a')}
                                        </span>
                                      </div>
                                    )}
                                  </motion.div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {entries?.length === 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No memories yet
                </h3>
                <p className="text-gray-500">
                  Start creating your first memory to see it here!
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Timeline; 