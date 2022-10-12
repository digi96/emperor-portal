import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { useAuth } from '../../providers/AuthProvider';
import { useWeb3 } from '../../providers/Web3Provider';

const Sign = () => {
  const { signed, unsignMessage, setSignature } = useAuth();
  const { isSetMetamask, netwrokID, address, signMessage } = useWeb3();

  const router = useRouter();

  const onSignMessagePressed = async () => {
    const signResult = await signMessage();
    if (signResult.success) {
      setSignature(signResult.data);
      router.push('/member');
    } else {
      alert(signResult.status);
    }
  };

  if (!isSetMetamask) return <p>Install MetaMask</p>;

  return (
    <div>
      <h1>Sign Message</h1>
      <br />
      {isSetMetamask && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSignMessagePressed}
        >
          Sign
        </button>
      )}
    </div>
  );
};

export default Sign;
