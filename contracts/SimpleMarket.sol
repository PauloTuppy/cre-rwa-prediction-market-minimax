// contracts/SimpleMarket.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SimpleMarket
 * @dev A minimal market contract that emits SettlementRequested for Chainlink CRE to pick up.
 */
contract SimpleMarket {
    struct Market {
        string question;
        bool settled;
        bool result;
    }

    mapping(uint256 => Market) public markets;
    uint256 public nextMarketId = 101;

    event MarketCreated(uint256 indexed marketId, string question);
    event SettlementRequested(uint256 indexed marketId, string question);
    event MarketSettled(uint256 indexed marketId, bool result);

    function createMarket(string calldata _question) external {
        markets[nextMarketId] = Market(_question, false, false);
        emit MarketCreated(nextMarketId, _question);
        nextMarketId++;
    }

    /**
     * @notice This event triggers the Chainlink CRE workflow.
     */
    function requestSettlement(uint256 _marketId) external {
        require(!markets[_marketId].settled, "Already settled");
        emit SettlementRequested(_marketId, markets[_marketId].question);
    }

    /**
     * @notice Called by the Chainlink CRE workflow after LLM oracle verification.
     */
    function settleMarket(uint256 _marketId, bool _result) external {
        // In production, add access control (e.g. onlyCRE)
        markets[_marketId].settled = true;
        markets[_marketId].result = _result;
        emit MarketSettled(_marketId, _result);
    }
}
