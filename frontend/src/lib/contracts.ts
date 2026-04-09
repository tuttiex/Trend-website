// BondingCurveDEX Contract ABI (minimal for swap functionality)
export const BONDING_CURVE_DEX_ABI = [
  // Read functions
  {
    "inputs": [],
    "name": "getPrice",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "ethAmount", "type": "uint256" }],
    "name": "getTokensOut",
    "outputs": [
      { "internalType": "uint256", "name": "tokensOut", "type": "uint256" },
      { "internalType": "uint256", "name": "fee", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenAmount", "type": "uint256" }],
    "name": "getEthOut",
    "outputs": [
      { "internalType": "uint256", "name": "ethOut", "type": "uint256" },
      { "internalType": "uint256", "name": "fee", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenReserve",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ethReserve",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swapFeeBps",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Write functions
  {
    "inputs": [{ "internalType": "uint256", "name": "minTokensOut", "type": "uint256" }],
    "name": "buyTokens",
    "outputs": [{ "internalType": "uint256", "name": "tokensOut", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "minEthOut", "type": "uint256" }
    ],
    "name": "sellTokens",
    "outputs": [{ "internalType": "uint256", "name": "ethOut", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "ethIn", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "tokensOut", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" }
    ],
    "name": "TokensPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "seller", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "tokensIn", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "ethOut", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" }
    ],
    "name": "TokensSold",
    "type": "event"
  }
];

// ERC20 Token ABI (minimal for approvals and balance)
export const ERC20_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Chain configuration
export const SUPPORTED_CHAINS = {
  BASE_SEPOLIA: {
    id: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
  },
  BASE_MAINNET: {
    id: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
  }
};

// Default chain (Base Sepolia for testing)
export const DEFAULT_CHAIN = SUPPORTED_CHAINS.BASE_SEPOLIA; // Change to BASE_MAINNET for production
