// contracts/SimpleMarket.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SimpleMarket
 * @dev A minimal market contract that emits SettlementRequested for Chainlink CRE to pick up.
 * WARNING: This contract is for hackathon/demo purposes only. Not audited for production.
 */
contract SimpleMarket is Ownable, ReentrancyGuard {
    struct Market {
        string question;
        uint256 resolveTimestamp;
        bool settled;
        bool result;
    }

    mapping(uint256 => Market) public markets;
    uint256 public nextMarketId = 101;
    address public creSettler;

    event MarketCreated(uint256 indexed marketId, string question, uint256 resolveTimestamp);
    event SettlementRequested(uint256 indexed marketId, string question);
    event MarketSettled(uint256 indexed marketId, bool result);
    event CreSettlerUpdated(address indexed oldSettler, address indexed newSettler);

    constructor(address _initialSettler) {
        creSettler = _initialSettler;
    }

    function setCreSettler(address _newSettler) external onlyOwner {
        require(_newSettler != address(0), "Invalid address");
        emit CreSettlerUpdated(creSettler, _newSettler);
        creSettler = _newSettler;
    }

    function createMarket(string calldata _question, uint256 _resolveTimestamp) external nonReentrant {
        require(bytes(_question).length > 0, "Empty question");
        require(_resolveTimestamp > block.timestamp, "Deadline must be in future");
        
        markets[nextMarketId] = Market(_question, _resolveTimestamp, false, false);
        emit MarketCreated(nextMarketId, _question, _resolveTimestamp);
        nextMarketId++;
    }

    /**
     * @notice This event triggers the Chainlink CRE workflow.
     */
    function requestSettlement(uint256 _marketId) external nonReentrant {
        require(!markets[_marketId].settled, "Already settled");
        require(block.timestamp >= markets[_marketId].resolveTimestamp, "Market not yet mature");
        emit SettlementRequested(_marketId, markets[_marketId].question);
    }

    /**
     * @notice Called by the Chainlink CRE workflow after LLM oracle verification.
     */
    function settleMarket(uint256 _marketId, bool _result) external nonReentrant {
        require(msg.sender == creSettler || msg.sender == owner(), "Unauthorized settler");
        require(!markets[_marketId].settled, "Already settled");

        markets[_marketId].settled = true;
        markets[_marketId].result = _result;
        emit MarketSettled(_marketId, _result);
    }
}
