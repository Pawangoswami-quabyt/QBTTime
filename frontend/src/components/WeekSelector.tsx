import React from 'react';
import { format, addWeeks, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTimeEntryStore } from '../store/timeEntryStore';

export function WeekSelector() {
  const { selectedWeek, setSelectedWeek } = useTimeEntryStore();
  const weekStart = startOfWeek(selectedWeek);

  const handlePreviousWeek = () => {
    setSelectedWeek(addWeeks(weekStart, -1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(addWeeks(weekStart, 1));
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4">
      <button
        onClick={handlePreviousWeek}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronLeft size={20} />
      </button>
      
      <h2 className="text-lg font-medium">
        Week of {format(weekStart, 'MMM d, yyyy')}
      </h2>
      
      <button
        onClick={handleNextWeek}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}