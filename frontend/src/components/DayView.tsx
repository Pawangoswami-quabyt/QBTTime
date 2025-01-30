import React from 'react';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useTimeEntryStore } from '../store/timeEntryStore';
import { TimeEntryForm } from './TimeEntryForm';
import type { TimeEntry } from '../types';

export function DayView() {
  const { selectedDate, projects, getEntriesForDate, deleteEntry, updateEntry, isWeekSubmitted } = useTimeEntryStore();
  const [showNewEntry, setShowNewEntry] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<TimeEntry | null>(null);
  
  if (!selectedDate) return null;
  
  const entries = getEntriesForDate(selectedDate);
  const isSubmitted = isWeekSubmitted(selectedDate);
  const dateStr = format(selectedDate, 'EEEE, MMMM d, yyyy');
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  const handleEdit = (entry: TimeEntry) => {
    if (!isSubmitted) {
      setEditingEntry(entry);
    }
  };

  const handleUpdate = (updatedEntry: Omit<TimeEntry, 'id' | 'userId' | 'submitted'>) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, updatedEntry);
      setEditingEntry(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{dateStr}</h2>
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{totalHours}h</span>
          </div>
        </div>
        
        {!isSubmitted && !showNewEntry && !editingEntry && (
          <button
            onClick={() => setShowNewEntry(true)}
            className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Plus size={20} />
            Add Time Entry
          </button>
        )}
      </div>

      {showNewEntry && (
        <div className="p-6 border-b bg-gray-50">
          <TimeEntryForm
            onSubmit={() => setShowNewEntry(false)}
            onCancel={() => setShowNewEntry(false)}
            initialDate={selectedDate}
          />
        </div>
      )}

      <div className="divide-y">
        {entries.map((entry) => (
          <div key={entry.id} className="p-6 hover:bg-gray-50">
            {editingEntry?.id === entry.id ? (
              <div className="p-6 border-b bg-gray-50">
                <TimeEntryForm
                  onSubmit={() => setEditingEntry(null)}
                  onCancel={() => setEditingEntry(null)}
                  initialDate={selectedDate}
                  initialData={entry}
                  isEditing
                />
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    {projects.find(p => p.id === entry.projectId)?.name}
                  </h3>
                  <p className="mt-1 text-gray-600">{entry.description}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{entry.hours}h</span>
                  {!isSubmitted && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {entries.length === 0 && !showNewEntry && (
          <div className="p-8 text-center text-gray-500">
            No entries recorded for this day
          </div>
        )}
      </div>
    </div>
  );
}