import { Network, Alchemy } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';

const settings = {
  apiKey: 'RGTstijY3MSXs6GoZEGouh2rdw50n0DR', // Replace with your Alchemy API Key.
  network: Network.MATIC_MUMBAI, // Replace with your network.
};

const NFTs = () => {
  const { address, signed } = useAuth();
  const [contractNFTs, setContractNFTs] = useState(null);
  const [pageSize, setPageSize] = useState(20);
  const [pageKey, setPageKey] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getNFTsForContract();
    if (signed) {
      console.log('user has signed...');
    } else {
      console.log('user has not signed...');
    }
  }, [pageKey, isLoading, signed]);

  const getNFTsForContract = async () => {
    console.log('getNFTsForContract been called......');
    if (!contractNFTs) {
      setIsLoading(true);

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

      // Print contract address and tokenId for each NFT:
      for (const nft of response.nfts) {
        console.log('===');
        console.log('contract address:', nft.contract.address);
        console.log('token ID:', nft.tokenId);
      }
      console.log('===');

      console.log(response);
      setIsLoading(false);
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
            return (
              <div className="col" key={i}>
                <div className="cacrd" key={i}>
                  <img src={NFT.rawMetadata.image} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title">{NFT.name}</h5>
                    <p className="card-text">Token Id: {NFT.tokenId}</p>
                    <p className="card-text text-truncate">{NFT.description}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
      {isLoading ? <div>Loading.......</div> : <div></div>}
      <p>
        {pageKey > 1 && (
          <button type="buttom" onClick={onFirsrtPageClick}>
            First
          </button>
        )}
        {pageKey > pageSize && (
          <button type="buttom" onClick={onPreviousPageClick}>
            Previous
          </button>
        )}
        <button type="buttom" onClick={onNextPageClick}>
          Next
        </button>
      </p>
      <p>
        Token Id: From {pageKey} To {pageKey + pageSize}
      </p>
    </div>
  );
};

export default NFTs;
