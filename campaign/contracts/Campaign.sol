pragma solidity ^0.4.24;

contract Campaign {
    // Type definition, doesn't create a variable
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    address[] public approvers;
    
  modifier restrictedToOwner() {
    require(msg.sender == manager);
    _;
  }
    
    constructor(uint minimum) public {
        manager = msg.sender;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        
        approvers.push(msg.sender);
    }
    
    function createRequest(string description, uint value, address recipient) 
        public restrictedToOwner {
        Request newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false
        });
        
        requests.push(newRequest);
    }
}