// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.0;

contract Storage{ 
    mapping(address => uint256) public nonces;
    mapping(bytes32 => bool) public usedSignatures;

   function migratePoints(address signer, uint256 points,uint256 nonce, bytes memory signature) external  returns(bool) {
      require(nonce == nonces[signer], "Invalid nonce");
      // get message hash
      bytes32 messageHash = getMessageHash(points, nonce);
      // get signed hash
      bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
      // ensure signature has not been used 
      require(!usedSignatures[ethSignedMessageHash], "Signature has already been used");
      // check if signers match
      require(recover(ethSignedMessageHash, signature) == signer, "Invalid signature");
      // increment user nonce
      nonces[signer]++;
      // mark signature as used
      usedSignatures[ethSignedMessageHash] = true;
   }  

   function getMessageHash(uint256 points, uint256 nonce) public pure returns(bytes32) {
       return keccak256(abi.encodePacked(points, nonce));
   } 

   function getEthSignedMessageHash(bytes32 _messageHash) public pure returns(bytes32) {
       return keccak256(abi.encodePacked(
        "\x19Ethereum Signed Message:\n32",
        _messageHash
       ));
   } 

   function recover(bytes32 _ethSignedMessageHash, bytes memory _sig) public pure returns(address signer) {
       (
          bytes32 r,
          bytes32 s,
          uint8 v
       ) = _split(_sig);

       signer =  ecrecover(_ethSignedMessageHash, v, r, s);
       return signer;
   } 

   function _split(bytes memory _sig) public pure returns(   bytes32 r, bytes32 s, uint8 v) {
      require(_sig.length == 65, "Invalid signature length");
      // 
      assembly{
        r := mload(add(_sig, 32)) // skips the first 32 bytes which is the length (and picks the next 32 bytes)
        s := mload(add(_sig, 64))
        v := byte(0, mload(add(_sig, 96))) // gets the first byte from the 32 bytes after 96
      }
   }
}



 