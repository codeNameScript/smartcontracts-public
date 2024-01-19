const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const { inputData } = require("./testData");

const Access = artifacts.require("Access");
const User = artifacts.require("User");
const Ownership = artifacts.require("Ownership");
const Tracking = artifacts.require("Tracking");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

contract(
  "Tracking",
  ([owner, manufacturerWallet, brandManagerWallet, customerWallet, customer2Wallet]) => {
    let userContract;
    let accessContract;
    let ownershipContract;
    let trackingContract;

    describe("Tracking", () => {
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

        console.log("Deploying Ownership...");
        const ownership = await deployProxy(
          Ownership,
          [access.address, user.address],
          {
            initializer: "initialize",
            from: owner,
          }
        );
        console.log("Deployed Ownership at:", ownership.address);
        ownershipContract = ownership;

        console.log("Deploying Tracking...");
        const tracking = await deployProxy(
          Tracking,
          [access.address, ownership.address, user.address],
          {
            initializer: "initialize",
            from: owner,
          }
        );
        console.log("Deployed Ownership at:", tracking.address);
        trackingContract = tracking;

        const id = inputData.userInfo.userInfoData1._id;
        const m_userWallet = manufacturerWallet;
        const id2 = inputData.userInfo.userInfoData2._id;
        const b_userWallet = brandManagerWallet;
        const id3 = inputData.userInfo.userInfoData3._id;
        const c_userWallet = customerWallet;
        const id4 = inputData.userInfo.userInfoData4._id;
        const c2_userWallet = customer2Wallet;
        const tx = await userContract.registerUser(id, m_userWallet, { from: owner });
        const tx2 = await userContract.registerUser(id2, b_userWallet, { from: owner });
        const tx3 = await userContract.registerUser(id3, c_userWallet, { from: owner });
        const tx32 = await userContract.registerUser(id4, c2_userWallet, { from: owner });
        const m_id = inputData.userInfo.userInfoData1._id;
        const m_individualId =
          inputData.manufacturerInfo.manufacturerInfoData1._individualId;
        const m_accountType =
          inputData.manufacturerInfo.manufacturerInfoData1._accountType;
        const m_fullname =
          inputData.manufacturerInfo.manufacturerInfoData1._fullname;
        const m_description =
          inputData.manufacturerInfo.manufacturerInfoData1._description;
        const tx4 = await userContract.registerUserInfo(
          m_id,
          m_individualId,
          m_accountType,
          m_fullname,
          m_description,
          m_userWallet,
          { from: owner }
        );
        const receipt4 = await web3.eth.getTransactionReceipt(tx4.tx);
        const b_id = inputData.userInfo.userInfoData2._id;
        const b_individualId =
          inputData.brandManagerInfo.brandManagerInfoData1._individualId;
        const b_accountType =
          inputData.brandManagerInfo.brandManagerInfoData1._accountType;
        const b_fullname =
          inputData.brandManagerInfo.brandManagerInfoData1._fullname;
        const b_description =
          inputData.brandManagerInfo.brandManagerInfoData1._description;
        const tx5 = await userContract.registerUserInfo(
          b_id,
          b_individualId,
          b_accountType,
          b_fullname,
          b_description,
          b_userWallet,
          { from: owner }
        );
        const receipt5 = await web3.eth.getTransactionReceipt(tx5.tx);
        const c_id = inputData.userInfo.userInfoData3._id;
        const c_individualId =
          inputData.customerInfo.customerInfoData1._individualId;
        const c_accountType =
          inputData.customerInfo.customerInfoData1._accountType;
        const c_fullname = inputData.customerInfo.customerInfoData1._fullname;
        const c_description =
          inputData.customerInfo.customerInfoData1._description;
        const tx6 = await userContract.registerUserInfo(
          c_id,
          c_individualId,
          c_accountType,
          c_fullname,
          c_description,
          c_userWallet,
          { from: owner }
        );
        const receipt6 = await web3.eth.getTransactionReceipt(tx6.tx);
        const c2_id = inputData.userInfo.userInfoData4._id;
        const c2_individualId =
          inputData.customerInfo.customerInfoData2._individualId;
        const c2_accountType =
          inputData.customerInfo.customerInfoData2._accountType;
        const c2_fullname = inputData.customerInfo.customerInfoData2._fullname;
        const c2_description =
          inputData.customerInfo.customerInfoData2._description;
        const tx62 = await userContract.registerUserInfo(
          c2_id,
          c2_individualId,
          c2_accountType,
          c2_fullname,
          c2_description,
          c2_userWallet,
          { from: owner }
        );
        const receipt62 = await web3.eth.getTransactionReceipt(tx62.tx);
        const _shopId =
          inputData.retailerBusinessInfo.retailerBusinessInfoData1._shopId;
        const _shopName =
          inputData.retailerBusinessInfo.retailerBusinessInfoData1._shopName;

        const tx7 = await ownershipContract.registerShop(
          _shopId,
          manufacturerWallet,
          _shopName,
          { from: owner }
        );
        const receipt7 = await web3.eth.getTransactionReceipt(tx7.tx);
        const _brandId = inputData.brandInfo.brandInfoData1._brandId;
        const _brandPublicKey =
          inputData.brandInfo.brandInfoData1._brandPublicKey;
        const _approverId = inputData.brandInfo.brandInfoData1._approverId;
        const _approvedDate = inputData.brandInfo.brandInfoData1._approvedDate;

        const tx8 = await ownershipContract.registerBrandByBrandManager(
          _brandId,
          _brandPublicKey,
          _shopId,
          _approverId,
          _approvedDate,
          brandManagerWallet,
          { from: owner }
        );
        const receipt8 = await web3.eth.getTransactionReceipt(tx8.tx);
        const _productId = inputData.productInfo.productData1._productId;
        const _name = inputData.productInfo.productData1._name;
        const _categoryId = inputData.productInfo.productData1._categoryId;
        const _manufacturerId =
          inputData.productInfo.productData1._manufacturerId;
        const _description = inputData.productInfo.productData1._description;

        const tx9 = await ownershipContract.registerProduct(
          _productId,
          _name,
          _categoryId,
          _brandId,
          _shopId,
          _manufacturerId,
          _description,
          manufacturerWallet,
          { from: owner }
        );
        const receipt9 = await web3.eth.getTransactionReceipt(tx9.tx);
        const _productDetailId =
          inputData.productDetailInfo.productDetailData1._productDetailId;
        const _classifications =
          inputData.productDetailInfo.productDetailData1._classifications;

        const tx10 = await ownershipContract.registerProductDetail(
          _productDetailId,
          _productId,
          _classifications,
          manufacturerWallet,
          { from: owner }
        );
        const receipt10 = await web3.eth.getTransactionReceipt(tx10.tx);
        const _qrProductInfoData = inputData.qrProductInfo.qrProductInfoData1;

        const QRProdInfoDataTupleInputValues = [
          _qrProductInfoData._productQRId,
          _qrProductInfoData._categoryId,
          _qrProductInfoData._ownerId,
          _qrProductInfoData._productId,
          _qrProductInfoData._productDetailId,
          _qrProductInfoData._encodedProductQRId,
          _qrProductInfoData._orderHistoryDetailId,
          _qrProductInfoData._packageParentId,
          _qrProductInfoData._packageLevel,
          _qrProductInfoData._ownerHistoryId,
          _qrProductInfoData._manufacturerId,
        ];

        const tx11 = await ownershipContract.registerQRProductInformation(
          QRProdInfoDataTupleInputValues,
          manufacturerWallet,
          { from: owner }
        );
        const receipt11 = await web3.eth.getTransactionReceipt(tx11.tx);
      });

      it("Should deploy", async () => {
        expect(trackingContract.address).to.not.null;
      });

      it("Should confirm order by seller(product owner) for a qr product information", async () => {
        const _id = inputData.trackingEntity.trackingQRCode1Data._id;
        const _toUserId =
          inputData.trackingEntity.trackingQRCode1Data._toUserId;
        const _orderHistoryDetailId =
          inputData.trackingEntity.trackingQRCode1Data._orderHistoryDetailId;
        const _specialTrackingId =
          inputData.trackingEntity.trackingQRCode1Data._specialTrackingId;

        const tx = await trackingContract.manageTrackingEntity(
          _id,
          _toUserId,
          _orderHistoryDetailId,
          _specialTrackingId,
          manufacturerWallet,
          { from: owner }
        );

        const receipt = await web3.eth.getTransactionReceipt(tx.tx);

        const trackingEntity = await trackingContract.trackingEntities(
          _specialTrackingId
        );
        const _ownerId = inputData.userInfo.userInfoData1._id;
        const retailer = await ownershipContract.retailers(_ownerId);
        expect(trackingEntity.id.toNumber()).to.equal(_id);
        expect(trackingEntity.toUserId.toNumber()).to.equal(_toUserId);
        expect(trackingEntity.fromShopId.toNumber()).to.equal(retailer.retailerBusinessId.toNumber());
        expect(trackingEntity.orderHistoryDetailId).to.equal(
          _orderHistoryDetailId
        );
        expect(trackingEntity.specialTrackingId).to.equal(_specialTrackingId);
      });
      it("Should confirm received an order by customer(product purchaser) for the qr product information then update product ownership", async () => {
        const _specialTrackingId =
          inputData.trackingEntity.trackingQRCode1Data._specialTrackingId;

        const tx = await trackingContract.updateProductOwner(
          _specialTrackingId,
          customerWallet,
          { from: owner }
        );

        const receipt = await web3.eth.getTransactionReceipt(tx.tx);

        const customerId = inputData.userInfo.userInfoData3._id;
        const registeredQRProductInfo =
          await ownershipContract.qrProductInformations(_specialTrackingId);
        expect(registeredQRProductInfo.productQRId).to.equal(
          _specialTrackingId
        );
        expect(registeredQRProductInfo.ownerId.toNumber()).to.equal(
          customerId
        );
      });
      it("Should allow reselling of qr product to customer2 now owned by customer1", async () => {
        const _shopId =
          inputData.retailerBusinessInfo.retailerBusinessInfoData2._shopId;
        const _shopName =
          inputData.retailerBusinessInfo.retailerBusinessInfoData2._shopName;

        const tx = await ownershipContract.registerShop(
          _shopId,
          customerWallet,
          _shopName,
          { from: owner }
        );
        const receipt = await web3.eth.getTransactionReceipt(tx.tx);

        const _id = inputData.trackingEntity.trackingQRCode1Data._id;
        const _toUserIdResell =
          inputData.trackingEntity.trackingQRCode1Data._toUserIdResell;
        const _orderHistoryDetailIdResell =
          inputData.trackingEntity.trackingQRCode1Data._orderHistoryDetailIdResell;
        const _specialTrackingId =
          inputData.trackingEntity.trackingQRCode1Data._specialTrackingId;
        const tx2 = await trackingContract.manageTrackingEntity(
          _id,
          _toUserIdResell,
          _orderHistoryDetailIdResell,
          _specialTrackingId,
          customerWallet,
          { from: owner }
        );

        const receipt2 = await web3.eth.getTransactionReceipt(tx2.tx);

        const trackingEntity = await trackingContract.trackingEntities(
          _specialTrackingId
        );
        const _ownerId = inputData.userInfo.userInfoData3._id;
        const retailer = await ownershipContract.retailers(_ownerId);
        expect(trackingEntity.id.toNumber()).to.equal(_id);
        expect(trackingEntity.toUserId.toNumber()).to.equal(_toUserIdResell);
        expect(trackingEntity.fromShopId.toNumber()).to.equal(retailer.retailerBusinessId.toNumber());
        expect(trackingEntity.orderHistoryDetailId).to.equal(
          _orderHistoryDetailIdResell
        );
        expect(trackingEntity.specialTrackingId).to.equal(_specialTrackingId);

        const tx3 = await trackingContract.updateProductOwner(
          _specialTrackingId,
          customer2Wallet,
          { from: owner }
        );

        const receipt3 = await web3.eth.getTransactionReceipt(tx3.tx);

        const customerId = inputData.userInfo.userInfoData4._id;
        const registeredQRProductInfo =
          await ownershipContract.qrProductInformations(_specialTrackingId);
        expect(registeredQRProductInfo.productQRId).to.equal(
          _specialTrackingId
        );
        expect(registeredQRProductInfo.ownerId.toNumber()).to.equal(
          customerId
        );
      });
    });
  }
);
