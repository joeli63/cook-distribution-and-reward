import { ethers } from "hardhat";
import { ContractTransaction } from "ethers";
import BigNumber from "bignumber.js";
import { MockCOOK } from "../typechain/MockCOOK";
import { RewardVesting } from "../typechain/RewardVesting";
import { StakingPools } from "../typechain/StakingPools";


const ERC20ABI = [ { constant: true, inputs: [], name: "name", outputs: [{ name: "", type: "string" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [ { name: "_spender", type: "address" }, { name: "_value", type: "uint256" }, ], name: "approve", outputs: [{ name: "", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [], name: "totalSupply", outputs: [{ name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [ { name: "_from", type: "address" }, { name: "_to", type: "address" }, { name: "_value", type: "uint256" }, ], name: "transferFrom", outputs: [{ name: "", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [{ name: "_owner", type: "address" }], name: "balanceOf", outputs: [{ name: "balance", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [ { name: "_to", type: "address" }, { name: "_value", type: "uint256" }, ], name: "transfer", outputs: [{ name: "", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [ { name: "_owner", type: "address" }, { name: "_spender", type: "address" }, ], name: "allowance", outputs: [{ name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { payable: true, stateMutability: "payable", type: "fallback" }, { anonymous: false, inputs: [ { indexed: true, name: "owner", type: "address" }, { indexed: true, name: "spender", type: "address" }, { indexed: false, name: "value", type: "uint256" }, ], name: "Approval", type: "event", }, { anonymous: false, inputs: [ { indexed: true, name: "from", type: "address" }, { indexed: true, name: "to", type: "address" }, { indexed: false, name: "value", type: "uint256" }, ], name: "Transfer", type: "event", }, ];
const UNIV2RouterABI = [ { inputs: [ { internalType: "address", name: "_factory", type: "address" }, { internalType: "address", name: "_WETH", type: "address" }, ], stateMutability: "nonpayable", type: "constructor", }, { inputs: [], name: "WETH", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function", }, { inputs: [ { internalType: "address", name: "tokenA", type: "address" }, { internalType: "address", name: "tokenB", type: "address" }, { internalType: "uint256", name: "amountADesired", type: "uint256" }, { internalType: "uint256", name: "amountBDesired", type: "uint256" }, { internalType: "uint256", name: "amountAMin", type: "uint256" }, { internalType: "uint256", name: "amountBMin", type: "uint256" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "addLiquidity", outputs: [ { internalType: "uint256", name: "amountA", type: "uint256" }, { internalType: "uint256", name: "amountB", type: "uint256" }, { internalType: "uint256", name: "liquidity", type: "uint256" }, ], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "address", name: "token", type: "address" }, { internalType: "uint256", name: "amountTokenDesired", type: "uint256" }, { internalType: "uint256", name: "amountTokenMin", type: "uint256" }, { internalType: "uint256", name: "amountETHMin", type: "uint256" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "addLiquidityETH", outputs: [ { internalType: "uint256", name: "amountToken", type: "uint256" }, { internalType: "uint256", name: "amountETH", type: "uint256" }, { internalType: "uint256", name: "liquidity", type: "uint256" }, ], stateMutability: "payable", type: "function", }, { inputs: [], name: "factory", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountOut", type: "uint256" }, { internalType: "uint256", name: "reserveIn", type: "uint256" }, { internalType: "uint256", name: "reserveOut", type: "uint256" }, ], name: "getAmountIn", outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }], stateMutability: "pure", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountIn", type: "uint256" }, { internalType: "uint256", name: "reserveIn", type: "uint256" }, { internalType: "uint256", name: "reserveOut", type: "uint256" }, ], name: "getAmountOut", outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }], stateMutability: "pure", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountOut", type: "uint256" }, { internalType: "address[]", name: "path", type: "address[]" }, ], name: "getAmountsIn", outputs: [ { internalType: "uint256[]", name: "amounts", type: "uint256[]" }, ], stateMutability: "view", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountIn", type: "uint256" }, { internalType: "address[]", name: "path", type: "address[]" }, ], name: "getAmountsOut", outputs: [ { internalType: "uint256[]", name: "amounts", type: "uint256[]" }, ], stateMutability: "view", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountA", type: "uint256" }, { internalType: "uint256", name: "reserveA", type: "uint256" }, { internalType: "uint256", name: "reserveB", type: "uint256" }, ], name: "quote", outputs: [{ internalType: "uint256", name: "amountB", type: "uint256" }], stateMutability: "pure", type: "function", }, { inputs: [ { internalType: "address", name: "tokenA", type: "address" }, { internalType: "address", name: "tokenB", type: "address" }, { internalType: "uint256", name: "liquidity", type: "uint256" }, { internalType: "uint256", name: "amountAMin", type: "uint256" }, { internalType: "uint256", name: "amountBMin", type: "uint256" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "removeLiquidity", outputs: [ { internalType: "uint256", name: "amountA", type: "uint256" }, { internalType: "uint256", name: "amountB", type: "uint256" }, ], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "address", name: "token", type: "address" }, { internalType: "uint256", name: "liquidity", type: "uint256" }, { internalType: "uint256", name: "amountTokenMin", type: "uint256" }, { internalType: "uint256", name: "amountETHMin", type: "uint256" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "removeLiquidityETH", outputs: [ { internalType: "uint256", name: "amountToken", type: "uint256" }, { internalType: "uint256", name: "amountETH", type: "uint256" }, ], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "address", name: "token", type: "address" }, { internalType: "uint256", name: "liquidity", type: "uint256" }, { internalType: "uint256", name: "amountTokenMin", type: "uint256" }, { internalType: "uint256", name: "amountETHMin", type: "uint256" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "removeLiquidityETHSupportingFeeOnTransferTokens", outputs: [{ internalType: "uint256", name: "amountETH", type: "uint256" }], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "address", name: "token", type: "address" }, { internalType: "uint256", name: "liquidity", type: "uint256" }, { internalType: "uint256", name: "amountTokenMin", type: "uint256" }, { internalType: "uint256", name: "amountETHMin", type: "uint256" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, { internalType: "bool", name: "approveMax", type: "bool" }, { internalType: "uint8", name: "v", type: "uint8" }, { internalType: "bytes32", name: "r", type: "bytes32" }, { internalType: "bytes32", name: "s", type: "bytes32" }, ], name: "removeLiquidityETHWithPermit", outputs: [ { internalType: "uint256", name: "amountToken", type: "uint256" }, { internalType: "uint256", name: "amountETH", type: "uint256" }, ], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "address", name: "token", type: "address" }, { internalType: "uint256", name: "liquidity", type: "uint256" }, { internalType: "uint256", name: "amountTokenMin", type: "uint256" }, { internalType: "uint256", name: "amountETHMin", type: "uint256" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, { internalType: "bool", name: "approveMax", type: "bool" }, { internalType: "uint8", name: "v", type: "uint8" }, { internalType: "bytes32", name: "r", type: "bytes32" }, { internalType: "bytes32", name: "s", type: "bytes32" }, ], name: "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens", outputs: [{ internalType: "uint256", name: "amountETH", type: "uint256" }], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "address", name: "tokenA", type: "address" }, { internalType: "address", name: "tokenB", type: "address" }, { internalType: "uint256", name: "liquidity", type: "uint256" }, { internalType: "uint256", name: "amountAMin", type: "uint256" }, { internalType: "uint256", name: "amountBMin", type: "uint256" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, { internalType: "bool", name: "approveMax", type: "bool" }, { internalType: "uint8", name: "v", type: "uint8" }, { internalType: "bytes32", name: "r", type: "bytes32" }, { internalType: "bytes32", name: "s", type: "bytes32" }, ], name: "removeLiquidityWithPermit", outputs: [ { internalType: "uint256", name: "amountA", type: "uint256" }, { internalType: "uint256", name: "amountB", type: "uint256" }, ], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountOut", type: "uint256" }, { internalType: "address[]", name: "path", type: "address[]" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "swapETHForExactTokens", outputs: [ { internalType: "uint256[]", name: "amounts", type: "uint256[]" }, ], stateMutability: "payable", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountOutMin", type: "uint256" }, { internalType: "address[]", name: "path", type: "address[]" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "swapExactETHForTokens", outputs: [ { internalType: "uint256[]", name: "amounts", type: "uint256[]" }, ], stateMutability: "payable", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountOutMin", type: "uint256" }, { internalType: "address[]", name: "path", type: "address[]" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "swapExactETHForTokensSupportingFeeOnTransferTokens", outputs: [], stateMutability: "payable", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountIn", type: "uint256" }, { internalType: "uint256", name: "amountOutMin", type: "uint256" }, { internalType: "address[]", name: "path", type: "address[]" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "swapExactTokensForETH", outputs: [ { internalType: "uint256[]", name: "amounts", type: "uint256[]" }, ], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountIn", type: "uint256" }, { internalType: "uint256", name: "amountOutMin", type: "uint256" }, { internalType: "address[]", name: "path", type: "address[]" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "swapExactTokensForETHSupportingFeeOnTransferTokens", outputs: [], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountIn", type: "uint256" }, { internalType: "uint256", name: "amountOutMin", type: "uint256" }, { internalType: "address[]", name: "path", type: "address[]" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "swapExactTokensForTokens", outputs: [ { internalType: "uint256[]", name: "amounts", type: "uint256[]" }, ], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountIn", type: "uint256" }, { internalType: "uint256", name: "amountOutMin", type: "uint256" }, { internalType: "address[]", name: "path", type: "address[]" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "swapExactTokensForTokensSupportingFeeOnTransferTokens", outputs: [], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountOut", type: "uint256" }, { internalType: "uint256", name: "amountInMax", type: "uint256" }, { internalType: "address[]", name: "path", type: "address[]" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "swapTokensForExactETH", outputs: [ { internalType: "uint256[]", name: "amounts", type: "uint256[]" }, ], stateMutability: "nonpayable", type: "function", }, { inputs: [ { internalType: "uint256", name: "amountOut", type: "uint256" }, { internalType: "uint256", name: "amountInMax", type: "uint256" }, { internalType: "address[]", name: "path", type: "address[]" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "deadline", type: "uint256" }, ], name: "swapTokensForExactTokens", outputs: [ { internalType: "uint256[]", name: "amounts", type: "uint256[]" }, ], stateMutability: "nonpayable", type: "function", }, { stateMutability: "payable", type: "receive" }, ];
const WETHABI = [ { constant: true, inputs: [], name: "name", outputs: [{ name: "", type: "string" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [ { name: "guy", type: "address" }, { name: "wad", type: "uint256" }, ], name: "approve", outputs: [{ name: "", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [], name: "totalSupply", outputs: [{ name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [ { name: "src", type: "address" }, { name: "dst", type: "address" }, { name: "wad", type: "uint256" }, ], name: "transferFrom", outputs: [{ name: "", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: false, inputs: [{ name: "wad", type: "uint256" }], name: "withdraw", outputs: [], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [{ name: "", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [ { name: "dst", type: "address" }, { name: "wad", type: "uint256" }, ], name: "transfer", outputs: [{ name: "", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: false, inputs: [], name: "deposit", outputs: [], payable: true, stateMutability: "payable", type: "function", }, { constant: true, inputs: [ { name: "", type: "address" }, { name: "", type: "address" }, ], name: "allowance", outputs: [{ name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { payable: true, stateMutability: "payable", type: "fallback" }, { anonymous: false, inputs: [ { indexed: true, name: "src", type: "address" }, { indexed: true, name: "guy", type: "address" }, { indexed: false, name: "wad", type: "uint256" }, ], name: "Approval", type: "event", }, { anonymous: false, inputs: [ { indexed: true, name: "src", type: "address" }, { indexed: true, name: "dst", type: "address" }, { indexed: false, name: "wad", type: "uint256" }, ], name: "Transfer", type: "event", }, { anonymous: false, inputs: [ { indexed: true, name: "dst", type: "address" }, { indexed: false, name: "wad", type: "uint256" }, ], name: "Deposit", type: "event", }, { anonymous: false, inputs: [ { indexed: true, name: "src", type: "address" }, { indexed: false, name: "wad", type: "uint256" }, ], name: "Withdrawal", type: "event", }, ];
const UNIFACTORYABI = [ { inputs: [ { internalType: "address", name: "_feeToSetter", type: "address" }, ], payable: false, stateMutability: "nonpayable", type: "constructor", }, { anonymous: false, inputs: [ { indexed: true, internalType: "address", name: "token0", type: "address", }, { indexed: true, internalType: "address", name: "token1", type: "address", }, { indexed: false, internalType: "address", name: "pair", type: "address", }, { indexed: false, internalType: "uint256", name: "", type: "uint256" }, ], name: "PairCreated", type: "event", }, { constant: true, inputs: [{ internalType: "uint256", name: "", type: "uint256" }], name: "allPairs", outputs: [{ internalType: "address", name: "", type: "address" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [], name: "allPairsLength", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [ { internalType: "address", name: "tokenA", type: "address" }, { internalType: "address", name: "tokenB", type: "address" }, ], name: "createPair", outputs: [{ internalType: "address", name: "pair", type: "address" }], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [], name: "feeTo", outputs: [{ internalType: "address", name: "", type: "address" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [], name: "feeToSetter", outputs: [{ internalType: "address", name: "", type: "address" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [ { internalType: "address", name: "", type: "address" }, { internalType: "address", name: "", type: "address" }, ], name: "getPair", outputs: [{ internalType: "address", name: "", type: "address" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [{ internalType: "address", name: "_feeTo", type: "address" }], name: "setFeeTo", outputs: [], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: false, inputs: [ { internalType: "address", name: "_feeToSetter", type: "address" }, ], name: "setFeeToSetter", outputs: [], payable: false, stateMutability: "nonpayable", type: "function", }, ];
const UNIV2PAIR = [ { inputs: [], payable: false, stateMutability: "nonpayable", type: "constructor", }, { anonymous: false, inputs: [ { indexed: true, internalType: "address", name: "owner", type: "address", }, { indexed: true, internalType: "address", name: "spender", type: "address", }, { indexed: false, internalType: "uint256", name: "value", type: "uint256", }, ], name: "Approval", type: "event", }, { anonymous: false, inputs: [ { indexed: true, internalType: "address", name: "sender", type: "address", }, { indexed: false, internalType: "uint256", name: "amount0", type: "uint256", }, { indexed: false, internalType: "uint256", name: "amount1", type: "uint256", }, { indexed: true, internalType: "address", name: "to", type: "address" }, ], name: "Burn", type: "event", }, { anonymous: false, inputs: [ { indexed: true, internalType: "address", name: "sender", type: "address", }, { indexed: false, internalType: "uint256", name: "amount0", type: "uint256", }, { indexed: false, internalType: "uint256", name: "amount1", type: "uint256", }, ], name: "Mint", type: "event", }, { anonymous: false, inputs: [ { indexed: true, internalType: "address", name: "sender", type: "address", }, { indexed: false, internalType: "uint256", name: "amount0In", type: "uint256", }, { indexed: false, internalType: "uint256", name: "amount1In", type: "uint256", }, { indexed: false, internalType: "uint256", name: "amount0Out", type: "uint256", }, { indexed: false, internalType: "uint256", name: "amount1Out", type: "uint256", }, { indexed: true, internalType: "address", name: "to", type: "address" }, ], name: "Swap", type: "event", }, { anonymous: false, inputs: [ { indexed: false, internalType: "uint112", name: "reserve0", type: "uint112", }, { indexed: false, internalType: "uint112", name: "reserve1", type: "uint112", }, ], name: "Sync", type: "event", }, { anonymous: false, inputs: [ { indexed: true, internalType: "address", name: "from", type: "address" }, { indexed: true, internalType: "address", name: "to", type: "address" }, { indexed: false, internalType: "uint256", name: "value", type: "uint256", }, ], name: "Transfer", type: "event", }, { constant: true, inputs: [], name: "DOMAIN_SEPARATOR", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [], name: "MINIMUM_LIQUIDITY", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [], name: "PERMIT_TYPEHASH", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [ { internalType: "address", name: "", type: "address" }, { internalType: "address", name: "", type: "address" }, ], name: "allowance", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [ { internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "value", type: "uint256" }, ], name: "approve", outputs: [{ internalType: "bool", name: "", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [{ internalType: "address", name: "", type: "address" }], name: "balanceOf", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [{ internalType: "address", name: "to", type: "address" }], name: "burn", outputs: [ { internalType: "uint256", name: "amount0", type: "uint256" }, { internalType: "uint256", name: "amount1", type: "uint256" }, ], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [], name: "decimals", outputs: [{ internalType: "uint8", name: "", type: "uint8" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [], name: "factory", outputs: [{ internalType: "address", name: "", type: "address" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [], name: "getReserves", outputs: [ { internalType: "uint112", name: "_reserve0", type: "uint112" }, { internalType: "uint112", name: "_reserve1", type: "uint112" }, { internalType: "uint32", name: "_blockTimestampLast", type: "uint32" }, ], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [ { internalType: "address", name: "_token0", type: "address" }, { internalType: "address", name: "_token1", type: "address" }, ], name: "initialize", outputs: [], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [], name: "kLast", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [{ internalType: "address", name: "to", type: "address" }], name: "mint", outputs: [{ internalType: "uint256", name: "liquidity", type: "uint256" }], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [], name: "name", outputs: [{ internalType: "string", name: "", type: "string" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [{ internalType: "address", name: "", type: "address" }], name: "nonces", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [ { internalType: "address", name: "owner", type: "address" }, { internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "value", type: "uint256" }, { internalType: "uint256", name: "deadline", type: "uint256" }, { internalType: "uint8", name: "v", type: "uint8" }, { internalType: "bytes32", name: "r", type: "bytes32" }, { internalType: "bytes32", name: "s", type: "bytes32" }, ], name: "permit", outputs: [], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [], name: "price0CumulativeLast", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [], name: "price1CumulativeLast", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [{ internalType: "address", name: "to", type: "address" }], name: "skim", outputs: [], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: false, inputs: [ { internalType: "uint256", name: "amount0Out", type: "uint256" }, { internalType: "uint256", name: "amount1Out", type: "uint256" }, { internalType: "address", name: "to", type: "address" }, { internalType: "bytes", name: "data", type: "bytes" }, ], name: "swap", outputs: [], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [], name: "symbol", outputs: [{ internalType: "string", name: "", type: "string" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [], name: "sync", outputs: [], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: true, inputs: [], name: "token0", outputs: [{ internalType: "address", name: "", type: "address" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [], name: "token1", outputs: [{ internalType: "address", name: "", type: "address" }], payable: false, stateMutability: "view", type: "function", }, { constant: true, inputs: [], name: "totalSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function", }, { constant: false, inputs: [ { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "value", type: "uint256" }, ], name: "transfer", outputs: [{ internalType: "bool", name: "", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function", }, { constant: false, inputs: [ { internalType: "address", name: "from", type: "address" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "value", type: "uint256" }, ], name: "transferFrom", outputs: [{ internalType: "bool", name: "", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function", }, ];

export function hre() {
  return require("hardhat");
}

async function main() {
    console.log("=========== LP Mining Deployment Start ===========")
    // await run("compile");

    const [
      cookLPDeployer,
      depositor1,
      depositor2,
      depositor3,
      depositor4,
      depositor5,
      depositor6,
      depositor7,
      depositor8,
      referral1,
      referral2,
      referral3,
      referral4,
      referral5,
      referral6,
      referral7,
      referral8,
      ...signers
    ] = await ethers.getSigners();

    const depositors = [depositor1, depositor2, depositor3, depositor4, depositor5, depositor6, depositor7, depositor8];
    const referrals = [referral1, referral2, referral3, referral4, referral5, referral6, referral7, referral8];
    for (var i = 0; i < referrals.length; i++) {
      console.log(referrals[i].address);
    }
    // required contracts' addresses
    // TODO: currently set for Rinkeby testnet. should be changed for different chain
    const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    const COOK_ADDRESS = "0xff75ced57419bcaebe5f05254983b013b0646ef5";
    const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
    const UNISWAP_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    const uniswapRouterV2 = await ethers.getContractAt(UNIV2RouterABI, UNISWAP_ROUTER_ADDRESS);
    const uniswapFactory = await ethers.getContractAt(UNIFACTORYABI, UNISWAP_FACTORY_ADDRESS);
    const wETH = await ethers.getContractAt(WETHABI, WETH_ADDRESS);

    const MockCOOKFactory = await ethers.getContractFactory("MockCOOK");
    const cook = (await MockCOOKFactory.connect(cookLPDeployer).deploy("100000000000000000000000000")) as MockCOOK;
    console.log("============== cook address ==============:", cook.address)

    await uniswapFactory.connect(cookLPDeployer).createPair(cook.address, WETH_ADDRESS);
    const pairAddress = await uniswapFactory.connect(cookLPDeployer).getPair(cook.address, WETH_ADDRESS);
    console.log("======== liquidity pool created ============:", pairAddress);

    // Mint Cook and swap weth
    let overrides = {
      value: ethers.utils.parseEther("1000"),
      gasLimit: 600000,
    };
    await cook.mint(cookLPDeployer.address, "100000000000000000000000000")
    await wETH.connect(cookLPDeployer).deposit(overrides);
    await wETH.connect(cookLPDeployer).approve(uniswapRouterV2.address, "10000000000000000000000000");
    await cook.connect(cookLPDeployer).approve(uniswapRouterV2.address, "10000000000000000000000000");
    await uniswapRouterV2.connect(cookLPDeployer).addLiquidity(
      cook.address,
      WETH_ADDRESS,
      "100000000000000000000",
      "100000000000000000",
      "1000",
      "1000",
      cookLPDeployer.address,
      Date.now() * 2
    );

    for (var i = 0; i < depositors.length; i++) {
      await cook.mint(depositors[i].address, "100000000000000000000000000");
      await wETH.connect(depositors[i]).deposit(overrides);
      await wETH.connect(depositors[i]).approve(uniswapRouterV2.address, "10000000000000000000000000");
      await cook.connect(depositors[i]).approve(uniswapRouterV2.address, "10000000000000000000000000");
    
      await uniswapRouterV2.connect(depositors[i]).addLiquidity(
        cook.address,
        WETH_ADDRESS,
        "100000000000000000000",
        "100000000000000000",
        "1000",
        "1000",
        depositors[i].address,
        Date.now() * 2
      );
    }    
    

    const StakingPoolsFactory = await ethers.getContractFactory("StakingPools");
    const RewardVestingFactory = await ethers.getContractFactory("RewardVesting");

    /**
     * Deploy reward vesting
     */
    const rewardVesting = (await RewardVestingFactory.connect(cookLPDeployer).deploy(cookLPDeployer.address)) as RewardVesting;
    console.log("======= Reward Vesting deployed ======= : ", rewardVesting.address);

    const stakingPools = (await StakingPoolsFactory.connect(cookLPDeployer).deploy(
      cook.address,
      cookLPDeployer.address,
      cookLPDeployer.address,
      rewardVesting.address
    )) as StakingPools;

    console.log("======= Staking program  deployed ======= : ", stakingPools.address);

    cook.connect(cookLPDeployer).transfer(stakingPools.address, "1000000000000000000000000"); 
    await rewardVesting.connect(cookLPDeployer).initialize(cook.address, stakingPools.address);

    const rewardRate = "10000000000000000000";
    const createdPoolId = await stakingPools.connect(cookLPDeployer).createPool(pairAddress, true, 86400 * 90, 86400 * 90);
    await stakingPools.connect(cookLPDeployer).setRewardRate(rewardRate);
    await stakingPools.connect(cookLPDeployer).setRewardWeights([1]);
    await stakingPools.connect(cookLPDeployer).startReferralBonus(0);
    // console.log("======== pool created tx ========:", createdPoolId)

    const CookWETH = await ethers.getContractAt(ERC20ABI, pairAddress);
    CookWETH.connect(cookLPDeployer).approve(stakingPools.address, "10000000000000000000000");
    await stakingPools.connect(cookLPDeployer).deposit(0, "1000000000000000" , ZERO_ADDRESS);

    // For testing vesrting reward
    // for (var i = 0; i < 5; i++) {
    //     for (var j = 0; j < 50; j++) {
    //         await hre().network.provider.send("evm_mine", [])
    //     }
    //     await stakingPools.connect(cookLPDeployer).claim(0);
    //     await hre().network.provider.send("evm_increaseTime", [86400 * 2]); 
    // }

    // For testing referral
    for (var i = 0; i < depositors.length; i++) {
      await CookWETH.connect(depositors[i]).approve(stakingPools.address, "10000000000000000000000");
      await stakingPools.connect(depositors[i]).deposit(0, "1000000000000000" , referrals[i].address);

      // for (var j = 0; j < 50; j++) {
      //   await hre().network.provider.send("evm_mine", []);
      // }
    }

    const numOfReferrals = stakingPools.connect(cookLPDeployer).nextReferral(0);
    console.log("====== pool 0 referrals: ======", (await numOfReferrals).toNumber())

    for (var i = 0; i < referrals.length; i++) {
      const referralPower = await stakingPools.getAccumulatedReferralPower(referrals[i].address, 0)
      console.log("====== referral power: =======", referralPower.toBigInt().toString());
    }

    console.log("\n==================== Start of Cook Staking deployment ======================")
    const CookPoolFactory = await ethers.getContractFactory("CookPool", cookLPDeployer);
    const cookPool1 = await CookPoolFactory.deploy(cook.address, "10000000000000000000", 0, 0)
    await cookPool1.deployed()
    console.log("============== cook pool addres1: ===================", cookPool1.address)

    const cookPool2 = await CookPoolFactory.deploy(cook.address, "20000000000000000000", 0, 0)
    await cookPool1.deployed();
    console.log("============== cook pool addres2: ===================", cookPool2.address)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
