const Inventory = artifacts.require("Inventory");

contract(Inventory, (accounts) => {
  it("should createItem", async () => {
    const inventory = await Inventory.deployed();
    const args = { from: accounts[0] };
    const result = await inventory.createItem("name", "desc", args);
    const log = result.logs[0];
    assert.equal(log.event, "ItemCreated");
    assert.equal(log.args.id, 1);
  });

  it("should getBalance", async () => {
    const inventory = await Inventory.deployed();
    const balance = await inventory.getBalance();
    expect(balance.toString()).to.eq("0");
  });

  describe("getItem", () => {
    it("should fail if item does not exist", async () => {
      const inventory = await Inventory.deployed();
      await shouldFail(inventory.getItem(2), "Item must exist");
    });

    it("should succeed", async () => {
      const inventory = await Inventory.deployed();
      const item = await inventory.getItem(1);
      assert.equal(item.name, "name");
      assert.equal(item.description, "desc");
      assert.equal(item.exists, true);
      assert.equal(item.owner, accounts[0]);
    });
  });

  describe("buyItem", () => {
    it("should fail if item does not exist", async () => {
      const inventory = await Inventory.deployed();
      await shouldFail(inventory.buyItem(2), "Item must exist");
    });

    it("should create an order", async () => {
      const inventory = await Inventory.deployed();
      const args = { from: accounts[0], value: 10000 };
      const result = await inventory.buyItem(1, args);
      const log = result.logs[0];
      assert.equal(log.event, "OrderCreated");
      assert.equal(log.args.id, 1);
    });
  });

  describe("getOrder", () => {
    it("should fail if order does not exist", async () => {
      const inventory = await Inventory.deployed();
      await shouldFail(inventory.getOrder(2), "Order must exist");
    });
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
