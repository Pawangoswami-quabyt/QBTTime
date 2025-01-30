import React from 'react';
import { useTimeEntryStore } from '../store/timeEntryStore';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function WeeklySubmission() {
  const { getEntriesForWeek, submitWeek, isWeekSubmitted, getPendingWeeks } = useTimeEntryStore();
  const pendingWeeks = getPendingWeeks();

  const handleSubmitWeek = (weekStart: Date) => {
    submitWeek(weekStart);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Weekly Submissions</h2>
      
      {pendingWeeks.length === 0 ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={20} />
          <p>All weeks are up to date!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle size={20} />
            <p>You have pending submissions</p>
          </div>
          
          {pendingWeeks.map((weekStart) => {
            const entries = getEntriesForWeek(weekStart);
            const isSubmitted = isWeekSubmitted(weekStart);
            
            return (
              <div
                key={weekStart.toISOString()}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">
                    Week of {format(weekStart, 'MMM d, yyyy')}
                  </h3>
                  <span className={clsx(
                    "px-2 py-1 rounded-full text-sm",
                    isSubmitted
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  )}>
                    {isSubmitted ? 'Submitted' : 'Pending'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {entries.length} entries recorded
                </div>
                
                {!isSubmitted && (
                  <button
                    onClick={() => handleSubmitWeek(weekStart)}
                    className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Submit Week
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}