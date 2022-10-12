import React from 'react';
import AuthProvider from './AuthProvider';
import Web3Provider from './Web3Provider';

export default function Providers({ children }) {
  return (
    <Web3Provider>
      <AuthProvider>
        <div className="app">{children}</div>
      </AuthProvider>
    </Web3Provider>
  );
}
