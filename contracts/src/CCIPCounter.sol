// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.9;

// contract CCIPCounter {

   
//    function increaseRemove() external {

//         Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
//             receiver: abi.encode(_receiver),               // Receiver contract at destination
//             data: abi.encode("Hello world!"),              // Send "Hello world!"
//             tokenAmounts: new Client.EVMTokenAmount[](0),  // No tokens to be sent
//             extraArgs: "",                                 // Use default values
//             feeToken: address(_addressLink)                // Setting feeToken to LINK
//         });

//         // Send the message through the router and store the returned message ID
//         bytes32 messageId = router.ccipSend(destinationChainSelector,message);
 
//    }

// }
