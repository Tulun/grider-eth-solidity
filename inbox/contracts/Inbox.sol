pragma solidity ^0.4.24;

contract Inbox {
    // Note: by declaring public, getMessage like function declared for free.
    string public message;
    
    // Constructor function. Has the same name as the contract.
    constructor(string initialMessage) public {
        message = initialMessage;
    }
    
    // Public functions are callable from anyone on the blockchain
    function setMessage(string newMessage) public {
        message = newMessage;
    }
    
    // Function Name      Function Type (view means it doesn't modify the data.)  
    // function getMessage() public view returns (string) {
    //     return message;
    // }
}
