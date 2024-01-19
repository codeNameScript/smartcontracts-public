const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const Access = artifacts.require('Access');
const User = artifacts.require('User');
const Ownership = artifacts.require('Ownership');
const Tracking = artifacts.require('Tracking');

module.exports = async function (deployer, network, accounts) {
    initialOwnerAddress = accounts[0]; 

    console.log("Deploying Access...");
    const access = await deployProxy(Access, { deployer, initializer: 'initialize', from: initialOwnerAddress });
    console.log('Deployed', access.address);

    console.log("Deploying User...");
    const user = await deployProxy(User, [access.address], { deployer, initializer: 'initialize', from: initialOwnerAddress });
    console.log('Deployed', user.address);

    console.log("Deploying Ownership...");
    const ownership = await deployProxy(Ownership, [access.address, user.address], { deployer, initializer: 'initialize', from: initialOwnerAddress });
    console.log('Deployed', ownership.address);

    console.log("Deploying Tracking...");
    const tracking = await deployProxy(Tracking, [access.address, ownership.address, user.address], { deployer, initializer: 'initialize', from: initialOwnerAddress });
    console.log('Deployed', tracking.address);
};