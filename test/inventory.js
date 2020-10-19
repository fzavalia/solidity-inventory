const Inventory = artifacts.require("Inventory");

contract(Inventory, (accounts) => {
  it("should create an item", async () => {
    const inventory = await Inventory.deployed();
    const result = await createItem(inventory, accounts[0]);
    const log = result.logs[0];
    assert.equal(log.event, "ItemCreated");
    assert.equal(log.args.id, 1);
  });

  it("should getItem", async () => {
    const inventory = await Inventory.deployed();
    await createItem(inventory, accounts[0]);
    const item = await inventory.getItem(1);
    assert.equal(item.name, "name");
    assert.equal(item.description, "desc");
    assert.equal(item.price, 1);
    assert.equal(item.exists, true);
    assert.equal(item.owner, accounts[0]);
  });
});

function createItem(inventory, account) {
  return inventory.createItem("name", "desc", 1, { from: account });
}
