// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import "../../node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Access.sol";
import "./User.sol";

contract Ownership is Initializable, OwnableUpgradeable {
    struct BrandInfo {
        bytes32 brandId;
        string brandPublicKey;
        uint32 shopId;
        uint32 approverId;
        string approvedDate;
    }
    struct Product {
        string productId;
        string name;
        bytes32 categoryId;
        bytes32 brandId;
        uint32 shopId;
        bytes32 manufacturerId;
        string description;
    }
    struct ProductClassification {
        string classificationName;
        string classificationValue;
    }
    struct ProductDetail {
        uint32 productDetailId;
        string productId;
        ProductClassification[] classifications;
    }
    struct QRProductInformation {
        string productQRId;
        bytes32 categoryId;
        uint32 ownerId;
        string productId;
        uint32 productDetailId;
        string encodedProductQRId;
        string orderHistoryDetailId;
        string packageParentId;
        string packageLevel;
        string ownerHistoryId;
        bytes32 manufacturerId;
    }

    struct RetailerBusinessInfo {
        uint32 retailerUserId;
        uint32 retailerBusinessId;
        bytes32 shopName;
    }

    event BrandRegistered(
        bytes32 brandId,
        string brandPublicKey,
        uint32 shopId,
        uint32 approverId,
        string approvedDate
    );

    event ProductRegistered(
        string productId,
        string name,
        bytes32 categoryId,
        bytes32 brandId,
        uint32 shopId,
        bytes32 manufacturerId,
        string description
    );

    event ProductDetailRegistered(
        uint32 productDetailId,
        string productId,
        ProductClassification[] classifications
    );

    event QRProductRegistered(
        string productQRId,
        bytes32 categoryId,
        uint32 ownerId,
        string productId,
        uint32 productDetailId,
        string encodedProductQRId,
        string orderHistoryDetailId,
        string packageParentId,
        string packageLevel,
        string orderHistoryId,
        bytes32 manufacturerId
    );

    event ProductOwnerUpdated(string indexed productQRId, uint32 indexed newOwnerId);

    event RetailerRegistered(
        uint32 retailerUserId,
        uint32 retailerBusinessId,
        bytes32 shopName
    );

    event OwningCompanyIdUpdated(
        uint32 retailerUserId,
        uint32 newOwningCompanyId
    );

    Access public access;
    User public user;
    mapping(bytes32 => BrandInfo) public brands;
    mapping(string => Product) public products;
    mapping(uint32 => ProductDetail) public productDetails;
    mapping(string => QRProductInformation) public qrProductInformations;
    mapping(uint32 => RetailerBusinessInfo) public retailers;

    function initialize(address _access, address _user) public initializer {
        __Ownable_init(
            msg.sender
        );
        access = Access(_access);
        user = User(_user);
    }

    function _isRoleBrandManager(address _userWallet) private view returns (bool) {
        return access.hasRole(access.ROLE_BRANDMANAGER(), _userWallet);
    }

    function registerBrandByBrandManager(
        bytes32 _brandId,
        string memory _brandPublicKey,
        uint32 _shopId,
        uint32 _approverId,
        string memory _approvedDate,
        address _userWallet
    ) external onlyOwner {
        require(access.hasRole(access.ROLE_BRANDMANAGER(), _userWallet), "User is not Authorized");
        require(brands[_brandId].brandId == 0, "BrandId already exists");
        require(retailers[_shopId].retailerBusinessId != 0, "ShopId does not exist");

        BrandInfo storage brand = brands[_brandId];
        brand.brandId = _brandId;
        brand.brandPublicKey = _brandPublicKey;
        brand.shopId = _shopId;
        brand.approverId = _approverId;
        brand.approvedDate = _approvedDate;

        emit BrandRegistered(
            _brandId,
            _brandPublicKey,
            _shopId,
            _approverId,
            _approvedDate
        );
    }

    function _isRoleManufacturer(address _userWallet) private view returns (bool) {
        return access.hasRole(access.ROLE_MANUFACTURER(), _userWallet);
    }

    function registerProduct(
        string memory _productId,
        string memory _name,
        bytes32 _categoryId,
        bytes32 _brandId,
        uint32 _shopId,
        bytes32 _manufacturerId,
        string memory _description,
        address _userWallet
    ) external onlyOwner {
        require(_isRoleManufacturer(_userWallet), "User is not Authorized");
        require(bytes(products[_productId].productId).length == 0, "ProductId already exists");
        require(retailers[_shopId].retailerBusinessId != 0, "ShopId does not exist");
        require(brands[_brandId].brandId != 0, "BrandId does not exist");
        require(brands[_brandId].shopId == _shopId, "Brand is not from that shop");

        Product storage product = products[_productId];
        product.productId = _productId;
        product.name = _name;
        product.brandId = _brandId;
        product.categoryId = _categoryId;
        product.shopId = _shopId;
        product.manufacturerId = _manufacturerId;
        product.description = _description;

        emit ProductRegistered(
            _productId,
            _name,
            _categoryId,
            _brandId,
            _shopId,
            _manufacturerId,
            _description
        );
    }

    function registerProductDetail(
        uint32 _productDetailId,
        string memory _productId,
        ProductClassification[] memory _classifications,
        address _userWallet
    ) external onlyOwner{
        require(_isRoleManufacturer(_userWallet), "User is not Authorized");
        require(productDetails[_productDetailId].productDetailId == 0, "ProductDetailId already exists");
        require(bytes(products[_productId].productId).length != 0, "ProductId does not exist");

        ProductDetail storage productDetail = productDetails[_productDetailId];
        productDetail.productDetailId = _productDetailId;
        productDetail.productId = _productId;
        for (uint256 i = 0; i < _classifications.length; i++) {
            productDetail.classifications.push(ProductClassification({
                classificationName: _classifications[i].classificationName,
                classificationValue: _classifications[i].classificationValue
            }));
        }

        emit ProductDetailRegistered(
            _productDetailId,
            _productId,
            _classifications
        );
    }

    function registerQRProductInformation(
        QRProductInformation memory _qrProductInfo,
        address _userWallet
    ) external onlyOwner {
        require(_isRoleManufacturer(_userWallet), "User is not Authorized");
        require(bytes(qrProductInformations[_qrProductInfo.productQRId].productQRId).length == 0, "ProductQRId already exists");
        require(productDetails[_qrProductInfo.productDetailId].productDetailId != 0, "ProductDetailId does not exist");
        require(_getShopOwnerIdByShopId(products[_qrProductInfo.productId].shopId) == _qrProductInfo.ownerId, "OwnerId is not the Brand Owner");

        QRProductInformation storage newQRProductInfo = qrProductInformations[_qrProductInfo.productQRId];
        newQRProductInfo.productQRId = _qrProductInfo.productQRId;
        newQRProductInfo.categoryId = _qrProductInfo.categoryId;
        newQRProductInfo.ownerId = _qrProductInfo.ownerId;
        newQRProductInfo.productId = _qrProductInfo.productId;
        newQRProductInfo.productDetailId = _qrProductInfo.productDetailId;
        newQRProductInfo.encodedProductQRId = _qrProductInfo.encodedProductQRId;
        newQRProductInfo.orderHistoryDetailId = _qrProductInfo.orderHistoryDetailId;
        newQRProductInfo.packageParentId = _qrProductInfo.packageParentId;
        newQRProductInfo.packageLevel = _qrProductInfo.packageLevel;
        newQRProductInfo.ownerHistoryId = _qrProductInfo.ownerHistoryId;
        newQRProductInfo.manufacturerId = _qrProductInfo.manufacturerId;
        
        emit QRProductRegistered(
            _qrProductInfo.productQRId,
            _qrProductInfo.categoryId,
            _qrProductInfo.ownerId,
            _qrProductInfo.productId,
            _qrProductInfo.productDetailId,
            _qrProductInfo.encodedProductQRId,
            _qrProductInfo.orderHistoryDetailId,
            _qrProductInfo.packageParentId,
            _qrProductInfo.packageLevel,
            _qrProductInfo.ownerHistoryId,
            _qrProductInfo.manufacturerId
        );
    }

    function _updateProductOwner(string memory _productQRId, uint32 _newOwnerId, address _originalCaller) external {
        require(_originalCaller == owner(), "Caller is not the owner");
        require(bytes(qrProductInformations[_productQRId].productQRId).length != 0, "Product not registered");

        QRProductInformation storage existingQRProductInformation = qrProductInformations[_productQRId];
        existingQRProductInformation.ownerId = _newOwnerId;

        emit ProductOwnerUpdated(_productQRId, _newOwnerId);
    }

    event OrderHistoryDetailsUpdated(
        string indexed productQRId,
        string newOrderHistoryDetailId
    );
    function _updateOrderHistoryDetails(
        string memory _productQRId,
        string memory _newOrderHistoryDetailId,
        address _originalCaller
    ) external {
        require(_originalCaller == owner(), "Caller is not the owner");
        require(bytes(qrProductInformations[_productQRId].productQRId).length != 0, "QR Product not registered");

        QRProductInformation storage existingQRProductInformation = qrProductInformations[_productQRId];
        existingQRProductInformation.orderHistoryDetailId = _newOrderHistoryDetailId;

        emit OrderHistoryDetailsUpdated(_productQRId, _newOrderHistoryDetailId);
    }

    function _isProductRegistered(string memory _productQRId) external view returns (bool) {
        return bytes(qrProductInformations[_productQRId].productQRId).length != 0;
    }
    function _isProductOwner(string memory _productQRId, address _userWallet) external view returns (bool) {
        return qrProductInformations[_productQRId].ownerId == user.userWallets(_userWallet);
    }

    function registerShop(
        uint32 _shopId,
        address _userWallet,
        bytes32 _shopName
    ) external onlyOwner {
        uint32 ownerId = user.userWallets(_userWallet);
        RetailerBusinessInfo storage retailer = retailers[ownerId];
        require(retailer.retailerBusinessId == 0, "Shop ID is already registered");
        require(user._isUserRegistered(ownerId), "User is not registered");
        
        retailer.retailerBusinessId = _shopId;
        retailer.retailerUserId = ownerId;
        retailer.shopName = _shopName;

        emit RetailerRegistered(_shopId, ownerId, _shopName);
    }

    function updateShopId(
        uint32 _newShopId,
        address _userWallet
    ) public onlyOwner {
        uint32 ownerId = user.userWallets(_userWallet);
        RetailerBusinessInfo storage retailer = retailers[ownerId];
        require(retailer.retailerBusinessId != 0, "Retailer not found");
        require(retailer.retailerUserId == ownerId, "Not your shop");
        
        retailer.retailerBusinessId = _newShopId;

        emit OwningCompanyIdUpdated(ownerId, _newShopId);
    }

    function _getShopIdByUserWallet(address _userWallet) external view returns (uint32) {
        return retailers[user.userWallets(_userWallet)].retailerBusinessId;
    }

    function _getShopOwnerIdByShopId(uint32 _shopId) private view returns (uint32) {
        return retailers[_shopId].retailerUserId;
    }

    function getBrandInfo(bytes32 _brandId) external view returns (
        string memory brandPublicKey,
        uint32 shopId,
        uint32 approverId,
        string memory approvedDate
    ) {
        BrandInfo storage brand = brands[_brandId];
        require(brand.brandId != 0, "Brand not found");
        return (
            brand.brandPublicKey,
            brand.shopId,
            brand.approverId,
            brand.approvedDate
        );
    }

    function getProductInfo(string memory _productId) external view returns (
        string memory name,
        bytes32 categoryId,
        bytes32 brandId,
        uint32 shopId,
        bytes32 manufacturerId,
        string memory description
    ) {
        Product storage product = products[_productId];
        require(bytes(product.productId).length != 0, "Product not found");
        return (
            product.name,
            product.categoryId,
            product.brandId,
            product.shopId,
            product.manufacturerId,
            product.description
        );
    }

    function getProductDetailInfo(uint32 _productDetailId) external view returns (
        uint32 productDetailId,
        string memory productId,
        ProductClassification[] memory classifications
    ) {
        ProductDetail storage productDetail = productDetails[_productDetailId];
        require(productDetail.productDetailId != 0, "Product detail not found");

        productDetailId = productDetail.productDetailId;
        productId = productDetail.productId;
        classifications = productDetail.classifications;

        return (productDetailId, productId, classifications);
    }

    function getQRProductInfo(string memory _productQRId) external view returns (
        bytes32 categoryId,
        uint32 ownerId,
        string memory productId,
        uint32 productDetailId,
        string memory encodedProductQRId,
        string memory orderHistoryDetailId,
        string memory packageParentId,
        string memory packageLevel,
        string memory ownerHistoryId,
        bytes32 manufacturerId
    ) {
        QRProductInformation storage qrProductInfo = qrProductInformations[_productQRId];
        require(bytes(qrProductInfo.productQRId).length != 0, "QR Product information not found");

        return (
            qrProductInfo.categoryId,
            qrProductInfo.ownerId,
            qrProductInfo.productId,
            qrProductInfo.productDetailId,
            qrProductInfo.encodedProductQRId,
            qrProductInfo.orderHistoryDetailId,
            qrProductInfo.packageParentId,
            qrProductInfo.packageLevel,
            qrProductInfo.ownerHistoryId,
            qrProductInfo.manufacturerId
        );
    }

    function getRetailerInfo(uint32 _ownerId) external view returns (
        uint32 shopId,
        uint32 ownerId,
        bytes32 shopName
    ) {
        RetailerBusinessInfo storage retailer = retailers[_ownerId];
        require(retailer.retailerUserId != 0, "Retailer not found");

        return (
            retailer.retailerBusinessId,
            retailer.retailerUserId,
            retailer.shopName
        );
    }
}
