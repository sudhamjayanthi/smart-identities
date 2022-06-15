// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

interface IERC20 {
    function transfer(address _to, uint256 _value) external;

    function balanceOf(address _owner) external view returns (uint256 balance);
}

interface IERC721 {
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external;
}

interface IERC721Receiver {
    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) external returns (bytes4);
}

/// @title Identity
/// @author Sudham Jayanthi
contract Identity is IERC721Receiver {
    address[] public owners;
    mapping(address => uint256) public equities; // percentage of equity as a integer (1-100)
    mapping(address => bool) public isOwner;

    address[] public acceptedTokens;

    struct NFT {
        address sentBy; // original owner of the nft
        address collection;
        uint256 tokenId;
        uint256 sentAt; // block number at which nft is sent
    }

    NFT[] public nfts;

    constructor(address[] memory _owners, uint256[] memory _equities) {
        owners = _owners;
        for (uint256 i = 0; i < _owners.length; ) {
            isOwner[_owners[i]] = true;
            equities[_owners[i]] = _equities[i];

            unchecked {
                ++i;
            }
        }
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    function getNfts() external view returns (NFT[] memory) {
        return nfts;
    }

    function getAcceptedTokens() external view returns (address[] memory) {
        return acceptedTokens;
    }

    function transferNFT(address nftCollection, uint256 tokenId) public {
        IERC721(nftCollection).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId
        );

        NFT memory nft = NFT(msg.sender, nftCollection, tokenId, block.number);
        nfts.push(nft);
    }

    function hasNft(address nftCollection, uint256 tokenId)
        external
        view
        returns (bool, uint256)
    {
        bool doIHave;
        uint256 since;

        for (uint256 i = 0; i < nfts.length; ++i) {
            if (
                nfts[i].collection == nftCollection &&
                nfts[i].tokenId == tokenId
            ) {
                doIHave = true;
                since = block.number - nfts[i].sentAt;
            }
        }

        return (doIHave, since);
    }

    function acceptErc20(address token) public onlyOwners {
        // Anyone can transfer ERC20 tokens or native token to the contract. Any owner can add the addresses of tokens that they're willing to accept
        acceptedTokens.push(token);
    }

    // @notice  Withdraws native and erc20 tokens according to the equities of owners
    function withdraw() public onlyOwners {
        uint256 _etherBal = address(this).balance;

        for (uint256 i = 0; i < owners.length; ) {
            payable(owners[i]).transfer(
                (_etherBal * equities[owners[i]]) / 100
            );

            unchecked {
                ++i;
            }
        }

        for (uint256 j = 0; j < acceptedTokens.length; j++) {
            uint256 erc20Bal = IERC20(acceptedTokens[j]).balanceOf(
                address(this)
            );

            for (uint256 i = 0; i < owners.length; i++) {
                IERC20(acceptedTokens[j]).transfer(
                    owners[i],
                    (erc20Bal * equities[owners[i]]) / 100
                );
            }
        }
    }

    function disintegrate() public onlyOwners {
        withdraw();
        for (uint256 i = 0; i < nfts.length; ) {
            IERC721(nfts[i].collection).safeTransferFrom(
                address(this),
                nfts[i].sentBy,
                nfts[i].tokenId
            );

            unchecked {
                ++i;
            }
        }
        selfdestruct(payable(msg.sender));
    }

    receive() external payable {}

    modifier onlyOwners() {
        require(isOwner[msg.sender], "not a owner");
        _;
    }
}
