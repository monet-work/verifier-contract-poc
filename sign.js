const Web3 = require('web3'); 
const ethUtil = require('ethereumjs-util');

const { keccak256 } = require('js-sha3');
const web3 = require('web3');

async function main() {
    //  const signer ='0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f'
    const serverPrivateKey = "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97"
    let points = 100; 
    let nonce = 1;

    // Properly encode the integer as a 32 bytes hex string, aligning with Solidity's abi.encodePacked
    const encodedPoints = web3.utils.soliditySha3({t: 'uint256', v: points}, {t: 'uint256', v: nonce});
    // Sign the message
    const signature = web3.eth.accounts.sign(encodedPoints, serverPrivateKey);

    console.log("Encoded Points:", encodedPoints);
    console.log("Signature Object:", signature);
}

(async () => {
    await main();
})()