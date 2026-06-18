// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EduChainRegistry {
    struct Certificate {
        address issuer;
        uint256 timestamp;
        bool revoked;
    }
    mapping(bytes32 => Certificate) private certs;

    event CertificateIssued(bytes32 indexed certHash, address indexed issuer, uint256 timestamp);
    event CertificateRevoked(bytes32 indexed certHash, address indexed revoker);

    function issueCertificate(bytes32 certHash) external {
        require(certs[certHash].timestamp == 0, "Already exists");
        certs[certHash] = Certificate(msg.sender, block.timestamp, false);
        emit CertificateIssued(certHash, msg.sender, block.timestamp);
    }

    function revokeCertificate(bytes32 certHash) external {
        require(certs[certHash].issuer == msg.sender, "Not issuer");
        certs[certHash].revoked = true;
        emit CertificateRevoked(certHash, msg.sender);
    }

    function isValid(bytes32 certHash) external view returns (bool) {
        return certs[certHash].timestamp > 0 && !certs[certHash].revoked;
    }

    function getCertificate(bytes32 certHash) external view returns (address, uint256, bool) {
        Certificate memory c = certs[certHash];
        return (c.issuer, c.timestamp, c.revoked);
    }
}
