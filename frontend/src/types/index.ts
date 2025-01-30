export interface TimeEntry {
  id: string;
  userId: string;
  projectId: string;
  date: string;
  hours: number;
  description: string;
  submitted: boolean;
}

export interface Project {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
}

export interface WeekViewEntry {
  entry: TimeEntry;
  project: Project;
}