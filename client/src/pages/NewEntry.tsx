import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/config';
import { motion } from 'framer-motion';
import { FaMicrophone, FaStop, FaSave, FaSpinner } from 'react-icons/fa';

const MOODS = ['😊', '😢', '😡', '😴', '🤔', '🎉', '💪', '❤️'];

const NewEntry = () => {
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState(MOODS[0]);
  const [unlockDate, setUnlockDate] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioBlob) return;

    setIsSaving(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('mood', mood);
    
    // Convert the selected time to UTC
    const selectedDate = new Date(unlockDate);
    formData.append('unlockAt', selectedDate.toISOString());
    
    formData.append('audio', audioBlob, 'recording.mp3');

    try {
      await api.post('/entries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/timeline');
    } catch (err) {
      console.error('Error creating entry:', err);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-8 text-center"
          >
            Create New Entry
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-white/90 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                placeholder="Give your entry a title"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-white/90 mb-2">
                Mood
              </label>
              <div className="flex flex-wrap gap-3">
                {MOODS.map((m) => (
                  <motion.button
                    key={m}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMood(m)}
                    className={`text-3xl p-3 rounded-full transition-all duration-200 ${
                      mood === m
                        ? 'bg-white/30 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {m}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-white/90 mb-2">
                Unlock Date
              </label>
              <input
                type="datetime-local"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                required
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <label className="block text-sm font-medium text-white/90">
                Audio Recording
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500/90 hover:bg-red-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <FaStop className="w-5 h-5" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <FaMicrophone className="w-5 h-5" />
                      Start Recording
                    </>
                  )}
                </motion.button>
                {audioBlob && (
                  <audio
                    controls
                    src={URL.createObjectURL(audioBlob)}
                    className="w-full sm:w-auto"
                  />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!audioBlob || isSaving}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-indigo-500 transition-all duration-200 ${
                  !audioBlob || isSaving
                    ? 'bg-gray-300 text-gray-500 !cursor-not-allowed'
                    : 'bg-white text-indigo-600 hover:bg-white/90'
                }`}
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <FaSpinner className="w-5 h-5" />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="w-5 h-5" />
                    Save Entry
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default NewEntry; 