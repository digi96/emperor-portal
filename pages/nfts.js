import { Network, Alchemy } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

const settings = {
  apiKey: 'rnzrc-FwbrpeWhaJ36Pjdg11zi3YwaIu', // Replace with your Alchemy API Key.
  network: Network.MATIC_MUMBAI, // Replace with your network.
};

const NFTs = () => {
  const [contractNFTs, setContractNFTs] = useState(null);
  const [pageSize, setPageSize] = useState(20);
  const [pageKey, setPageKey] = useState(1);

  useEffect(() => {
    getNFTsForContract();
  }, [pageKey]);

  const getNFTsForContract = async () => {
    console.log('getNFTsForContract been called......');
    if (!contractNFTs) {
      const alchemy = new Alchemy(settings);

      let queryOptions = {
        pageKey: pageKey,
        pageSize: pageSize,
      };

      // Print total NFT collection returned in the response:
      const response = await alchemy.nft.getNftsForContract(
        '0xE1838873761d347867fA78981B5ee4395BC8409c',
        queryOptions
      );

      console.log(response);
      setContractNFTs(response);
    } else {
      console.log('contracts NFTs data already loaded.....');
    }
  };

  const onNextPageClick = () => {
    let nextPageKey = pageKey + pageSize;
    setPageKey(nextPageKey);
    setContractNFTs(null);
  };

  const onFirsrtPageClick = () => {
    setPageKey(1);
    setContractNFTs(null);
  };

  const onPreviousPageClick = () => {
    let previousPageKey = pageKey - pageSize;
    setPageKey(previousPageKey);
    setContractNFTs(null);
  };

  return (
    <div className="container text-left">
      <div className="row row-cols-3">
        {contractNFTs && contractNFTs.nfts.length > 0 ? (
          contractNFTs.nfts.map(function (NFT, i) {
            if (NFT.description.length > 0) {
              return (
                <div className="col" key={i}>
                  <div className="cacrd" key={i}>
                    <img
                      src={NFT.rawMetadata.image.replace(
                        'gateway.pinata.cloud',
                        'ipfs.digi96.com'
                      )}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{NFT.name}</h5>
                      <p className="card-text">Token Id: {NFT.tokenId}</p>
                      <p className="card-text text-truncate">
                        {NFT.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          })
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <button type="buttom" onClick={onFirsrtPageClick}>
        First
      </button>
      <button type="buttom" onClick={onPreviousPageClick}>
        Previous
      </button>
      <button type="buttom" onClick={onNextPageClick}>
        Next
      </button>
    </div>
  );
};

export default NFTs;
