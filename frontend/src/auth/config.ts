import { Configuration, LogLevel } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "833f5168-0c2d-4959-81ea-70fc3778b4a6",
    authority: "https://login.microsoftonline.com/16f2921b-5cf4-4ccb-8f0f-4857c82f8c57",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
      logLevel: LogLevel.Error
    }
  }
};

export const loginRequest = {
  scopes: ["User.Read", "profile", "openid", "email", "User.ReadBasic.All"]
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphPhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value"
};