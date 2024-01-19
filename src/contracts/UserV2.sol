// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import "../../node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Access.sol";

contract UserV2 is Initializable, OwnableUpgradeable {
    event UserInfoUpdated(
        address indexed userWallet,
        bytes32 individualId,
        bytes32 accountType,
        string fullname,
        uint32 upgraded
    );

    struct UserInfo {
        bytes32 accountType;
        bool isRegistered;
        bytes32 individualId;
        string fullname;
        uint32 upgraded;
    }
    Access public access;
    mapping(bytes32 => UserInfo) public users;
    mapping(address => bytes32) public userWallets;

    function initialize(address _access) public initializer {
        __Ownable_init(
            msg.sender
        );
        access = Access(_access);
    }

    function registerUser(bytes32 id) external onlyOwner {
        UserInfo storage user = users[id];
        user.isRegistered = true;
    }

    function registerUserInfo(
        bytes32 id,
        bytes32 _individualId,
        bytes32 _accountType,
        string memory _fullname,
        address userWallet,
        uint32 _upgraded
    ) external onlyOwner {
        UserInfo storage user = users[id];
        user.individualId = _individualId;
        user.accountType = _accountType;
        user.fullname = _fullname;
        userWallets[userWallet] = id;
        user.upgraded = _upgraded;
        emit UserInfoUpdated(
            userWallet,
            _individualId,
            _accountType,
            _fullname,
            _upgraded
        );
    }

    function getUserInfo(
        address userWallet
    )
        external
        view
        returns (
            bytes32 accountType,
            bool isRegistered,
            bytes32 individualId,
            string memory fullname,
            uint32 upgraded
        )
    {
        bytes32 id = userWallets[userWallet];
        UserInfo storage user = users[id];

        return (
            user.accountType,
            user.isRegistered,
            user.individualId,
            user.fullname,
            user.upgraded
        );
    }
}