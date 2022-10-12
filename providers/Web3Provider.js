import React, { createContext, useContext, useEffect } from 'react';
import useWeb3Set from '../hooks/use-web3.hook';

const Web3Context = createContext();

export default function Web3Provider({ children }) {
  const [isSetMetamask, netwrokID, address, web3Tools] = useWeb3Set();

  return (
    <Web3Context.Provider
      value={{
        isSetMetamask,
        netwrokID,
        address,
        ...web3Tools,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  return useContext(Web3Context);
};
