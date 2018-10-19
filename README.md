Stephen Grider's Udemy course.

# General Solidity notes
Functions require you to return a function type.

1) public - anyone can call this function
2) private - the contract itself can call it.
The above is only usuable once per function.

3) view - this function returns data and does not modify the contract's data.
4) constant - this functions returns data and does not modify the contract's data.
5) pure - function will not modify or even read the contract's data.
6) payable - when someone calls this function, they might send along ETH
