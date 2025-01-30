import React from 'react';
import { useTimeEntryStore } from '../store/timeEntryStore';
import { format, startOfWeek, addDays } from 'date-fns';
import { Clock } from 'lucide-react';

export function WeeklyOverview() {
  const { getEntriesForWeek } = useTimeEntryStore();
  const currentWeekEntries = getEntriesForWeek(new Date());
  const weekStart = startOfWeek(new Date());

  const dailyHours = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const hours = currentWeekEntries
      .filter(entry => entry.date === dateStr)
      .reduce((sum, entry) => sum + entry.hours, 0);
    
    return {
      date,
      hours,
    };
  });

  const totalHours = dailyHours.reduce((sum, day) => sum + day.hours, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">This Week's Overview</h2>
        <div className="flex items-center gap-2 text-blue-600">
          <Clock size={20} />
          <span className="font-semibold">{totalHours}h</span>
        </div>
      </div>

      <div className="space-y-3">
        {dailyHours.map(({ date, hours }) => (
          <div key={date.toISOString()} className="flex items-center">
            <div className="w-24 text-sm text-gray-600">
              {format(date, 'EEE, MMM d')}
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${Math.min((hours / 8) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="w-16 text-right text-sm font-medium">
              {hours > 0 ? `${hours}h` : '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}