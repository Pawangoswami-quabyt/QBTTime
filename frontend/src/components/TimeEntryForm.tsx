import React, { useState } from 'react';
import { useTimeEntryStore } from '../store/timeEntryStore';
import { Clock, FileText, X } from 'lucide-react';
import { format } from 'date-fns';
import type { TimeEntry } from '../types';

interface TimeEntryFormProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  initialDate?: Date;
  initialData?: TimeEntry;
  isEditing?: boolean;
}

export function TimeEntryForm({ 
  onSubmit, 
  onCancel, 
  initialDate,
  initialData,
  isEditing = false
}: TimeEntryFormProps) {
  const { projects, addEntry, updateEntry } = useTimeEntryStore();
  const [formData, setFormData] = useState({
    projectId: initialData?.projectId || '',
    date: initialData?.date || (initialDate ? format(initialDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0]),
    hours: initialData?.hours.toString() || '',
    description: initialData?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entryData = {
      ...formData,
      hours: Number(formData.hours),
    };

    if (isEditing && initialData) {
      updateEntry(initialData.id, entryData);
    } else {
      addEntry(entryData);
    }
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {isEditing ? 'Edit Time Entry' : 'New Time Entry'}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project
          </label>
          <select
            value={formData.projectId}
            onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              Hours
            </div>
          </label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={formData.hours}
            onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            <FileText size={16} />
            Description
          </div>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        {isEditing ? 'Update Entry' : 'Save Entry'}
      </button>
    </form>
  );
}