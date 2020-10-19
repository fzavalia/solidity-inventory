// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
   Create and transfer ownership of items.
   The functions I have in mind are:
    - createItem # Creates a new item for the user
    - buyItem    # Requests approval from the owner of the item to purchase the item
 */
contract Inventory {
    struct Item {
        string name;
        string description;
        uint256 price;
        bool exists;
    }

    uint256 itemIdCounter = 1;

    mapping(uint256 => Item) items;
    mapping(uint256 => address) itemOwners;

    event ItemCreated(uint256 id);

    function createItem(
        string memory name,
        string memory description,
        uint256 price
    ) public {
        Item storage item = items[itemIdCounter];
        item.name = name;
        item.description = description;
        item.price = price;
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
            uint256 price,
            bool exists,
            address owner
        )
    {
        Item memory item = items[id];
        return (
            item.name,
            item.description,
            item.price,
            item.exists,
            itemOwners[id]
        );
    }

    function buyItem(uint256 id) public {
        Item memory item = items[id];
        require(item.exists);
        address payable owner = payable(itemOwners[id]);
        owner.transfer(item.price);
    }
}
