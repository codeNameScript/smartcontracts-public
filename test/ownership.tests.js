const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const { inputData } = require("./testData");

const Access = artifacts.require("Access");
const User = artifacts.require("User");
const Ownership = artifacts.require("Ownership");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

contract(
  "Ownership",
  ([owner, manufacturerWallet, brandManagerWallet, customerWallet]) => {
    let userContract;
    let accessContract;
    let ownershipContract;

    describe("Ownership", () => {
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

        const id = inputData.userInfo.userInfoData1._id;
        const m_userWallet = manufacturerWallet;
        const id2 = inputData.userInfo.userInfoData2._id;
        const b_userWallet = brandManagerWallet;
        const tx = await userContract.registerUser(id, m_userWallet, { from: owner });
        const tx2 = await userContract.registerUser(id2, b_userWallet, { from: owner });
        const m_id = inputData.userInfo.userInfoData1._id;
        const m_individualId =
          inputData.manufacturerInfo.manufacturerInfoData1._individualId;
        const m_accountType =
          inputData.manufacturerInfo.manufacturerInfoData1._accountType;
        const m_fullname =
          inputData.manufacturerInfo.manufacturerInfoData1._fullname;
        const m_description =
          inputData.manufacturerInfo.manufacturerInfoData1._description;
        const tx3 = await userContract.registerUserInfo(
          m_id,
          m_individualId,
          m_accountType,
          m_fullname,
          m_description,
          m_userWallet,
          { from: owner }
        );
        const receipt3 = await web3.eth.getTransactionReceipt(tx3.tx);
        const b_id = inputData.userInfo.userInfoData2._id;
        const b_individualId =
          inputData.brandManagerInfo.brandManagerInfoData1._individualId;
        const b_accountType =
          inputData.brandManagerInfo.brandManagerInfoData1._accountType;
        const b_fullname =
          inputData.brandManagerInfo.brandManagerInfoData1._fullname;
        const b_description =
          inputData.brandManagerInfo.brandManagerInfoData1._description;
        const tx4 = await userContract.registerUserInfo(
          b_id,
          b_individualId,
          b_accountType,
          b_fullname,
          b_description,
          b_userWallet,
          { from: owner }
        );
        const receipt4 = await web3.eth.getTransactionReceipt(tx4.tx);
      });

      it("Should deploy", async () => {
        expect(ownershipContract.address).to.not.null;
      });

      it("Should register shop", async () => {
        const _shopId =
          inputData.retailerBusinessInfo.retailerBusinessInfoData1._shopId;
        const _shopName =
          inputData.retailerBusinessInfo.retailerBusinessInfoData1._shopName;

        const tx = await ownershipContract.registerShop(
          _shopId,
          manufacturerWallet,
          _shopName,
          { from: owner }
        );
        const receipt = await web3.eth.getTransactionReceipt(tx.tx);

        const _ownerId = inputData.userInfo.userInfoData1._id;
        const retailer = await ownershipContract.retailers(_ownerId);
        expect(retailer.retailerBusinessId.toNumber()).to.equal(_shopId);
        expect(retailer.retailerUserId.toNumber()).to.equal(_ownerId);
        expect(retailer.shopName).to.equal(_shopName);
      });

      it("Should register brand", async () => {
        const _brandId = inputData.brandInfo.brandInfoData1._brandId;
        const _brandPublicKey =
          inputData.brandInfo.brandInfoData1._brandPublicKey;
        const _shopId = inputData.brandInfo.brandInfoData1._shopId;
        const _approverId = inputData.brandInfo.brandInfoData1._approverId;
        const _approvedDate = inputData.brandInfo.brandInfoData1._approvedDate;

        const tx = await ownershipContract.registerBrandByBrandManager(
          _brandId,
          _brandPublicKey,
          _shopId,
          _approverId,
          _approvedDate,
          brandManagerWallet,
          { from: owner }
        );
        const receipt = await web3.eth.getTransactionReceipt(tx.tx);

        const brand = await ownershipContract.brands(_brandId);
        expect(brand.brandId).to.equal(_brandId);
        expect(brand.brandPublicKey).to.equal(_brandPublicKey);
        expect(brand.shopId.toNumber()).to.equal(_shopId);
        expect(brand.approverId.toNumber()).to.equal(_approverId);
        expect(brand.approvedDate).to.equal(_approvedDate);
      });

      it("Should register product", async () => {
        const _productId = inputData.productInfo.productData1._productId;
        const _name = inputData.productInfo.productData1._name;
        const _categoryId = inputData.productInfo.productData1._categoryId;
        const _brandId = inputData.productInfo.productData1._brandId;
        const _shopId = inputData.productInfo.productData1._shopId;
        const _manufacturerId =
          inputData.productInfo.productData1._manufacturerId;
        const _description = inputData.productInfo.productData1._description;

        const tx = await ownershipContract.registerProduct(
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
        const receipt = await web3.eth.getTransactionReceipt(tx.tx);

        const product = await ownershipContract.products(_productId);
        expect(product.productId).to.equal(_productId);
        expect(product.name).to.equal(_name);
        expect(product.categoryId).to.equal(_categoryId);
        expect(product.brandId).to.equal(_brandId);
        expect(product.shopId.toNumber()).to.equal(_shopId);
        expect(product.manufacturerId).to.equal(_manufacturerId);
        expect(product.description).to.equal(_description);
      });

      it("Should register product detail", async () => {
        const _productDetailId =
          inputData.productDetailInfo.productDetailData1._productDetailId;
        const _productId =
          inputData.productDetailInfo.productDetailData1._productId;
        const _classifications =
          inputData.productDetailInfo.productDetailData1._classifications;

        const tx = await ownershipContract.registerProductDetail(
          _productDetailId,
          _productId,
          _classifications,
          manufacturerWallet,
          { from: owner }
        );
        const receipt = await web3.eth.getTransactionReceipt(tx.tx);

        const productDetail = await ownershipContract.getProductDetailInfo(
          _productDetailId
        );
        expect(productDetail.productDetailId.toNumber()).to.equal(
          _productDetailId
        );
        expect(productDetail.productId).to.equal(_productId);
        expect(productDetail.classifications.length).to.equal(
          _classifications.length
        );

        for (let i = 0; i < _classifications.length; i++) {
          const storedClassification = productDetail.classifications[i];
          expect(storedClassification.classificationName).to.equal(
            _classifications[i].classificationName
          );
          expect(storedClassification.classificationValue).to.equal(
            _classifications[i].classificationValue
          );
        }
      });
      it("Should register qr product information", async () => {
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

        const tx = await ownershipContract.registerQRProductInformation(
          QRProdInfoDataTupleInputValues,
          manufacturerWallet,
          { from: owner }
        );
        const receipt = await web3.eth.getTransactionReceipt(tx.tx);

        const registeredQRProductInfo =
          await ownershipContract.qrProductInformations(
            _qrProductInfoData._productQRId
          );
        expect(registeredQRProductInfo.productQRId).to.equal(
          _qrProductInfoData._productQRId
        );
        expect(registeredQRProductInfo.categoryId).to.equal(
          _qrProductInfoData._categoryId
        );
        expect(registeredQRProductInfo.ownerId.toNumber()).to.equal(
          _qrProductInfoData._ownerId
        );
        expect(registeredQRProductInfo.productId).to.equal(
          _qrProductInfoData._productId
        );
        expect(registeredQRProductInfo.productDetailId.toNumber()).to.equal(
          _qrProductInfoData._productDetailId
        );
        expect(registeredQRProductInfo.encodedProductQRId).to.equal(
          _qrProductInfoData._encodedProductQRId
        );
        expect(registeredQRProductInfo.orderHistoryDetailId).to.equal(
          _qrProductInfoData._orderHistoryDetailId
        );
        expect(registeredQRProductInfo.packageParentId).to.equal(
          _qrProductInfoData._packageParentId
        );
        expect(registeredQRProductInfo.packageLevel).to.equal(
          _qrProductInfoData._packageLevel
        );
        expect(registeredQRProductInfo.ownerHistoryId).to.equal(
          _qrProductInfoData._ownerHistoryId
        );
        expect(registeredQRProductInfo.manufacturerId).to.equal(
          _qrProductInfoData._manufacturerId
        );
      });
    });
  }
);
