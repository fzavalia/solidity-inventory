// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Inventory {
    struct Item {
        string name;
        string description;
    }

    uint256 counter = 0;

    mapping(uint256 => Item) items;
    mapping(address => mapping(uint256 => uint256)) itemsByAddress;

    event ItemCreated(uint256 _itemId);

    function createItem(string memory _name, string memory _description)
        public
    {
        Item memory item = items[counter];
        item.name = _name;
        item.description = _description;

        itemsByAddress[msg.sender][counter] = counter;

        emit ItemCreated(counter);

        counter++;
    }

    function hasItem(uint256 _itemId) public view returns (bool) {
        return itemsByAddress[msg.sender][_itemId] == _itemId;
    }
}
