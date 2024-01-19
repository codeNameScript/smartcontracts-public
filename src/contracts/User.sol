// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import "../../node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Access.sol";

contract User is Initializable, OwnableUpgradeable {
    event UserInfoUpdated(
        address indexed userWallet,
        bytes32 individualId,
        bytes32 accountType,
        string fullname
    );
    
    struct UserInfo {
        bytes32 accountType;
        bool isRegistered;
    }
    struct ManufacturerInfo {
        bytes32 accountType;
        bytes32 individualId;
        string fullname;
        string description;
    }
    struct BrandManagerInfo {
        bytes32 accountType;
        bytes32 individualId;
        string fullname;
    }
    Access public access;
    mapping(uint32 => UserInfo) public users;
    mapping(uint32 => ManufacturerInfo) public manufacturers;
    mapping(uint32 => BrandManagerInfo) public brandManagers;
    mapping(address => uint32) public userWallets;

    function initialize(address _access) public initializer {
        __Ownable_init(
            msg.sender
        );
        access = Access(_access);
    }

    function registerUser(uint32 id, address userWallet) external onlyOwner {
        require(!users[id].isRegistered, "User already registered");

        UserInfo storage user = users[id];
        user.isRegistered = true;
        userWallets[userWallet] = id;
    }

    function registerUserInfo(
        uint32 id,
        bytes32 _individualId,
        bytes32 _accountType,
        string memory _fullname,
        string memory _description,
        address userWallet
    ) external onlyOwner {
        require(users[id].isRegistered, "User is not registered");
        require(userWallets[userWallet] == id, "Not the user's User ID");
        require(access.ROLE_MANUFACTURER() == _accountType || access.ROLE_BRANDMANAGER() == _accountType || access.ROLE_CUSTOMER() == _accountType, "AccountType is not allowed");

        UserInfo storage user = users[id];
        user.accountType = _accountType;
        
        if (_accountType == access.ROLE_CUSTOMER()) {
            access.grantRole(_accountType, userWallet);
        } else if (_accountType == access.ROLE_MANUFACTURER()) {
            access.grantRole(_accountType, userWallet);
            ManufacturerInfo storage manufacturer = manufacturers[id];
            manufacturer.accountType = _accountType;
            manufacturer.individualId = _individualId;
            manufacturer.fullname = _fullname;
            manufacturer.description = _description;
        } else if (_accountType == access.ROLE_BRANDMANAGER()) {
            access.grantRole(_accountType, userWallet);
            BrandManagerInfo storage brandManager = brandManagers[id];
            brandManager.accountType = _accountType;
            brandManager.individualId = _individualId;
            brandManager.fullname = _fullname;
        }

        emit UserInfoUpdated(
            userWallet,
            _individualId,
            _accountType,
            _fullname
        );
    }

    function getUserInfo(address userWallet) external view returns (bytes32 accountType, bool isRegistered) {
        uint32 id = userWallets[userWallet];
        require(users[id].isRegistered, "User not found");
        UserInfo storage user = users[id];
        return (user.accountType, user.isRegistered);
    }

    function getManufacturerInfo(address userWallet) external view returns (bytes32 accountType, bytes32 individualId, string memory fullname, string memory description) {
        uint32 id = userWallets[userWallet];
        require(manufacturers[id].accountType == access.ROLE_MANUFACTURER(), "Manufacturer not found");
        ManufacturerInfo storage manufacturer = manufacturers[id];
        return (manufacturer.accountType, manufacturer.individualId, manufacturer.fullname, manufacturer.description);
    }

    function getBrandManagerInfo(address userWallet) external view returns (bytes32 accountType, bytes32 individualId, string memory fullname) {
        uint32 id = userWallets[userWallet];
        require(brandManagers[id].accountType == access.ROLE_BRANDMANAGER(), "Brand Manager not found");
        BrandManagerInfo storage brandManager = brandManagers[id];
        return (brandManager.accountType, brandManager.individualId, brandManager.fullname);
    }

    function _isUserRegistered(uint32 _userId) external view returns (bool) {
        return users[_userId].isRegistered;
    }
}