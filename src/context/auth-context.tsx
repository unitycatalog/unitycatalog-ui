import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoginWithToken } from '../hooks/user';
import apiClient from './client';

interface AuthContextProps {
  accessToken: any;
  loginWithToken: any;
  logout: any;
}

const AuthContext = React.createContext<AuthContextProps>({
  accessToken: null,
  loginWithToken: null,
  logout: null,
});
AuthContext.displayName = 'AuthContext';

function AuthProvider(props: any) {
  const [accessToken, setAccessToken] = useState<string>('');
  const loginWithTokenMutation = useLoginWithToken();

  const loginWithToken = useCallback(
    (idToken: string) => {
      loginWithTokenMutation.mutate(idToken, {
        onSuccess: (response) => {
          setAccessToken(response.access_token);
        },
      });
    },
    [loginWithTokenMutation],
  );

  const logout = useCallback(() => {
    setAccessToken('');
  }, []);

  useEffect(() => {
    const requestIntercept = apiClient.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
    const responseIntercept = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403) {
          // todo if we support refresh in the future, that logic will go in here
          setAccessToken('');
        }
        return Promise.reject(error);
      },
    );

    return () => {
      apiClient.interceptors.request.eject(requestIntercept);
      apiClient.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken]);

  const value = useMemo(
    () => ({
      accessToken,
      loginWithToken,
      logout,
    }),
    [accessToken, loginWithToken, logout],
  );

  return <AuthContext.Provider value={value} {...props} />;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };