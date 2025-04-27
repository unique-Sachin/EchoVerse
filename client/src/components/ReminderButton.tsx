import { useState } from 'react';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import api from '../api/config';

interface Reminder {
  _id: string;
  entry: string;
  reminderTime: string;
}

interface ReminderButtonProps {
  entryId: string;
  unlockAt: Date;
  existingReminder?: Reminder;
  onReminderSet?: () => void;
}

const ReminderButton = ({ entryId, unlockAt, existingReminder, onReminderSet }: ReminderButtonProps) => {
  const [isSettingReminder, setIsSettingReminder] = useState(false);
  const [hasReminder, setHasReminder] = useState(!!existingReminder);
  const [reminderId, setReminderId] = useState<string | null>(existingReminder?._id || null);
  
  

  const handleSetReminder = async () => {
    try {
      setIsSettingReminder(true);
      
      // Calculate reminder time (1 hour before unlock)
      const reminderTime = new Date(unlockAt);
      reminderTime.setHours(reminderTime.getHours() - 1);

      const response = await api.post('/reminders', {
        entryId,
        reminderTime: reminderTime.toISOString()
      });

      setHasReminder(true);
      setReminderId(response.data._id);
      if (onReminderSet) {
        onReminderSet();
      }
    } catch (err) {
      console.error('Error setting reminder:', err);
    } finally {
      setIsSettingReminder(false);
    }
  };

  const handleRemoveReminder = async () => {
    try {
      setIsSettingReminder(true);
      if (reminderId) {
        await api.delete(`/reminders/${reminderId}`);
        setHasReminder(false);
        setReminderId(null);
      }
    } catch (err) {
      console.error('Error removing reminder:', err);
    } finally {
      setIsSettingReminder(false);
    }
  };

  return (
    <button
      onClick={hasReminder ? handleRemoveReminder : handleSetReminder}
      disabled={isSettingReminder}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        hasReminder
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {hasReminder ? (
        <>
          <FaBell className="w-4 h-4" />
          <span>Reminder Set</span>
        </>
      ) : (
        <>
          <FaBellSlash className="w-4 h-4" />
          <span>Set Reminder</span>
        </>
      )}
    </button>
  );
};

export default ReminderButton; 