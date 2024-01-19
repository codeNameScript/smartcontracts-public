// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "../../node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Access.sol";
import "./Ownership.sol";
import "./User.sol";

contract Tracking is Initializable, OwnableUpgradeable {

    event TrackingEntityUpdated(
        uint64 indexed id,
        uint32 toUserId,
        uint32 fromShopId,
        string orderHistoryDetailId,
        string indexed specialTrackingId
    );
    event TrackingEntityCreated(
        uint64 indexed id,
        uint32 toUserId,
        uint32 fromShopId,
        string orderHistoryDetailId,
        string indexed specialTrackingId
    );
    event ProductOwnerUpdated(string indexed productQRId, uint32 indexed newOwnerId);

    struct TrackingEntity {
        uint64 id;
        uint32 toUserId;
        uint32 fromShopId;
        string orderHistoryDetailId;
        string specialTrackingId;
    }

    Access public access;
    Ownership public ownership;
    User public user;
    mapping(string => TrackingEntity) public trackingEntities;

    function initialize(address _access, address _ownership, address _user) public initializer {
        __Ownable_init(
            msg.sender
        );

        access = Access(_access);
        ownership = Ownership(_ownership);
        user = User(_user);
    }
    
    function manageTrackingEntity (
        uint64 _id,
        uint32 _toUserId,
        string memory _orderHistoryDetailId,
        string memory _specialTrackingId,
        address _userWallet
    ) external onlyOwner {
        require(ownership._isProductOwner(_specialTrackingId, _userWallet), "Only the product owner can call this function");
        require(user._isUserRegistered(_toUserId), "User is not registered");
        require(ownership._isProductRegistered(_specialTrackingId), "Product not registered");
        require(ownership._getShopIdByUserWallet(_userWallet) != 0, "Seller does not have a shop");

        ownership._updateOrderHistoryDetails(_specialTrackingId, _orderHistoryDetailId, msg.sender);
        if (bytes(trackingEntities[_specialTrackingId].specialTrackingId).length != 0) {
            _updateTrackingEntity(_id, _toUserId, _orderHistoryDetailId, _specialTrackingId, _userWallet);
        } else {
            _createTrackingEntity(_id, _toUserId, _orderHistoryDetailId, _specialTrackingId, _userWallet);
        }
    }

    function _createTrackingEntity(
        uint64 _id,
        uint32 _toUserId,
        string memory _orderHistoryDetailId,
        string memory _specialTrackingId,
        address _userWallet
    ) private onlyOwner {
        require(bytes(trackingEntities[_specialTrackingId].specialTrackingId).length == 0, "TrackingEntity using the specialTrackingId already exists");

        TrackingEntity storage newtrackingEntity = trackingEntities[
            _specialTrackingId
        ];
        newtrackingEntity.id = _id;
        newtrackingEntity.toUserId = _toUserId;
        newtrackingEntity.fromShopId = ownership._getShopIdByUserWallet(_userWallet);
        newtrackingEntity.orderHistoryDetailId = _orderHistoryDetailId;
        newtrackingEntity.specialTrackingId = _specialTrackingId;

        emit TrackingEntityCreated(
            _id,
            _toUserId,
            newtrackingEntity.fromShopId,
            _orderHistoryDetailId,
            _specialTrackingId
        );
    }

    function _updateTrackingEntity (
        uint64 _id,
        uint32 _toUserId,
        string memory _orderHistoryDetailId,
        string memory _specialTrackingId,
        address _userWallet
    ) private onlyOwner {
        require(bytes(trackingEntities[_specialTrackingId].specialTrackingId).length != 0, "specialTrackingId does not exist");

        TrackingEntity storage existingTrackingEntity = trackingEntities[_specialTrackingId];
        existingTrackingEntity.id = _id;
        existingTrackingEntity.toUserId = _toUserId;
        existingTrackingEntity.fromShopId = ownership._getShopIdByUserWallet(_userWallet);
        existingTrackingEntity.orderHistoryDetailId = _orderHistoryDetailId;

        emit TrackingEntityUpdated(
            _id,
            _toUserId,
            existingTrackingEntity.fromShopId,
            _orderHistoryDetailId,
            _specialTrackingId
        );
    }
    
    function updateProductOwner(
        string memory _specialTrackingId,
        address _userWallet
    ) external onlyOwner {
        require(trackingEntities[_specialTrackingId].toUserId == user.userWallets(_userWallet), "Only the product buyer can execute this");
        require(bytes(trackingEntities[_specialTrackingId].specialTrackingId).length != 0, "Tracking data with this specialTrackingId does not exist");

        TrackingEntity storage existingTrackingEntity = trackingEntities[_specialTrackingId];
        ownership._updateProductOwner(_specialTrackingId, existingTrackingEntity.toUserId, msg.sender);
    }
}