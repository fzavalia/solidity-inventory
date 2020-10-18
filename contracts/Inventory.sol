// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Inventory {
    struct Item {
        string name;
        string description;
        address creator;
    }

    uint256 counter = 1;

    mapping(uint256 => Item) items;
    mapping(address => mapping(uint256 => bool)) items_by_address;

    event ItemCreated(uint256 _item_id, address _creator);
    event ItemTransfered(uint256 _item_id, address _from, address _to);

    function create_item(string memory _name, string memory _description)
        public
    {
        _create_item(_name, _description);
        _add_item_to_address(counter, msg.sender);
        emit ItemCreated(counter, msg.sender);
        counter++;
    }

    function transfer_item(uint256 _item_id, address _to) public {
        require(has_item(_item_id));
        _remove_item_from_address(_item_id, msg.sender);
        _add_item_to_address(_item_id, _to);
        emit ItemTransfered(_item_id, msg.sender, _to);
    }

    function has_item(uint256 _item_id) public view returns (bool) {
        return items_by_address[msg.sender][_item_id];
    }

    function get_item(uint256 _item_id)
        public
        view
        returns (
            string memory,
            string memory,
            address
        )
    {
        Item memory _item = items[_item_id];
        return (_item.name, _item.description, _item.creator);
    }

    function _create_item(string memory _name, string memory _description)
        private
    {
        Item storage item = items[counter];
        item.name = _name;
        item.description = _description;
        item.creator = msg.sender;
    }

    function _add_item_to_address(uint256 _item_id, address _address) private {
        items_by_address[_address][_item_id] = true;
    }

    function _remove_item_from_address(uint256 _item_id, address _address)
        private
    {
        delete items_by_address[_address][_item_id];
    }
}
