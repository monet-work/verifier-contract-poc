const express = require('express');
const Web3 = require('web3');
const dotenv = require('dotenv');
// import express from 'express';
// import dotenv from 'dotenv';
// import web3 from 'web3';
// const Web3 = web3.Web3;

dotenv.config(); // This loads the environment variables from the .env file

const app = express();
app.use(express.json()); // For parsing application/json

async function main() {
    const PORT = process.env.PORT || 3000;
const serverPrivateKey = process.env.SERVER_PRIVATE_KEY; 
var web3 = new Web3.Web3(Web3.givenProvider || "http://localhost:8545");
let balance = await web3.eth.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
console.log('balance ', balance);
 
// Endpoint to sign the message
app.post('/signMessage', async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).send('Message is required');
    }

    try {
        const messageHash = web3.utils.sha3(message);
        const signature = await web3.eth.accounts.sign(messageHash, serverPrivateKey);
        
        res.json({
            message: message,
            signature: signature.signature
        });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
}


(async () => {
    await main();
})()