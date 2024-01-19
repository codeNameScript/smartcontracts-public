// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import "../../node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Access is AccessControlUpgradeable {
    bytes32 public constant ROLE_ADMIN = keccak256("ROLE_ADMIN");
    bytes32 public constant ROLE_MANUFACTURER = keccak256("ROLE_MANUFACTURER");
    bytes32 public constant ROLE_BRANDMANAGER = keccak256("ROLE_BRANDMANAGER");
    bytes32 public constant ROLE_CUSTOMER = keccak256("ROLE_CUSTOMER");

    function initialize() public initializer {
        __AccessControl_init();
    }

    function grantRole(bytes32 role, address account) public override {
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public override {
        _revokeRole(role, account);
    }

    function hasRole(
        bytes32 role,
        address account
    ) public view override returns (bool) {
        return super.hasRole(role, account);
    }

    function getRoleAdmin(bytes32 role) public view override returns (bytes32) {
        return super.getRoleAdmin(role);
    }
}
