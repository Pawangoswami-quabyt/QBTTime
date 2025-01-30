import React from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { useTimeEntryStore } from '../store/timeEntryStore';
import { clsx } from 'clsx';

export function DaySelector() {
  const { selectedWeek, selectedDate, setSelectedDate } = useTimeEntryStore();
  const weekStart = startOfWeek(selectedWeek);
  
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-7 gap-2 bg-white p-4 rounded-lg shadow-sm">
      {days.map((date) => {
        const isSelected = selectedDate && isSameDay(date, selectedDate);
        return (
          <button
            key={date.toISOString()}
            onClick={() => setSelectedDate(date)}
            className={clsx(
              "p-3 rounded-lg text-center transition-colors",
              isSelected
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            )}
          >
            <div className="text-xs font-medium">
              {format(date, 'EEE')}
            </div>
            <div className={clsx(
              "text-lg",
              isSelected ? "font-bold" : "font-semibold"
            )}>
              {format(date, 'd')}
            </div>
          </button>
        );
      })}
    </div>
  );
}