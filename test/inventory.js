const Inventory = artifacts.require("Inventory");

contract(Inventory, (accounts) => {
  it("should createItem", async () => {
    const inventory = await Inventory.deployed();
    const result = await createItem(inventory, accounts[0]);
    const log = result.logs[0];
    assert.equal(log.event, "ItemCreated");
    assert.equal(log.args.id, 1);
  });

  it("should getBalance", async () => {
    const inventory = await Inventory.deployed();
    const balance = await inventory.getBalance();
    expect(balance.toString()).to.eq("0")
  })

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
      assert.equal(item.price, 1);
      assert.equal(item.exists, true);
      assert.equal(item.owner, accounts[0]);
    });
  });

  describe("buyItem", () => {
    it("should fail if item does not exist", async () => {
      const inventory = await Inventory.deployed();
      const promise = inventory.buyItem(2, { from: accounts[1] });
      await shouldFail(promise, "Item must exist");
    });

    // it("should succeed", async () => {
    //   const inventory = await Inventory.deployed();
    //   await inventory.buyItem(1, { from: accounts[1] });
    // });
  });
});

function createItem(inventory, account) {
  return inventory.createItem("name", "desc", 1, { from: account });
}

async function shouldFail(promise, message) {
  let err;
  try {
    await promise;
  } catch (e) {
    err = e;
  }
  expect(err.message).to.contain(message);
}
