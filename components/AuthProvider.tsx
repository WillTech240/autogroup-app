import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status]);

  const login = async () => {
    await signIn('google');
  };

  const logout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};