import EmperorClass from './EmperorClass.js';
import ListingClass from './ListingClass.js';
import { pinJSONToIPFS } from './pinata.js';
import axios from 'axios';
//require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const alchemyKeyRinkeby = process.env.REACT_APP_ALCHEMY_KEY_RINKEBY;
const emperorContractABI = require('../abi/emperor-abi.json');
const emperorFusionContractABI = require('../abi/emperorfusion-abi.json');
const marketplaceContractABI = require('../abi/marketplace-abi.json');
const tokenContractABI = require('../abi/matic-abi.json');

const emperorContractAddress = process.env.REACT_APP_EMPEROR_CONTRACT;
const emperorFusionContractAddress =
  process.env.REACT_APP_EMPERORFUSION_CONTRACT;
const marketplaceContractAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT;
const maticTokenAddress = '0x0000000000000000000000000000000000001010';

const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(alchemyKey);
//const web3 = createAlchemyWeb3("http://localhost:8545");

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const obj = {
        status: 'Wallet conntected.',
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: '',
        status: '😥 ' + err.message,
      };
    }
  } else {
    return {
      address: '',
      status: (
        <span>
          <p>
            {' '}
            🦊{' '}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: 'Wallet connected.',
        };
      } else {
        return {
          address: '',
          status: '🦊 Connect to Metamask using the top right button.',
        };
      }
    } catch (err) {
      return {
        address: '',
        status: '😥 ' + err.message,
      };
    }
  } else {
    return {
      address: '',
      status: (
        <span>
          <p>
            {' '}
            🦊{' '}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

async function loadContract() {
  return new web3.eth.Contract(emperorContractABI, emperorContractAddress);
}

export const mintNFT = async (url, name, description) => {
  if (url.trim() == '' || name.trim() == '' || description.trim() == '') {
    return {
      success: false,
      status: '❗Please make sure all fields are completed before minting.',
    };
  }

  //make metadata
  const metadata = new Object();
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;

  var trait1 = new Object();
  trait1.name = 'Stamina';
  trait1.value = 3;

  var trait2 = new Object();
  trait2.name = 'Power';
  trait2.value = 9;

  var traits = new Array();
  traits.push(trait1);
  traits.push(trait2);

  metadata.traits = traits;

  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: '😢 Something went wrong while uploading your tokenURI.',
    };
  }
  const tokenURI = pinataResponse.pinataUrl;

  console.log(emperorContractABI);

  window.contract = await new web3.eth.Contract(
    emperorContractABI,
    emperorContractAddress
  );

  const transactionParameters = {
    to: emperorContractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
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

export const getUserOwnedNFTs = async (address) => {
  const nfts = await web3.alchemy.getNfts({
    owner: address,
    contractAddresses: [emperorContractAddress],
  });
  console.log(nfts);
  return nfts;
};

export const getTokenBalance = async (ownerAddr) => {
  try {
    const maticTokenContract = new web3.eth.Contract(
      tokenContractABI,
      maticTokenAddress
    );
    const result = await maticTokenContract.methods.balanceOf(ownerAddr).call();
    //console.log(web3.utils.fromWei(result, 'ether'));
    var amount = web3.utils.fromWei(result, 'ether');
    return amount;
  } catch (error) {
    console.log(error);
    return null;
  }

  //return balances;
};

export const getConnectedChainId = async () => {
  // const result = await web3.eth.getChainId().then((chainId) => {
  //   //console.log(chainId);
  //   return chainId;
  // });

  const result = await web3.eth.net.getId().then((chainId) => {
    console.log(chainId);
    return chainId;
  });

  return result;
};

export const getContractEvent = async (contractName, eventName) => {
  var contract = null;

  if (contractName === 'Emperor') {
    contract = new web3.eth.Contract(
      emperorContractABI,
      emperorContractAddress
    );
  } else if (contractName === 'Marketplace') {
    contract = new web3.eth.Contract(
      marketplaceContractABI,
      marketplaceContractAddress
    );
  } else {
    throw 'Unexpected contract name';
  }

  console.log(`getting event from contract ${contractName}`);

  let latest_block = await web3.eth.getBlockNumber();

  let eventsResult = await contract.getPastEvents(
    eventName,
    {
      fromBlock: latest_block - 6,
      toBlock: 'latest',
    },
    function (error, events) {
      if (error) {
        console.log(error);
        return null;
      }
      console.log(events);
      return events;
    }
  );
  return eventsResult;
};

export const getNFTTokenURI = async (tokenType, tokenId) => {
  try {
    var tokenUri = '';
    console.log(
      'begin to call getTokenURI, type:' + tokenType + ',tokenId:' + tokenId
    );
    if (tokenType == 0) {
      const emperorContract = new web3.eth.Contract(
        emperorContractABI,
        emperorContractAddress
      );
      tokenUri = await emperorContract.methods.tokenURI(tokenId).call();
    } else if (tokenType == 1) {
      const emperorFusionContract = new web3.eth.Contract(
        emperorFusionContractABI,
        emperorFusionContractAddress
      );
      tokenUri = await emperorFusionContract.methods.uri(tokenId).call();
    } else {
      throw new Error('Invalid tokenType:' + tokenType);
    }
    //console.log(result);
    return tokenUri;
  } catch (error) {
    console.log('Failed to get metadataURL:' + error);
    return null;
  }
};

export const signMessage = async (messageToSign) => {
  try {
    const from = window.ethereum.selectedAddress;
    const sign = await window.ethereum.request({
      method: 'personal_sign',
      params: [messageToSign, from, 'emperor'],
    });

    console.log('sign : ' + sign);

    return {
      success: true,
      status: 'Sign successfully',
      data: sign,
    };
  } catch (error) {
    return {
      success: false,
      status: '😥 Something went wrong: ' + error.message,
    };
  }
};

export const verifyMessage = async (messageToVerify, signature) => {
  try {
    const from = window.ethereum.selectedAddress;
    const recoveredAddr = web3.eth.accounts.recover(messageToVerify, signature);
    if (from.toLowerCase() == recoveredAddr.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getOpenListings = async () => {
  try {
    console.log(marketplaceContractAddress);
    const marketplaceContract = new web3.eth.Contract(
      marketplaceContractABI,
      marketplaceContractAddress
    );
    const result = await marketplaceContract.methods.getUnsoldListings().call();
    console.log(
      'printing result of getUnsoldListings.............................'
    );
    console.log(result);
    let mappedSaleListings = [];
    for (let i = 0; i < result.length; i++) {
      let element = result[i];
      console.log(
        'Getting metadat url for type:' + element[1] + ', id:' + element[2]
      );
      let metadataURL = await getNFTTokenURI(element[1], element[2]);
      var emperorTemp = null;
      console.log('metadataURL:' + metadataURL);
      if (metadataURL.length > 0) {
        console.log('axios:getting metadata for url:' + metadataURL);
        await axios
          .get(metadataURL)
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
          })
          .then((res) => {
            const nftMetadata = res.data;
            console.log(nftMetadata);

            emperorTemp = EmperorClass.EmperorFactory(
              element[2],
              nftMetadata.name,
              nftMetadata.image.replace(
                'gateway.pinata.cloud',
                'ipfs.digi96.com'
              ),
              nftMetadata.description
            );

            if (emperorTemp != null) {
              console.log('Emperor has been initialized...');
              //console.log(emperorTemp);

              let saleListing = ListingClass.ListingFactory(
                element[0],
                element[1],
                element[2],
                element[4],
                element[3],
                emperorTemp
              );

              if (saleListing != null) {
                console.log('SaleListing has been initialized...');
                mappedSaleListings.push(saleListing);
              }
            } else {
              console.log('Failed to get emperor');
            }
          });
      }
    }

    console.log('returning salelistings from interact...');
    return mappedSaleListings;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getOpenListingByListingId = async (listingId) => {
  try {
    console.log(marketplaceContractAddress);
    const marketplaceContract = new web3.eth.Contract(
      marketplaceContractABI,
      marketplaceContractAddress
    );
    const result = await marketplaceContract.methods.getUnsoldListings().call();
    console.log(
      'printing result of getUnsoldListings in getOpenListingByListingId............................'
    );
    console.log(result);
    let mappedSaleListing = null;
    for (let i = 0; i < result.length; i++) {
      let element = result[i];
      if (element[0] != listingId) {
        continue;
      }

      console.log(
        'Getting metadat url for type:' + element[1] + ', id:' + element[2]
      );
      let metadataURL = await getNFTTokenURI(element[1], element[2]);
      var emperorTemp = null;
      console.log('metadataURL:' + metadataURL);
      if (metadataURL.length > 0) {
        console.log('axios:getting metadata for url:' + metadataURL);
        await axios
          .get(metadataURL)
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
          })
          .then((res) => {
            const nftMetadata = res.data;
            console.log(nftMetadata);

            emperorTemp = EmperorClass.EmperorFactory(
              element[2],
              nftMetadata.name,
              nftMetadata.image.replace(
                'gateway.pinata.cloud',
                'ipfs.digi96.com'
              ),
              nftMetadata.description
            );

            if (emperorTemp != null) {
              console.log('Emperor has been initialized...');
              //console.log(emperorTemp);

              let saleListing = ListingClass.ListingFactory(
                element[0],
                element[1],
                element[2],
                element[4],
                element[3],
                emperorTemp
              );

              if (saleListing != null) {
                console.log('SaleListing has been initialized...');
                mappedSaleListing = saleListing;
              }
            } else {
              console.log('Failed to get emperor');
            }
          });
      }
    }

    return mappedSaleListing;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getOpenListingIds = async () => {
  try {
    console.log(marketplaceContractAddress);
    const marketplaceContract = new web3.eth.Contract(
      marketplaceContractABI,
      marketplaceContractAddress
    );
    const result = await marketplaceContract.methods.getUnsoldListings().call();
    //console.log(result);
    let mappedSaleListingIds = [];
    for (let i = 0; i < result.length; i++) {
      let element = result[i];
      mappedSaleListingIds.push(element[0]);
    }
    console.log(mappedSaleListingIds);
    return mappedSaleListingIds;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const purchaseListing = async (listingId, price) => {
  window.contract = await new web3.eth.Contract(
    marketplaceContractABI,
    marketplaceContractAddress
  );

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

export const getNFTOwner = async (tokenId) => {
  try {
    const emperorContract = new web3.eth.Contract(
      emperorContractABI,
      emperorContractAddress
    );
    const result = await emperorContract.methods.ownerOf(tokenId).call();
    //console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const checkIsSetApprovalForNFTTransfer = async (owner) => {
  try {
    const emperorContract = new web3.eth.Contract(
      emperorContractABI,
      emperorContractAddress
    );
    const result = await emperorContract.methods
      .isApprovedForAll(owner, marketplaceContractAddress)
      .call();
    //console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const setApprovalForNFTTransfer = async () => {
  window.contract = await new web3.eth.Contract(
    emperorContractABI,
    emperorContractAddress
  );

  const transactionParameters = {
    to: emperorContractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .setApprovalForAll(marketplaceContractAddress, true)
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

export const createSecondaryListing = async (tokenId, price) => {
  window.contract = await new web3.eth.Contract(
    marketplaceContractABI,
    marketplaceContractAddress
  );

  const weiValue = web3.utils.toWei(price, 'ether');
  console.log(weiValue);

  const valuePrice = web3.utils.toHex(weiValue);

  const transactionParameters = {
    to: marketplaceContractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .createSecondaryListing(tokenId, valuePrice)
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

// export function initiateWeb3Instance(chainId) {
//   console.log(`initiating web3-alchemy instance.....chain id:${chainId}`);
//   if (chainId == 4) {
//     web3 = createAlchemyWeb3(alchemyKeyRinkeby);
//   } else if (chainId == 80001) {
//     web3 = createAlchemyWeb3(alchemyKey);
//   } else {
//     console.log('invalid chain id');
//     throw 'invalid chain id';
//   }
// }
