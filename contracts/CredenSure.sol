// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CredenSure {
    struct Credential {
        address issuer;
        string data;
        uint256 issuedAt;
    }

    struct Endorsement {
        address endorser;
        
        string message;
        uint256 endorsedAt;
    }

    mapping(address => Credential[]) public credentials;
    mapping(address => Endorsement[]) public endorsements;

    event CredentialIssued(address indexed recipient, address indexed issuer, string data, uint256 issuedAt);
    event EndorsementAdded(address indexed recipient, address indexed endorser, string message, uint256 endorsedAt);

    function issueCredential(address recipient, string memory data) public {
        Credential memory newCredential = Credential({
            issuer: msg.sender,
            data: data,
            issuedAt: block.timestamp
        });

        credentials[recipient].push(newCredential);

        emit CredentialIssued(recipient, msg.sender, data, block.timestamp);
    }

    function endorse(address recipient, string memory message) public {
        Endorsement memory newEndorsement = Endorsement({
            endorser: msg.sender,
            message: message,
            endorsedAt: block.timestamp
        });

        endorsements[recipient].push(newEndorsement);

        emit EndorsementAdded(recipient, msg.sender, message, block.timestamp);
    }

    function getCredentials(address user) public view returns (Credential[] memory) {
        return credentials[user];
    }

    function getEndorsements(address user) public view returns (Endorsement[] memory) {
        return endorsements[user];
    }
}
