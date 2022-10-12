import { useEffect, useState } from 'react';
//import useCurrentUser from './use-current-user.hook';

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(alchemyKey);

const useWeb3Set = () => {
  //const [userTools] = useCurrentUser();
  const [isSetMetamask, setIsSetMetamask] = useState();
  const [netwrokID, setNetworkID] = useState();
  const [address, setAddress] = useState();

  const signMessage = async () => {
    try {
      const messageToSign =
        'Welcome to vist Emperor, this request is to get a signature from you, here after we will use this signature to get your wallet address';
      const from = window.ethereum.selectedAddress;
      if (from) {
        console.log('signing message for address:' + from);
        const sign = await window.ethereum.request({
          method: 'personal_sign',
          params: [messageToSign, from, 'emperor'],
        });

        console.log('sign : ' + sign);
        //userTools.setSignature(sign);

        return {
          success: true,
          status: 'Sign successfully',
          data: sign,
        };
      } else {
        return {
          success: false,
          status: 'No address selected.',
        };
      }
    } catch (error) {
      return {
        success: false,
        status: '😥 Something went wrong: ' + error.message,
      };
    }
  };

  const verifyMessage = async (messageToVerify, signature) => {
    try {
      const from = window.ethereum.selectedAddress;
      console.log('verying signature..., address:' + from);

      const recoveredAddr = web3.eth.accounts.recover(
        messageToVerify,
        signature
      );

      if (from.toLowerCase() == recoveredAddr.toLowerCase()) {
        console.log('signature and address are valid.');
        return true;
      } else {
        console.log('signature and address are invalid.');
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const web3Tools = {
    signMessage: signMessage,
    verifyMessage: verifyMessage,
  };

  useEffect(() => {
    const getInfo = async () => {
      if (window.ethereum) {
        const networkVersion = await window.ethereum.request({
          method: 'net_version',
        });
        setNetworkID(networkVersion);
        setAddress(window.ethereum.selectedAddress);
      }
    };

    if (window.ethereum) {
      setIsSetMetamask(true);

      //register events
      window.ethereum.on('chainChanged', (networkVersion) => {
        console.log('chainChanged', networkVersion);
        let nv10 = parseInt(networkVersion);
        setNetworkID(nv10);
      });

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          setAddress(null);
        }
      });
    } else {
      setIsSetMetamask(false);
    }

    getInfo();
  });

  return [isSetMetamask, netwrokID, address, web3Tools];
};

export default useWeb3Set;
