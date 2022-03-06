//------------------------------------------------------ \\
// This file is exported to ---> src/App.js
// Solidity Abi is used to generate a contract
// We are using Ethers.js human readable Abi for our App
// -------------- Application Begins Bellow ------------ //

// ----------------------------------------------------------------------
// abiPPeC : Paid Per Click [ERC20] Token abi
// ----------------------------------------------------------------------
const abiPPeC = [
    // Read-Only Functions
    "function balanceOf(address) external view returns (uint256 holdings)",
    // Authenticated Functions
    "function transfer(address to, uint256 amount)",
    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)",
];

// ----------------------------------------------------------------------
// abiSmaCCor : Smart Ads Contract Creator abi
// ----------------------------------------------------------------------
const abiSmaCCor = [
    // Read-Only Functions
    "function founder() external view returns (address)",
    "function treasury() external view returns (address)",
    "function minReward() external view returns (uint256)",
    "function claimerFee() external view returns (uint256)",
    "function promoterFee() external view returns (uint256)",
    "function pledged(address) external view returns (uint256)",
    "function registered(address) external view returns (bool)", // Verifies that the sender is registered
    "function promotionCount() external view returns (uint256)",
    "function minClaimerBalance() external view returns (uint256)",
    "function advertisements(uint256) external view returns (address)",
    "function promoterAdCount(address) external view returns (uint256)",
    "function senderHash(address, bytes32) external view returns (bool)", // Verifies that the sender hash is approved
    "function balanceOf(address) external view returns (uint256 holdings)",
    "function promoterAds(address, uint256) external view returns (address)",
    "function ownerInfo(address owner) public view returns(uint256 wallet, uint256 pledge, uint256 adCount)",
    "function contractInfo() external view returns (uint256, uint256, uint256, uint256, uint256, uint256)",
    // Authenticated Functions
    "function removeAd(uint256 index)",
    "function getHash(string memory key, bytes32 senderNewHash, bytes32 newHashA, bytes32 newHashB)",
    "function checkHash(string memory key, bytes32 senderNewHash)",
    "function launchAd(string memory title, string memory link, uint256 reach, uint256 reward)",
    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)",
    "event LaunchAd(string link, string title, uint256 reach, uint256 reward, uint256 budget, uint256 indexed created, address indexed promoter, address indexed adsContract)",
    // Errors
    "error InsufficientBalance(account owner, uint balance)",
    "error BudgetExceedBalance(uint256 budget, uint256 balance)",
    "error PledgeExceedBalance(uint256 pledged, uint256 balance)",
    "error RewardTooLow(uint256 reward, uint256 minReward)",
    "error IndexOutOfBound(uint256 index)",
    "error NotDelegateContract()"
];

// ----------------------------------------------------------------------
// abiSmaC : Smart Ads Contract abi
// ----------------------------------------------------------------------
const abiSmaC = [
    // Read-Only Functions
    "function claimStatus() external view returns (bool)",
    "function cofferBalance() external view returns (uint256)",
    "function pledgedBalance() external view returns (uint256)",
    "function getInfo() external view returns (string memory, string memory, uint256,  uint256,  uint256, uint256,  uint256, uint256, uint256,  uint256, bool, address)",
    // Authenticated Functions
    "function scam()",
    "function claim(string memory key, bytes32 newHash)",
    "function destroy()",
    "function scamReport()",
    "function delegateCleaner(string memory key, bytes32 newHash)",
    // Events
    "event Scam()",
    "event Destroy()",
    "event ScamReport()",
    "event Claim(address indexed claimer, uint256 reward)",
    "event DelegateCleaner(address indexed claimer, uint256 reward)",
    // Errors
    "error NotEnoughTokens(uint256 minBalance, uint256 balance)",
    "error NotEnoughReward(uint256 reward, uint256 coffer)",
    "error PromotionRunning()",
    "error PromotionEnded()",
    " error CannotClean()",
    "error Claimed()"
];

export { abiPPeC, abiSmaCCor, abiSmaC };