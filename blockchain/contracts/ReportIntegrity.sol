// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReportIntegrity
 * @dev Stores SHA-256 integrity hashes of CodeLens AI review reports on-chain.
 */
contract ReportIntegrity {

    struct Record {
        uint256 timestamp;
        address issuer;
        bool exists;
    }

    // Mapping of report hash (SHA-256) to registration record
    mapping(bytes32 => Record) private registry;

    // Events
    event ReportRegistered(bytes32 indexed reportHash, address indexed issuer, uint256 timestamp);

    /**
     * @dev Registers a code review report hash on the blockchain.
     * @param reportHash Cryptographic hash (SHA-256) of the report content.
     */
    function registerReport(bytes32 reportHash) external {
        require(reportHash != bytes32(0), "Invalid report hash");
        require(!registry[reportHash].exists, "Report already registered");

        registry[reportHash] = Record({
            timestamp: block.timestamp,
            issuer: msg.sender,
            exists: true
        });

        emit ReportRegistered(reportHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Verifies if a report hash exists in the registry.
     * @param reportHash Cryptographic hash to query.
     * @return exists Boolean indicating existence.
     * @return timestamp The block timestamp of registration.
     * @return issuer The address that registered the hash.
     */
    function verifyReport(bytes32 reportHash) external view returns (
        bool exists,
        uint256 timestamp,
        address issuer
    ) {
        Record memory rec = registry[reportHash];
        return (rec.exists, rec.timestamp, rec.issuer);
    }
}
