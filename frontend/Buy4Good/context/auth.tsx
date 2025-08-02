import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import {
  AuthError,
  makeRedirectUri,
  useAuthRequest,
  AuthRequestConfig,
  DiscoveryDocument,
} from "expo-auth-session";
import { BASE_URL, TOKEN_KEY_NAME } from "@/constants";
import { Platform } from "react-native";
import * as jose from "jose";
import { tokenCache } from "@/utils/cache";

WebBrowser.maybeCompleteAuthSession();

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  provider?: string;
  exp?: number;
  cookieExpiration?: number;
};

const AuthContext = React.createContext({
  user: null as AuthUser | null,
  signIn: () => {},
  signOut: () => {},
  fetchWithAuth: (url: string, options: RequestInit) =>
    Promise.resolve(new Response()),
  isLoading: false,
  error: null as AuthError | null,
});

const config: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri(),
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
  tokenEndpoint: `${BASE_URL}/api/auth/token`,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<AuthError | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);

  const [request, response, promptAsync] = useAuthRequest(config, discovery);
  const isWeb = Platform.OS === "web";

  React.useEffect(() => {
    handleResponse();
  }, [response]);

  React.useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      try {
        if (isWeb) {
          const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
            method: "GET",
            credentials: "include",
          });

          if (sessionResponse.ok) {
            const userData = await sessionResponse.json();
            setUser(userData.user as AuthUser);
          }
        } else {
          const storedAccessToken = await tokenCache?.getToken(TOKEN_KEY_NAME);
          if (storedAccessToken) {
            try {
              const decoded = jose.decodeJwt(storedAccessToken);
              const exp = decoded.exp as number;
              const now = Math.floor(Date.now() / 1000);
              if (exp && exp < now) {
                console.warn("Access token has expired.");
                setAccessToken(storedAccessToken);
                setUser(decoded as AuthUser);
              } else {
                setUser(null);
                tokenCache?.deleteToken(TOKEN_KEY_NAME);
              }
            } catch (err) {
              console.error("Error decoding access token:", err);
            }
          } else {
            console.warn("No access token found in cache.");
          }
        }
      } catch (err) {
        console.error("Error restoring session:", err);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, [isWeb]);

  const handleResponse = async () => {
    if (response?.type === "success") {
      const { code } = response.params;

      const formData = new FormData();
      formData.append("code", code);

      if (isWeb) {
        formData.append("platform", "web");
      }

      if (request?.codeVerifier) {
        formData.append("code_verifier", request.codeVerifier);
      } else {
        console.warn("Code verifier is not available");
      }

      const tokenResponse = await fetch(`${BASE_URL}/api/auth/token`, {
        method: "POST",
        body: formData,
        credentials: isWeb ? "include" : "same-origin",
      });

      if (isWeb) {
        const userData = await tokenResponse.json();

        if (userData.success) {
          const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
            method: "GET",
            credentials: "include",
          });

          if (!sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            setUser(sessionData.user as AuthUser);
          }
        }
      } else {
        const token = await tokenResponse.json();
        const accessToken = token.accessToken;

        if (!accessToken) {
          console.error("No access token received.");
          return;
        }
        setAccessToken(accessToken);

        tokenCache?.saveToken(TOKEN_KEY_NAME, accessToken);

        console.log("Access token saved to cache:", accessToken);

        const decoded = jose.decodeJwt(accessToken);
        setUser(decoded as AuthUser);
      }

      try {
        setIsLoading(true);
      } catch (err) {
        console.error("Error during authentication:", err);
      } finally {
        setIsLoading(false);
      }

      console.log("Auth code received:", code);
    } else if (response?.type === "error") {
      setError(response.error as AuthError);
    }
  };

  const signIn = async () => {
    try {
      if (!request) {
        console.error("Auth request is not initialized.");
        return;
      }

      await promptAsync();
    } catch (err) {
      console.error("SignIn error:", err);
    }
  };
  const signOut = async () => {
    if (isWeb) {
      // For web: Call logout endpoint to clear the cookie
      try {
        await fetch(`${BASE_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Error during web logout:", error);
      }
    } else {
      // For native: Clear both tokens from cache
      await tokenCache?.deleteToken("accessToken");
      await tokenCache?.deleteToken("refreshToken");
    }

    // Clear state
    setUser(null);
    setAccessToken("");
  };
  const fetchWithAuth = async (url: string, options: RequestInit) => {
    if (isWeb) {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
      });

      return response;
    } else {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        fetchWithAuth,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
