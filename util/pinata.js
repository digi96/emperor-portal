//require("dotenv").config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;
const axios = require('axios');
//const fs = require('fs');
const FormData = require('form-data');

export const pinJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataUrl:
          'https://gateway.pinata.cloud/ipfs/' + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const pinFileToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  console.log(file);
  data.append('file', file);

  return axios
    .post(url, data, {
      maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      //handle response here
      console.log(response);
      return {
        success: true,
        pinataUrl: 'https://ipfs.digi96.com/ipfs/' + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      //handle error here
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
