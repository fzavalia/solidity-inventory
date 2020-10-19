// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Inventory {
    struct Item {
        string name;
        string description;
        bool exists;
    }

    uint256 itemIdCounter = 1;

    mapping(uint256 => Item) items;
    mapping(uint256 => address payable) itemOwners;

    event ItemCreated(uint256 id);

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function createItem(string memory name, string memory description) public {
        Item storage item = items[itemIdCounter];
        item.name = name;
        item.description = description;
        item.exists = true;
        itemOwners[itemIdCounter] = msg.sender;
        emit ItemCreated(itemIdCounter);
        itemIdCounter++;
    }

    function getItem(uint256 id)
        public
        view
        returns (
            string memory name,
            string memory description,
            bool exists,
            address owner
        )
    {
        Item memory item = items[id];
        require(item.exists, "Item must exist");
        return (item.name, item.description, item.exists, itemOwners[id]);
    }
}
