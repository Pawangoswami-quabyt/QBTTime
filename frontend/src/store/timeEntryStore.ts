import { create } from 'zustand';
import { startOfWeek, endOfWeek, isWithinInterval, parseISO, isBefore, isSameDay } from 'date-fns';
import type { TimeEntry, Project, User } from '../types';

interface TimeEntryStore {
  entries: TimeEntry[];
  projects: Project[];
  currentUser: User;
  selectedWeek: Date;
  selectedDate: Date | null;
  addEntry: (entry: Omit<TimeEntry, 'id' | 'userId' | 'submitted'>) => void;
  updateEntry: (id: string, entry: Partial<TimeEntry>) => void;
  deleteEntry: (id: string) => void;
  submitWeek: (weekStart: Date) => void;
  getEntriesForWeek: (date: Date) => TimeEntry[];
  getEntriesForDate: (date: Date) => TimeEntry[];
  isWeekSubmitted: (date: Date) => boolean;
  getPendingWeeks: () => Date[];
  setSelectedWeek: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
}

export const useTimeEntryStore = create<TimeEntryStore>((set, get) => ({
  entries: [],
  projects: [
    { id: '1', name: 'Project A' },
    { id: '2', name: 'Project B' },
    { id: '3', name: 'Project C' },
  ],
  currentUser: { id: '1', name: 'John Doe' },
  selectedWeek: new Date(),
  selectedDate: new Date(),

  addEntry: (entry) => {
    const newEntry: TimeEntry = {
      id: crypto.randomUUID(),
      userId: get().currentUser.id,
      submitted: false,
      ...entry,
    };
    set((state) => ({ entries: [...state.entries, newEntry] }));
  },

  updateEntry: (id, updatedFields) => {
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updatedFields } : entry
      ),
    }));
  },

  deleteEntry: (id) => {
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    }));
  },

  submitWeek: (weekStart: Date) => {
    set((state) => ({
      entries: state.entries.map((entry) => {
        const entryDate = parseISO(entry.date);
        if (
          isWithinInterval(entryDate, {
            start: startOfWeek(weekStart),
            end: endOfWeek(weekStart),
          })
        ) {
          return { ...entry, submitted: true };
        }
        return entry;
      }),
    }));
  },

  getEntriesForWeek: (date: Date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return get().entries.filter((entry) =>
      isWithinInterval(parseISO(entry.date), { start, end })
    );
  },

  getEntriesForDate: (date: Date) => {
    return get().entries.filter((entry) =>
      isSameDay(parseISO(entry.date), date)
    );
  },

  isWeekSubmitted: (date: Date) => {
    const weekEntries = get().getEntriesForWeek(date);
    return weekEntries.length > 0 && weekEntries.every((entry) => entry.submitted);
  },

  getPendingWeeks: () => {
    const entries = get().entries;
    const weeks = new Set<string>();
    const pendingWeeks: Date[] = [];

    entries.forEach((entry) => {
      const date = parseISO(entry.date);
      const weekStart = startOfWeek(date);
      if (!entry.submitted && !weeks.has(weekStart.toISOString())) {
        weeks.add(weekStart.toISOString());
        if (isBefore(weekStart, new Date())) {
          pendingWeeks.push(weekStart);
        }
      }
    });

    return pendingWeeks;
  },

  setSelectedWeek: (date: Date) => {
    set({ selectedWeek: date, selectedDate: date });
  },

  setSelectedDate: (date: Date) => {
    set({ selectedDate: date });
  },
}));