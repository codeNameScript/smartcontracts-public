const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const User = artifacts.require('User');
const UserV2 = artifacts.require('UserV2');

module.exports = async function (deployer, network, accounts) {
  initialOwnerAddress = accounts[0];

  console.log("Upgrading User...");
  const existingUser = await User.deployed();
  const newUser = await upgradeProxy(existingUser.address, UserV2, { deployer, initializer: 'initialize', from: initialOwnerAddress });
  console.log("User upgraded to:", newUser.address);
};