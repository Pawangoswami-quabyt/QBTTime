import React, { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import { useTimeEntryStore } from '../store/timeEntryStore';
import type { TimeEntry } from '../types';

interface EditingEntry extends TimeEntry {
  isNew?: boolean;
}

export function WeekView() {
  const { selectedWeek, projects, getEntriesForWeek, updateEntry, deleteEntry, isWeekSubmitted } = useTimeEntryStore();
  const entries = getEntriesForWeek(selectedWeek);
  const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);
  const isSubmitted = isWeekSubmitted(selectedWeek);

  const handleEdit = (entry: TimeEntry) => {
    if (!isSubmitted) {
      setEditingEntry(entry);
    }
  };

  const handleSave = () => {
    if (editingEntry) {
      updateEntry(editingEntry.id, {
        projectId: editingEntry.projectId,
        hours: editingEntry.hours,
        description: editingEntry.description,
      });
      setEditingEntry(null);
    }
  };

  const handleDelete = (id: string) => {
    if (!isSubmitted) {
      deleteEntry(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Week Entries</h3>
      </div>

      <div className="divide-y">
        {entries.map((entry) => (
          <div key={entry.id} className="p-4 hover:bg-gray-50">
            {editingEntry?.id === entry.id ? (
              <div className="space-y-3">
                <div className="flex gap-4">
                  <select
                    value={editingEntry.projectId}
                    onChange={(e) => setEditingEntry(prev => ({ ...prev!, projectId: e.target.value }))}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={editingEntry.hours}
                    onChange={(e) => setEditingEntry(prev => ({ ...prev!, hours: Number(e.target.value) }))}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <textarea
                  value={editingEntry.description}
                  onChange={(e) => setEditingEntry(prev => ({ ...prev!, description: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingEntry(null)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={handleSave}
                    className="p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-full"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {projects.find(p => p.id === entry.projectId)?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(entry.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{entry.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">{entry.hours}h</span>
                  {!isSubmitted && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full"
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

        {entries.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No entries recorded for this week
          </div>
        )}
      </div>
    </div>
  );
}