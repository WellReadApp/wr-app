import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { LOGIN, SIGNUP, GET_ME, LOGOUT } from '../services/userQueries';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  picture_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  const [loginMutation] = useLazyQuery<{ login: string }>(LOGIN);
  const [signupMutation] = useMutation<{ signup: User }>(SIGNUP);
  const [logoutMutation] = useMutation<{ logout: boolean }>(LOGOUT);
  const [getMeQuery, { data: meData }] = useLazyQuery<{ get_me: User }>(GET_ME);

  // Fetch user data if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          await getMeQuery();
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [getMeQuery]);

  // Update user when meData changes
  useEffect(() => {
    if (meData?.get_me) {
      setUser(meData.get_me);
    }
  }, [meData]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (data?.login) {
        const authToken = data.login;
        localStorage.setItem('authToken', authToken);
        setToken(authToken);
        
        // Fetch user data after login
        await getMeQuery();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      const { data } = await signupMutation({
        variables: {
          email,
          password,
          firstName,
          lastName,
        },
      });

      if (data?.signup) {
        // After signup, login to get token
        await login(email, password);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to signup');
    }
  };

  const logout = async () => {
    try {
      await logoutMutation();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    }
  };

  const refetchUser = async () => {
    try {
      await getMeQuery();
    } catch (error) {
      console.error('Failed to refetch user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
