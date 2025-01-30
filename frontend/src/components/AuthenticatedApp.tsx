import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Clock } from 'lucide-react';
import { WeekSelector } from './WeekSelector';
import { DaySelector } from './DaySelector';
import { DayView } from './DayView';
import { WeeklyOverview } from './WeeklyOverview';
import { WeeklySubmission } from './WeeklySubmission';
import { UserAvatar } from './UserAvatar';

export function AuthenticatedApp() {
  const { inProgress, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // Show loading state while authentication is being processed
  if (inProgress === InteractionStatus.Startup || inProgress === InteractionStatus.HandleRedirect) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated || accounts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to My Time</h1>
          <p className="text-gray-600 mb-8">Please sign in to continue</p>
          <UserAvatar />
        </div>
      </div>
    );
  }

  // Show main app when authenticated
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="text-blue-600" size={24} />
              <h1 className="text-xl font-semibold text-gray-900">My Time</h1>
            </div>
            <UserAvatar />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <WeekSelector />
            <DaySelector />
            <DayView />
          </div>
          <div className="space-y-6">
            <WeeklyOverview />
            <WeeklySubmission />
          </div>
        </div>
      </main>
    </div>
  );
}