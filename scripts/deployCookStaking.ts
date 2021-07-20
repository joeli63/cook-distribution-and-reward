import { ethers } from "hardhat";
import { ContractTransaction } from "ethers";
import { MockCOOK } from "../typechain/MockCOOK";
import { RewardVesting } from "../typechain/RewardVesting";
import { StakingPools } from "../typechain/StakingPools";
import { BigNumber } from "@ethersproject/bignumber";


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

    const MockCOOKFactory = await ethers.getContractFactory("MockCOOK");
    const cook = (await MockCOOKFactory.connect(cookLPDeployer).deploy("100000000000000000000000000")) as MockCOOK;
    const cli = (await MockCOOKFactory.connect(cookLPDeployer).deploy("100000000000000000000000000")) as MockCOOK;

    const toTokenUnitsBN = (tokenAmount: BigNumber, tokenDecimals: number) => {
      const amt = BigNumber.from(tokenAmount);
      const digits = BigNumber.from(10).pow(BigNumber.from(tokenDecimals));
      return amt.div(digits).toNumber();
    }    

    console.log("============== cli address ==============:", cli.address)
    console.log("============== cook address ==============:", cook.address)

    const StakingPoolsFactory = await ethers.getContractFactory("StakingPools");
    const RewardVestingFactory = await ethers.getContractFactory("RewardVesting");

    /**
     * Deploy reward vesting
     */
    const rewardVesting = (await RewardVestingFactory.connect(cookLPDeployer).deploy(cookLPDeployer.address)) as RewardVesting;
    // console.log("======= Reward Vesting deployed ======= : ", rewardVesting.address);

    const stakingPools = (await StakingPoolsFactory.connect(cookLPDeployer).deploy(
      cook.address,
      cookLPDeployer.address,
      cookLPDeployer.address,
    )) as StakingPools;

    await cook.mint(cookLPDeployer.address, "100000000000000000000000000");
    await cook.mint(stakingPools.address, "100000000000000000000000000");  
    await cli.mint(cookLPDeployer.address, "100000000000000000000000000");
    await cli.mint(stakingPools.address, "100000000000000000000000000"); 

    console.log("======= Staking program  deployed ======= : ", stakingPools.address);
    await rewardVesting.connect(cookLPDeployer).initialize(cook.address, stakingPools.address);

    const rewardRate = "10000000000000000000";
      
    await stakingPools.connect(cookLPDeployer).createPool(cli.address, true, rewardVesting.address, 86400 * 14, 86400 * 14, 20);
    await stakingPools.connect(cookLPDeployer).setRewardRate(rewardRate);
    await stakingPools.connect(cookLPDeployer).setRewardWeights([1]);
    await stakingPools.connect(cookLPDeployer).startReferralBonus(0);

    await stakingPools.connect(cookLPDeployer).createPool(cook.address, true, rewardVesting.address, 86400 * 90, 86400 * 90, 20);

    const cliPoolRewardAddress = await stakingPools.connect(cookLPDeployer).getPoolRewardVesting(0);
    const cliPoolLockupPeriod = await stakingPools.connect(cookLPDeployer).getPoolLockPeriodInSecs(0);
    const cliPoolSlashPercentage = await stakingPools.connect(cookLPDeployer).getPoolSlashPercentage(0);
    const cliPoolVestingDuration = await stakingPools.connect(cookLPDeployer).getPoolVestingDurationInSecs(0)
    console.log("================ pool 0 reward address ================:", cliPoolRewardAddress)
    console.log("================ pool 0 lockup period  ================:", cliPoolLockupPeriod.toNumber())
    console.log("================ pool 0 vesting period  ================:", cliPoolVestingDuration.toNumber())
    console.log("================ pool 0 slash percentage  ================:", cliPoolSlashPercentage.toNumber())

    const cookPoolRewardAddress = await stakingPools.connect(cookLPDeployer).getPoolRewardVesting(1);
    const cookPoolLockupPeriod = await stakingPools.connect(cookLPDeployer).getPoolLockPeriodInSecs(1);
    const cookPoolSlashPercentage = await stakingPools.connect(cookLPDeployer).getPoolSlashPercentage(1);
    const cookPoolVestingDuration = await stakingPools.connect(cookLPDeployer).getPoolVestingDurationInSecs(1)
    console.log("================ pool 1 reward address ================:", cookPoolRewardAddress)
    console.log("================ pool 1 lockup period  ================:", cookPoolLockupPeriod.toNumber())
    console.log("================ pool 1 vesting period  ================:", cookPoolVestingDuration.toNumber())
    console.log("================ pool 1 slash percentage  ================:", cookPoolSlashPercentage.toNumber())

    await cli.connect(cookLPDeployer).approve(stakingPools.address, "100000000000000000000"); 
    await stakingPools.connect(cookLPDeployer).deposit(0, "1000000000000000" , ZERO_ADDRESS);

    // For testing vesrting reward
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 50; j++) {
            await hre().network.provider.send("evm_mine", [])
        }
        await stakingPools.connect(cookLPDeployer).claim(0);
        await hre().network.provider.send("evm_increaseTime", [86400 * 30]); 
    }

    // For testing referral
    for (var i = 0; i < depositors.length; i++) {
      await cli.mint(depositors[i].address, "100000000000000000000000000");
      await cli.connect(depositors[i]).approve(stakingPools.address, "100000000000000000000000000");
      const amount = ethers.utils.parseEther(i.toString())
      await stakingPools.connect(depositors[i]).deposit(0, amount , referrals[i].address);

      for (var j = 0; j < 50; j++) {
        await hre().network.provider.send("evm_mine", []);
      }
    }

    const numOfReferrals = stakingPools.connect(cookLPDeployer).nextReferral(0);
    console.log("====== pool 0 referrals: ======", (await numOfReferrals).toNumber())

    for (var i = 0; i < referrals.length; i++) {  
      const myReferee = await stakingPools.connect(referrals[i]).getPoolreferee(0, referrals[i].address)
      var totalRefereeStakeAmount = 0

      for (var j = 0; j < myReferee.length; j++) {
        const stake = await stakingPools.connect(referrals[i]).getStakeTotalDeposited(myReferee[j], 0)
        const refereeStake = toTokenUnitsBN(stake, 18)
        totalRefereeStakeAmount = totalRefereeStakeAmount + refereeStake
      }
      console.log("====== referral power: =======", totalRefereeStakeAmount.toString());
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
