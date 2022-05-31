// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./Identity.sol";

contract IdentityFactory {
    function createIdentity(address[] memory _owners, uint256[] memory _equities) public returns (address) {
        Identity identity = new Identity(_owners, _equities);

        return address(identity);
    }
}