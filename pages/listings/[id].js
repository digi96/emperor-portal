import { useEffect, useState } from 'react';
import {
  getOpenListingByListingId,
  getOpenListingIds,
} from '../../util/interact';
const marketplaceContractABI = require('../../abi/marketplace-abi.json');
const marketplaceContractAddress =
  process.env.NEXT_PUBLIC_MARTKETPLACE_CONTRACT;
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const web3 = createAlchemyWeb3(alchemyKey);

export const getStaticPaths = async () => {
  console.log('getting sale listings..');
  let openListingIds = await getOpenListingIds();
  const paths = openListingIds.map((listingId) => {
    return {
      params: { id: listingId.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  console.log('getStaticProps been called....,id:', id);
  let listing = await getOpenListingByListingId(id);
  listing = JSON.stringify(listing);
  return {
    props: { listing },
  };
};

const Details = ({ listing }) => {
  const [install, setInstall] = useState(false);
  const [network, setNetwork] = useState(false); //False if wrong network
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const checkMetamask = async () => {
      setInstall(!window.ethereum);
      if (window.ethereum) {
        const networkVersion = await window.ethereum.request({
          method: 'net_version',
        });
        console.log(networkVersion);
        setNetwork(networkVersion == process.env.NEXT_PUBLIC_NET_VERSION);

        window.ethereum.on('chainChanged', (networkVersion) => {
          console.log('chainChanged', networkVersion);
          //window.location.reload();
          let nv10 = parseInt(networkVersion);
          setNetwork(nv10 == process.env.NEXT_PUBLIC_NET_VERSION);
        });
      }
    };

    checkMetamask();
  }, []);

  if (install) return <p>Install MetaMask</p>;
  if (!network) return <p>Detecting network or wrong network detected.</p>;

  const onPurchasePressed = async () => {
    var listingVar = JSON.parse(listing);
    console.log(listingVar.id);
    console.log(listingVar.price);
    let callResult = await purchaseListing(listingVar.id, listingVar.price);

    if (callResult.success) {
      console.log('purchase transaction sent...');
    } else {
      console.log(`purchase transaction failed, error:${callResult.status}`);
    }

    setStatus(callResult.status);
  };

  const purchaseListing = async (listingId, price) => {
    window.contract = await new web3.eth.Contract(
      marketplaceContractABI,
      marketplaceContractAddress
    );

    console.log(window.contract);

    //console.log(listingId, price);

    console.log(listingId);
    console.log(price);

    const valueToSend = web3.utils.toHex(price);

    const transactionParameters = {
      to: marketplaceContractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: valueToSend,
      data: window.contract.methods
        .purchase(listingId, window.ethereum.selectedAddress)
        .encodeABI(),
    };

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      return {
        success: true,
        status:
          '✅ Check out your transaction on Etherscan: https://mumbai.polygonscan.com/tx/' +
          txHash,
        data: txHash,
      };
    } catch (error) {
      return {
        success: false,
        status: '😥 Something went wrong: ' + error.message,
      };
    }
  };

  //return <div>OK</div>;
  console.log(listing);
  var listingVar = JSON.parse(listing);
  return (
    <div className="container text-left">
      <div className="row row-col2">
        <div className="col">
          <img className="img-fluid" src={listingVar.emperor.imageUrl} />
        </div>
        <div className="col">
          <p className="h5">{listingVar.emperor.name}</p>
          <p>
            Type:&nbsp;<b>{listingVar.tokenType}</b>
          </p>
          <p>
            Price:&nbsp;<b>{web3.utils.fromWei(listingVar.price, 'ether')}</b>{' '}
            ether
          </p>
          <p>{listingVar.emperor.description}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onPurchasePressed}
          >
            Buy
          </button>
          <p id="status" style={{ color: 'red' }}>
            {status}
          </p>
        </div>
      </div>
    </div>
  );
  //return <div>OK</div>;
};

export default Details;
