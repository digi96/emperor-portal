import React, { createContext, useContext } from 'react';
import useCurrentUser from '../hooks/use-current-user.hook';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [signed, signature, userTools] = useCurrentUser();

  return (
    <AuthContext.Provider
      value={{
        signed,
        signature,
        ...userTools,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
