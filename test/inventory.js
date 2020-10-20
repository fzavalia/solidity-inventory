const Inventory = artifacts.require("Inventory");

contract(Inventory, (accounts) => {
  it("should create item on createItem", async () => {
    const inventory = await Inventory.deployed();
    const args = { from: accounts[0] };
    const result = await inventory.createItem("name", "desc", args);
    const log = result.logs[0];
    assert.equal(log.event, "ItemCreated");
    assert.equal(log.args.itemId, 1);
  });

  it("should fail on getItem if the item does not exist", async () => {
    const inventory = await Inventory.deployed();
    await shouldFail(inventory.getItem(2), "Item must exist");
  });

  it("should get item on getItem", async () => {
    const inventory = await Inventory.deployed();
    const item = await inventory.getItem(1);
    assert.equal(item.name, "name");
    assert.equal(item.description, "desc");
    assert.equal(item.owner, accounts[0]);
  });

  it("should fail on createOrder if the item does not exist", async () => {
    const inventory = await Inventory.deployed();
    await shouldFail(inventory.createOrder(2), "Item must exist");
  });

  it("should create an order on createOrder", async () => {
    const inventory = await Inventory.deployed();
    const args = { from: accounts[1], value: 100000 };
    const result = await inventory.createOrder(1, args);
    const log = result.logs[0];
    assert.equal(log.event, "OrderCreated");
    assert.equal(log.args.orderId, 1);
  });

  it("should return the balance of the contract on getBalance", async () => {
    const inventory = await Inventory.deployed();
    const balance = await inventory.getBalance();
    assert.equal(balance, 100000);
  });

  it("should fail on getOrder if the order does not exist", async () => {
    const inventory = await Inventory.deployed();
    await shouldFail(inventory.getOrder(2), "Order must exist");
  });

  it("should get an order on getOrder", async () => {
    const inventory = await Inventory.deployed();
    const order = await inventory.getOrder(1);
    assert.equal(order.itemId, 1);
    assert.equal(order.amount, 100000);
    assert.equal(order.issuer, accounts[1]);
  });

  it("should fail on acceptOrder if order does not exist", async () => {
    const inventory = await Inventory.deployed();
    await shouldFail(inventory.acceptOrder(2), "Order must exist");
  });

  it("should fail on acceptOrder if caller is not the item owner", async () => {
    const inventory = await Inventory.deployed();
    const promise = inventory.acceptOrder(1, { from: accounts[1] });
    await shouldFail(promise, "Must be the owner of the item");
  });

  it("should accept an order on acceptOrder", async () => {
    const inventory = await Inventory.deployed();
    assert.equal(await inventory.getBalance(), 100000)
    const result = await inventory.acceptOrder(1, { from: accounts[0] });
    const log = result.logs[0];
    assert.equal(log.event, "OrderAccepted");
    assert.equal(log.args.orderId, 1);
    assert.equal(await inventory.getBalance(), 0)
    await shouldFail(inventory.getOrder(1), "Order must exist");
  });

  it("should fail on declineOrder if order does not exist", async () => {
    const inventory = await Inventory.deployed();
    // Required for next tests
    const args = { from: accounts[0], value: 100000 };
    await inventory.createOrder(1, args);
    // ---
    await shouldFail(inventory.declineOrder(3), "Order must exist");
  });

  it("should fail on declineOrder if caller is not the item owner", async () => {
    const inventory = await Inventory.deployed();
    const promise = inventory.declineOrder(2, { from: accounts[0] });
    await shouldFail(promise, "Must be the owner of the item");
  });

  it("should decline an order on declineOrder", async () => {
    const inventory = await Inventory.deployed();
    assert.equal(await inventory.getBalance(), 100000)
    const result = await inventory.declineOrder(2, { from: accounts[1] });
    const log = result.logs[0];
    assert.equal(log.event, "OrderDeclined");
    assert.equal(log.args.orderId, 2);
    assert.equal(await inventory.getBalance(), 0)
    await shouldFail(inventory.getOrder(2), "Order must exist");
  });
});

async function shouldFail(promise, message) {
  let err;
  try {
    await promise;
  } catch (e) {
    err = e;
  }
  expect(err.message).to.contain(message);
}
