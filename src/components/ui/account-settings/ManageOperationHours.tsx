import React, { useState, useEffect } from 'react';
import { FiClock, FiSave, FiPlusCircle, FiTrash2 } from 'react-icons/fi';

import { toast } from 'react-toastify';

interface TimeSlot {
  id: string;
  open: string;
  close: string;
}

interface DaySchedule {
  day: string;
  isOpen: boolean;
  timeSlots: TimeSlot[];
}

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Dummy initial data
const initialSchedule: DaySchedule[] = daysOfWeek.map((day) => ({
  day,
  isOpen: day !== 'Sunday', // Closed on Sunday by default
  timeSlots:
    day !== 'Sunday'
      ? [
          {
            id: `${day.toLowerCase()}-1`,
            open: '09:00',
            close: '17:00',
          },
        ]
      : [],
}));

const ManageOperationHours: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    // In a real implementation, you would fetch the vendor's operation hours
    const fetchOperationHours = async () => {
      try {
        setIsLoading(true);
        // Example API call - replace with your actual endpoint
        // const response = await axios.get('/api/vendor/operation-hours');
        // setSchedule(response.data);
        
        // For now we'll use the dummy data
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching operation hours:', error);
        setIsLoading(false);
        toast.error('Failed to load operation hours');
      }
    };

    fetchOperationHours();
  }, []);

  const handleToggleDay = (dayIndex: number) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].isOpen = !updatedSchedule[dayIndex].isOpen;
    
    // If toggling from closed to open and no time slots, add default time slot
    if (updatedSchedule[dayIndex].isOpen && updatedSchedule[dayIndex].timeSlots.length === 0) {
      updatedSchedule[dayIndex].timeSlots = [
        {
          id: `${updatedSchedule[dayIndex].day.toLowerCase()}-${Date.now()}`,
          open: '09:00',
          close: '17:00',
        },
      ];
    }
    
    setSchedule(updatedSchedule);
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    const updatedSchedule = [...schedule];
    const day = updatedSchedule[dayIndex].day.toLowerCase();
    
    // Find latest closing time to use as a reference for the new slot
    const lastSlot = updatedSchedule[dayIndex].timeSlots[updatedSchedule[dayIndex].timeSlots.length - 1];
    let newOpenTime = '09:00';
    let newCloseTime = '17:00';
    
    if (lastSlot) {
      // Make the new slot start 30 minutes after the previous slot's closing time
      const [hours, minutes] = lastSlot.close.split(':').map(Number);
      let newHours = hours;
      let newMinutes = minutes + 30;
      
      if (newMinutes >= 60) {
        newHours = (newHours + 1) % 24;
        newMinutes = newMinutes % 60;
      }
      
      newOpenTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
      
      // Set the close time to be 2 hours after the open time
      newHours = (newHours + 2) % 24;
      newCloseTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    }
    
    updatedSchedule[dayIndex].timeSlots.push({
      id: `${day}-${Date.now()}`,
      open: newOpenTime,
      close: newCloseTime,
    });
    
    setSchedule(updatedSchedule);
  };

  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].timeSlots.splice(slotIndex, 1);
    setSchedule(updatedSchedule);
  };

  const handleTimeChange = (dayIndex: number, slotIndex: number, field: 'open' | 'close', value: string) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].timeSlots[slotIndex][field] = value;
    setSchedule(updatedSchedule);
  };

  const validateSchedule = (): boolean => {
    let isValid = true;

    for (const day of schedule) {
      if (!day.isOpen) continue;

      // Check if there are any time slots for open days
      if (day.timeSlots.length === 0) {
        toast.error(`${day.day} is set to open but has no operation hours defined.`);
        isValid = false;
        continue;
      }

      // Check for valid times and conflicts
      for (let i = 0; i < day.timeSlots.length; i++) {
        const slot = day.timeSlots[i];
        
        // Validate time format and order
        if (slot.open >= slot.close) {
          toast.error(`${day.day}: Opening time must be before closing time`);
          isValid = false;
          continue;
        }

        // Check for overlapping time slots
        for (let j = i + 1; j < day.timeSlots.length; j++) {
          const otherSlot = day.timeSlots[j];
          if (
            (slot.open <= otherSlot.open && otherSlot.open < slot.close) ||
            (otherSlot.open <= slot.open && slot.open < otherSlot.close)
          ) {
            toast.error(`${day.day}: Time slots cannot overlap`);
            isValid = false;
            break;
          }
        }
      }
    }

    return isValid;
  };

  const handleSaveSchedule = async () => {
    if (!validateSchedule()) return;

    try {
      setIsSaving(true);
      
      // Example API call - replace with your actual endpoint
      // await axios.post('/api/vendor/operation-hours', schedule);
      
      // Simulate API delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Operation hours saved successfully');
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving operation hours:', error);
      toast.error('Failed to save operation hours');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <FiClock className="mr-2" /> Manage Operation Hours
        </h1>
        <p className="text-gray-600">
          Set your store's operation hours for each day of the week. Customers will be able to place orders only during your operational hours.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 gap-6 mb-6">
          {schedule.map((day, dayIndex) => (
            <div
              key={day.day}
              className="border rounded-lg p-4 transition-all duration-200"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-800 mr-2">
                    {day.day}
                  </h3>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name={`toggle-${day.day}`}
                      id={`toggle-${day.day}`}
                      checked={day.isOpen}
                      onChange={() => handleToggleDay(dayIndex)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`toggle-${day.day}`}
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        day.isOpen ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in ${
                          day.isOpen ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                  <span className={`text-sm ${day.isOpen ? 'text-green-500' : 'text-gray-500'}`}>
                    {day.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                {day.isOpen && (
                  <button
                    type="button"
                    onClick={() => handleAddTimeSlot(dayIndex)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center text-sm font-medium"
                  >
                    <FiPlusCircle className="mr-1" /> Add Time Slot
                  </button>
                )}
              </div>

              {day.isOpen && (
                <div className="space-y-3">
                  {day.timeSlots.map((slot, slotIndex) => (
                    <div
                      key={slot.id}
                      className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-md relative"
                    >
                      <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700 mr-2">
                          Open:
                        </label>
                        <input
                          type="time"
                          value={slot.open}
                          onChange={(e) =>
                            handleTimeChange(dayIndex, slotIndex, 'open', e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700 mr-2">
                          Close:
                        </label>
                        <input
                          type="time"
                          value={slot.close}
                          onChange={(e) =>
                            handleTimeChange(dayIndex, slotIndex, 'close', e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {day.timeSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)}
                          className="ml-auto text-red-500 hover:text-red-700"
                          aria-label="Remove time slot"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveSchedule}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Save Operation Hours
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-md font-medium text-blue-800 mb-2">Tips:</h3>
        <ul className="text-sm text-blue-700 space-y-1 ml-5 list-disc">
          <li>You can add multiple time slots for each day (e.g., morning and evening shifts)</li>
          <li>Make sure to set your operation hours accurately as customers can only order during these times</li>
          <li>If you're closed on a particular day, toggle the day to "Closed"</li>
          <li>Don't forget to click "Save Operation Hours" after making changes</li>
        </ul>
      </div>
    </div>
  );
};

export default ManageOperationHours;