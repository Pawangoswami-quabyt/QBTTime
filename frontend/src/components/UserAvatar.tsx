import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { UserCircle } from 'lucide-react';
import { loginRequest, graphConfig } from '../auth/config';
import { useEffect, useState } from 'react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

export function UserAvatar() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (!isAuthenticated) return;

      try {
        const account = instance.getActiveAccount();
        if (!account) return;

        let tokenResponse;
        try {
          // Try to get token silently first
          tokenResponse = await instance.acquireTokenSilent({
            ...loginRequest,
            account: account
          });
        } catch (error) {
          // If interaction is required, prompt for consent
          if (error instanceof InteractionRequiredAuthError) {
            tokenResponse = await instance.acquireTokenRedirect({
              ...loginRequest,
              account: account
            });
            return; // The redirect will happen here, so we return
          }
          throw error;
        }

        const photoResponse = await fetch(graphConfig.graphPhotoEndpoint, {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`
          }
        });

        if (photoResponse.ok) {
          const blob = await photoResponse.blob();
          const url = URL.createObjectURL(blob);
          setPhotoUrl(url);
        }
      } catch (error) {
        console.error('Error fetching profile photo:', error);
      }
    };

    fetchProfilePhoto();

    return () => {
      // Cleanup object URL when component unmounts
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [instance, isAuthenticated]);

  const handleLogin = () => {
    instance.loginRedirect({
      ...loginRequest,
      prompt: 'consent'
    });
  };

  const handleLogout = () => {
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
      setPhotoUrl(null);
    }
    instance.logoutRedirect();
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleLogin}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        <UserCircle size={20} />
        Sign In
      </button>
    );
  }

  const account = instance.getActiveAccount();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={account?.name || 'User'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '';
                e.currentTarget.onerror = null;
                e.currentTarget.parentElement?.classList.add('bg-blue-600');
                e.currentTarget.parentElement?.classList.add('text-white');
                e.currentTarget.parentElement?.appendChild(
                  document.createTextNode(
                    (account?.name?.charAt(0) || 'U').toUpperCase()
                  )
                );
              }}
            />
          ) : (
            <UserCircle className="w-6 h-6 text-gray-500" />
          )}
        </div>
        <span>{account?.name || 'User'}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 hidden group-hover:block">
        <button
          onClick={handleLogout}
          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}