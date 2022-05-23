// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IdentityFactory.sol";
import "hardhat/console.sol";

contract Identities {
    function createNewIdentity(address[] memory _owners, uint256[] memory _equities) public returns (address) {
        IdentityFactory identity = new IdentityFactory(_owners, _equities);

        console.log("Identity created: ", address(identity));
        return address(identity);
    }
}