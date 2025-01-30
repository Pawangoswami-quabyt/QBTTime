import { ReactNode, useEffect, useState } from 'react';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType, AccountInfo } from "@azure/msal-browser";
import { msalConfig } from './config';

const msalInstance = new PublicClientApplication(msalConfig);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      await msalInstance.initialize();
      
      // Handle redirect after login
      await msalInstance.handleRedirectPromise().catch(error => {
        console.error("Error handling redirect:", error);
      });

      // Set active account if available
      if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
      }

      setIsInitialized(true);
    };

    initializeMsal();

    // Event callback for login success
    const callbackId = msalInstance.addEventCallback((event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS && 
        event.payload && 
        'account' in event.payload
      ) {
        const account = event.payload.account as AccountInfo;
        msalInstance.setActiveAccount(account);
      }
    });

    return () => {
      if (callbackId) {
        msalInstance.removeEventCallback(callbackId);
      }
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Initializing...</h1>
        </div>
      </div>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
}