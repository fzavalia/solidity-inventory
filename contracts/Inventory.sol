// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Inventory {
    struct Item {
        string name;
        string description;
        address owner;
        bool exists;
    }

    struct Order {
        uint256 itemId;
        uint256 amount;
        address issuer;
        bool exists;
    }

    uint256 itemIdCounter = 1;
    uint256 orderIdCounter = 1;

    mapping(uint256 => Item) items;
    mapping(uint256 => Order) orders;

    event ItemCreated(uint256 itemId);
    event OrderCreated(uint256 orderId);
    event OrderAccepted(uint256 orderId);
    event OrderDeclined(uint256 orderId);

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function createItem(string memory name, string memory description) public {
        Item storage item = items[itemIdCounter];
        item.name = name;
        item.description = description;
        item.exists = true;
        item.owner = msg.sender;

        emit ItemCreated(itemIdCounter);

        itemIdCounter++;
    }

    function getItem(uint256 id)
        public
        view
        returns (
            string memory name,
            string memory description,
            address owner
        )
    {
        Item memory item = items[id];
        require(item.exists, "Item must exist");
        return (item.name, item.description, item.owner);
    }

    function createOrder(uint256 itemId) public payable {
        uint256 amount = msg.value;
        Item memory item = items[itemId];
        require(item.exists, "Item must exist");

        Order storage order = orders[orderIdCounter];
        order.itemId = itemId;
        order.amount = amount;
        order.issuer = msg.sender;
        order.exists = true;

        emit OrderCreated(orderIdCounter);

        orderIdCounter++;
    }

    function getOrder(uint256 orderId)
        public
        view
        returns (
            uint256 amount,
            uint256 itemId,
            address issuer
        )
    {
        Order memory order = orders[orderId];
        require(order.exists, "Order must exist");
        return (order.amount, order.itemId, order.issuer);
    }

    function acceptOrder(uint256 orderId) public {
        Order memory order = orders[orderId];
        require(order.exists, "Order must exist");

        Item storage item = items[order.itemId];
        require(item.owner == msg.sender, "Must be the owner of the item");

        item.owner = order.issuer;
        delete orders[orderId];

        msg.sender.transfer(order.amount);
        emit OrderAccepted(orderId);
    }

    function declineOrder(uint256 orderId) public {
        Order memory order = orders[orderId];
        require(order.exists, "Order must exist");

        Item memory item = items[order.itemId];
        require(item.owner == msg.sender, "Must be the owner of the item");

        delete orders[orderId];

        payable(order.issuer).transfer(order.amount);
        emit OrderDeclined(orderId);
    }
}
