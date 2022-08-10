// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./Identity.sol";

/// @title identity factory
/// @author Sudham Jayanthi
/// @notice factory contract to deploy new identities
contract IdentityFactory {

    /// @notice Emits when a new identity is created
    event NewIdentity(address indexed identity, address[] owners);

    /// @notice creates new identity
    /// @param _owners list of owners of the identity
    /// @param _equities list of owners of the equities corresponding to the identities
    function createIdentity(
        address[] memory _owners,
        uint256[] memory _equities
    ) public {
        Identity identity = new Identity(_owners, _equities);
        emit NewIdentity(address(identity), _owners);
    }
}
