import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import useWeb3Set from './use-web3.hook';

const useCurrentUser = () => {
  const [isSetMetamask, netwrokID, address, web3Tools] = useWeb3Set();
  const [signature, setSignature] = useState();
  const [cookies, setCookie, removeCookie] = useCookies(['signature']);

  const unsignMessage = async () => {
    try {
      removeCookie('signature', null, { path: '/' });
      console.log('Unsign successfully');
      setSignature(null);
      return {
        success: true,
        status: 'Unsign successfully',
      };
    } catch (error) {
      return {
        success: false,
        status: '😥 Something went wrong: ' + error.message,
      };
    }
  };

  const userTools = {
    unsignMessage: unsignMessage,
    setSignature: async (data) => {
      setSignature(data);
      setCookie('signature', data, { path: '/' });
    },
  };

  useEffect(() => {
    setSignature(null);

    const checkSignature = async () => {
      console.log('checking signature.....');
      if (cookies) {
        const signatureFromCookie = cookies.signature;
        if (!signatureFromCookie) {
          console.log('There is no signature in cookies.');
        } else {
          console.log(signatureFromCookie);
          let checkSignature = await web3Tools.verifyMessage(
            'Welcome to vist Emperor, this request is to get a signature from you, here after we will use this signature to get your wallet address',
            signatureFromCookie
          );

          if (checkSignature) {
            //console.log('set signature...');
            setSignature(cookies.signature);
          } else {
            setSignature(null);
          }
        }
      }
    };

    checkSignature();
  });

  return [signature != null, signature, userTools];
};

export default useCurrentUser;
