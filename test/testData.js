const inputData = {
  userInfo: {
    userInfoData1: {
      _id: 1,
    },
    userInfoData2: {
      _id: 2,
    },
    userInfoData3: {
      _id: 3,
    },
    userInfoData4: {
      _id: 4,
    },
  },
  manufacturerInfo: {
    manufacturerInfoData1: {
      _accountType: web3.utils.soliditySha3("ROLE_MANUFACTURER"),
      _individualId: web3.utils.padRight(
        web3.utils.fromAscii("manufacturerIndividualId"),
        64
      ),
      _fullname: "Manufacturer Tarou",
      _description: "Description of Manufacturer Tarou",
    },
  },
  brandManagerInfo: {
    brandManagerInfoData1: {
      _accountType: web3.utils.soliditySha3("ROLE_BRANDMANAGER"),
      _individualId: web3.utils.padRight(
        web3.utils.fromAscii("brandManagerIndividualId"),
        64
      ),
      _fullname: "BrandManger Tarou",
      _description: "",
    },
  },
  customerInfo: {
    customerInfoData1: {
      _accountType: web3.utils.soliditySha3("ROLE_CUSTOMER"),
      _individualId: web3.utils.padRight(web3.utils.fromAscii(""), 64),
      _fullname: "",
      _description: "",
    },
    customerInfoData2: {
      _accountType: web3.utils.soliditySha3("ROLE_CUSTOMER"),
      _individualId: web3.utils.padRight(web3.utils.fromAscii(""), 64),
      _fullname: "",
      _description: "",
    },
  },
  retailerBusinessInfo: {
    retailerBusinessInfoData1: {
      _shopId: 1,
      _shopName: web3.utils.padRight(
        web3.utils.fromAscii("Manufacturer Tarou's shop"),
        64
      ),
    },
    retailerBusinessInfoData2: {
      _shopId: 2,
      _shopName: web3.utils.padRight(
        web3.utils.fromAscii("Customer Tarou's shop"),
        64
      ),
    },
  },
  brandInfo: {
    brandInfoData1: {
      _brandId: web3.utils.padRight(
        web3.utils.fromAscii("Brand Data Id 1"),
        64
      ),
      _brandPublicKey: "brand public key 1",
      _shopId: 1,
      _approverId: 2,
      _approvedDate: "YYMMDD",
    },
  },
  productInfo: {
    productData1: {
      _productId: "Product Data Id 1",
      _name: "Product 1",
      _categoryId: web3.utils.padRight(
        web3.utils.fromAscii("Category Id 1"),
        64
      ),
      _brandId: web3.utils.padRight(
        web3.utils.fromAscii("Brand Data Id 1"),
        64
      ),
      _shopId: 1,
      _manufacturerId: web3.utils.padRight(
        web3.utils.fromAscii("manufacturerIndividualId"),
        64
      ),
      _description: "Description of Product 1",
    },
    // productData2: {
    //   productId: "Product Data Id 2",
    //   name: "Product 2",
    //   categoryId: web3.utils.padRight(
    //     web3.utils.fromAscii("Category Id 2"),
    //     64
    //   ),
    //   brandId: web3.utils.padRight(
    //     web3.utils.fromAscii("Brand Data Id 2"),
    //     64
    //   ),
    //   shopId: 1,
    //   manufacturerId: web3.utils.padRight(
    //     web3.utils.fromAscii("manufacturerIndividualId"),
    //     64
    //   ),
    //   description: "Description of Product 2",
    // }
  },
  productDetailInfo: {
    productDetailData1: {
      _productDetailId: 1,
      _productId: "Product Data Id 1",
      _classifications: [
        { classificationName: "Size", classificationValue: "Large" },
        { classificationName: "Color", classificationValue: "Red" },
      ],
    },
    productDetailData2: {
      _productDetailId: 2,
      _productId: "Product Data Id 1",
      _classifications: [
        { classificationName: "Size", classificationValue: "Medium" },
        { classificationName: "Color", classificationValue: "Blue" },
      ],
    },
  },
  qrProductInfo: {
    qrProductInfoData1: {
      _productQRId: "QRCode1",
      _categoryId: web3.utils.padRight(
        web3.utils.fromAscii("Category Id 1"),
        64
      ),
      _ownerId: 1,
      _productId: "Product Data Id 1",
      _productDetailId: 1,
      _encodedProductQRId: "EncodedQRCode1",
      _orderHistoryDetailId: "", // This field is empty until someone buys the product
      _packageParentId: "PackageParent1",
      _packageLevel: "Level1",
      _ownerHistoryId: "OwnerHistoryId1",
      _manufacturerId: web3.utils.padRight(
        web3.utils.fromAscii("manufacturerIndividualId"),
        64
      ),
    },
    // qrProductInfoData2: {
    //   _productQRId: "QRCode2",
    //   _categoryId: web3.utils.padRight(
    //     web3.utils.fromAscii("Category Id 2"),
    //     64
    //   ),
    //   _ownerId: 2,
    //   _productId: "Product Data Id 2",
    //   _productDetailId: 2,
    //   _encodedProductQRId: "EncodedQRCode2",
    //   _orderHistoryDetailId: "OrderHistoryDetail2",
    //   _packageParentId: "PackageParent2",
    //   _packageLevel: "Level2",
    //   _orderHistoryId: "OrderHistory2",
    //   _manufacturerId: web3.utils.padRight(
    //     web3.utils.fromAscii("manufacturerIndividualId"),
    //     64
    //   ),
    // },
  },
  trackingEntity: {
    trackingQRCode1Data: {
      _id: 1,
      _toUserId: 3,
      _toUserIdResell: 4,
      // _fromShopId: 1,
      _orderHistoryDetailId: "OrderHistoryDetailId1",
      _orderHistoryDetailIdResell: "OrderHistoryDetailId1Resell",
      _specialTrackingId: "QRCode1",
    },
  },
};

module.exports = { inputData };
