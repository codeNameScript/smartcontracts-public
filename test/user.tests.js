const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const { inputData } = require("./testData");

const Access = artifacts.require("Access");
const User = artifacts.require("User");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

contract(
  "User",
  ([owner, manufacturerWallet, brandManagerWallet, customerWallet]) => {
    let userContract;
    let accessContract;

    describe("User", () => {
      before(async () => {
        console.log("Deploying Access...");
        const access = await deployProxy(Access, {
          initializer: "initialize",
          from: owner,
        });
        console.log("Deployed", access.address);
        accessContract = access;

        console.log("Deploying User...");
        const user = await deployProxy(User, [access.address], {
          initializer: "initialize",
          from: owner,
        });
        console.log("Deployed User at:", user.address);
        userContract = user;
      });

      it("Should deploy", async () => {
        expect(userContract.address).to.not.null;
      });

      it("Should register user", async () => {
        const id = inputData.userInfo.userInfoData1._id;
        const _userWallet = manufacturerWallet;
        const tx = await userContract.registerUser(id, _userWallet, {
          from: owner,
        });
        const receipt = await web3.eth.getTransactionReceipt(tx.tx);

        const user = await userContract.users(id);
        expect(user.isRegistered).to.be.true;
      });

      it("Should register user info (manufacturer)", async () => {
        const _id = inputData.userInfo.userInfoData1._id;
        const _individualId =
          inputData.manufacturerInfo.manufacturerInfoData1._individualId;
        const _accountType =
          inputData.manufacturerInfo.manufacturerInfoData1._accountType;
        const _fullname =
          inputData.manufacturerInfo.manufacturerInfoData1._fullname;
        const _description =
          inputData.manufacturerInfo.manufacturerInfoData1._description;
        const _userWallet = manufacturerWallet;

        const tx_2 = await userContract.registerUserInfo(
          _id,
          _individualId,
          _accountType,
          _fullname,
          _description,
          _userWallet,
          { from: owner }
        );
        const receipt_2 = await web3.eth.getTransactionReceipt(tx_2.tx);

        const user = await userContract.users(_id);
        const manufacturer = await userContract.manufacturers(_id);
        const hasManufacturerRole = await accessContract.hasRole(
          await accessContract.ROLE_MANUFACTURER(),
          _userWallet,
          { from: owner }
        );
        expect(hasManufacturerRole).to.be.true;
        expect(user.isRegistered).to.be.true;
        expect(manufacturer.individualId).to.equal(_individualId);
        expect(manufacturer.accountType).to.equal(_accountType);
        expect(manufacturer.fullname).to.equal(_fullname);
        expect(manufacturer.description).to.equal(_description);
      });

      it("Should register user info (brandManager)", async () => {
        const id = inputData.userInfo.userInfoData2._id;
        const _userWallet = brandManagerWallet;
        await userContract.users(id);
        const tx = await userContract.registerUser(id, _userWallet, {
          from: owner,
        });
        const receipt = await web3.eth.getTransactionReceipt(tx.tx);

        const _id = inputData.userInfo.userInfoData2._id;
        const _individualId =
          inputData.brandManagerInfo.brandManagerInfoData1._individualId;
        const _accountType =
          inputData.brandManagerInfo.brandManagerInfoData1._accountType;
        const _fullname =
          inputData.brandManagerInfo.brandManagerInfoData1._fullname;
        const _description =
          inputData.brandManagerInfo.brandManagerInfoData1._description;

        const tx_2 = await userContract.registerUserInfo(
          _id,
          _individualId,
          _accountType,
          _fullname,
          _description,
          _userWallet,
          { from: owner }
        );
        const receipt_2 = await web3.eth.getTransactionReceipt(tx_2.tx);

        const user = await userContract.users(_id);
        const brandManager = await userContract.brandManagers(_id);
        const hasBrandManagerRole = await accessContract.hasRole(
          await accessContract.ROLE_BRANDMANAGER(),
          brandManagerWallet,
          { from: owner }
        );
        expect(hasBrandManagerRole).to.be.true;
        expect(user.isRegistered).to.be.true;
        expect(brandManager.individualId).to.equal(_individualId);
        expect(brandManager.accountType).to.equal(_accountType);
        expect(brandManager.fullname).to.equal(_fullname);
      });
    });
  }
);
