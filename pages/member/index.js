import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useWeb3 } from '../../providers/Web3Provider';
const Member = () => {
  const { signed, unsignMessage, setSignature } = useAuth();
  const { isSetMetamask, netwrokID, address, signMessage } = useWeb3();
  const router = useRouter();

  useEffect(() => {
    if (isSetMetamask && !signed) {
      router.push('/member/sign');
    }
  }, [isSetMetamask, address, signed]);

  const onSignMessagePressed = async () => {
    const signResult = await signMessage();
    console.log(signResult);
    if (signResult.success) {
      console.log('sign message succeed, updating signature...');
      setSignature(signResult.data);
    } else {
      alert('sign failed.');
    }
  };

  const onUnsignMessagePressed = async () => {
    const unsignResult = await unsignMessage();
    if (unsignResult.success) {
      router.push('/member/sign');
    } else {
      alert('Unsign failed.');
    }
  };

  return (
    <div>
      <p>Connected Address: {address}</p>
      <p>Networkd ID:{netwrokID}</p>
      Member Page
      {signed && (
        <div>
          Signature is valid...<br></br>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onUnsignMessagePressed}
          >
            Unsign
          </button>
        </div>
      )}
      {!signed && (
        <div>
          Signature in invalid or not exist...<br></br>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSignMessagePressed}
          >
            Sign
          </button>
        </div>
      )}
    </div>
  );
};

export default Member;
