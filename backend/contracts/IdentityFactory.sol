// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./Identity.sol";

contract IdentityFactory {
    event NewIdentity(address indexed identity, address[] owners);

    function createIdentity(
        address[] memory _owners,
        uint256[] memory _equities
    ) public {

        Identity identity = new Identity(_owners, _equities);
        emit NewIdentity(address(identity), _owners);
    }
}
