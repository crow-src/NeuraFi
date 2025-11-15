// abi/index.js
export const IMulticall = [
	// read-only
	'function getBasefee() view returns (uint256 basefee)',
	'function getBlockHash(uint256 blockNumber) view returns (bytes32 blockHash)',
	'function getBlockNumber() view returns (uint256 blockNumber)',
	'function getChainId() view returns (uint256 chainid)',
	'function getCurrentBlockCoinbase() view returns (address coinbase)',
	'function getCurrentBlockDifficulty() view returns (uint256 difficulty)',
	'function getCurrentBlockGasLimit() view returns (uint256 gaslimit)',
	'function getCurrentBlockTimestamp() view returns (uint256 timestamp)',
	'function getEthBalance(address addr) view returns (uint256 balance)',
	'function getLastBlockHash() view returns (bytes32 blockHash)',

	'function aggregate(tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes[] returnData)',
	'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
	'function aggregate3Value(tuple(address target, bool allowFailure, uint256 value, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
	'function blockAndAggregate(tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes32 blockHash, tuple(bool success, bytes returnData)[] returnData)',
	'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
	'function tryBlockAndAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes32 blockHash, tuple(bool success, bytes returnData)[] returnData)'
];

export const IOwnable = [
	// Read-Only
	'function owner() view returns (address)',
	// State-Changing
	'function renounceOwnership()',
	'function transferOwnership(address newOwner)',
	// Events
	'error OwnableInvalidOwner(address owner)',
	'error OwnableUnauthorizedAccount(address account)',
	'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
	'event OwnershipRenounced(address indexed previousOwner)'
];

export const IUniswapV2Router = [
	// Read-Only
	'function factory() external pure returns (address)',
	'function WETH() external pure returns (address)',
	'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)', // in是支付 out是收到 检测交易路径上的收到金额 这是返回两个额度
	'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)', // 检测交易路径上的支付金额   这是返回两个额度
	// Pure
	'function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut)',
	'function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn)',
	'function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB)',

	// State-Changing
	'function addLiquidity(address tokenA, address tokenB,uint amountADesired,uint amountBDesired,uint amountAMin,uint amountBMin,address to,uint deadline) external returns (uint amountA, uint amountB, uint liquidity)',
	'function addLiquidityETH(address token,uint amountTokenDesired,uint amountTokenMin,uint amountETHMin,address to,uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)',

	'function removeLiquidity(address tokenA,address tokenB,uint liquidity,uint amountAMin,uint amountBMin,address to,uint deadline) external returns (uint amountA, uint amountB)',
	'function removeLiquidityETH(address token,uint liquidity,uint amountTokenMin,uint amountETHMin,address to,uint deadline) external returns (uint amountToken, uint amountETH)',
	'function removeLiquidityWithPermit(address tokenA,address tokenB,uint liquidity,uint amountAMin,uint amountBMin,address to,uint deadline,bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountA, uint amountB)',
	'function removeLiquidityETHWithPermit(address token,uint liquidity,uint amountTokenMin,uint amountETHMin,address to,uint deadline,bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountToken, uint amountETH)',
	'function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns(uint amountETH)',
	'function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns(uint amountETH)',

	'function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)', // 精确输入，最小输出
	'function swapTokensForExactTokens(uint amountOut,uint amountInMax,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)', // 最大输入，精确输出
	'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)', // 精确输入，最小输出 ETH
	'function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)', // 最大输入，精确输出 ETH
	'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)', // 精确输入，最小输出 ETH
	'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)', // 最大输入，精确输出 ETH

	'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
	'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
	'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external'
];

export const IUniswapV2Factory = [
	// Read-Only
	'function allPairsLength() view returns (uint)',
	'function getPair(address, address) view returns (address)',
	'function feeTo() view returns (address)',
	'function feeToSetter() view returns (address)',
	'function allPairs(uint) view returns (address)',
	// State-Changing
	'function createPair(address tokenA, address tokenB) external returns (address pair)',
	'function setFeeTo(address _feeTo) external',
	'function setFeeToSetter(address _feeToSetter) external',
	// Events
	'event PairCreated(address indexed token0, address indexed token1, address pair, uint)' // Events
];

export const IUniswapV3Factory = [
	// Read-Only
	'function owner() view returns (address)',
	'function feeAmountTickSpacing(uint24 fee) view returns (int24)',
	'function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)',
	// State-Changing
	'function setOwner(address _owner) external',
	'function enableFeeAmount(uint24 fee, int24 tickSpacing) external',
	'function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool)',
	// Events
	'event OwnerChanged(address indexed oldOwner, address indexed newOwner)',
	'event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)',
	'event FeeAmountEnabled(uint24 indexed fee, int24 indexed tickSpacing)'
];

export const IERC20 = [
	'function name() view returns (string)',
	'function symbol() view returns (string)',
	'function decimals() view returns (uint8)',
	'function totalSupply() view returns (uint256)',
	'function balanceOf(address owner) view returns (uint256)',
	// State-Changing
	'function transfer(address to, uint256 amount) returns (bool)',
	'function transferFrom(address from, address to, uint256 amount) returns (bool)',
	'function approve(address spender, uint256 amount) returns (bool)',
	'function allowance(address owner, address spender) view returns (uint256)',
	// Events
	'event Approval(address indexed src, address indexed guy, uint256 wad)',
	'event Transfer(address indexed src, address indexed dst, uint256 wad)'
];

export const IWETH = [
	...IERC20,
	// State-Changing
	'function withdraw(uint256 wad)',
	'function deposit() payable',
	'fallback() payable',
	// Events
	'event Deposit(address indexed dst, uint256 wad)',
	'event Withdrawal(address indexed src, uint256 wad)'
];

export const IUniswapV2Pair = [
	...IERC20,
	// Read-Only
	'function DOMAIN_SEPARATOR() external view returns (bytes32)',
	'function PERMIT_TYPEHASH() external pure returns (bytes32)',
	'function nonces(address owner) external view returns (uint)',
	'function factory() external view returns (address)',
	'function token0() external view returns (address)',
	'function token1() external view returns (address)',
	'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
	'function price0CumulativeLast() external view returns (uint)',
	'function price1CumulativeLast() external view returns (uint)',
	'function kLast() external view returns (uint)',
	'function MINIMUM_LIQUIDITY() external pure returns (uint)',

	// State-Changing Functions
	'function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external',
	'function mint(address to) external returns (uint liquidity)',
	'function burn(address to) external returns (uint amount0, uint amount1)',
	'function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external',
	'function skim(address to) external',
	'function sync() external',
	'function initialize(address, address) external',
	// Events
	'event Mint(address indexed sender, uint amount0, uint amount1)',
	'event Burn(address indexed sender, uint amount0, uint amount1, address indexed to)',
	'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)',
	'event Sync(uint112 reserve0, uint112 reserve1)'
];

export const IERC721 = [
	// Read-Only
	'function name() view returns (string)',
	'function symbol() view returns (string)',
	'function tokenURI(uint256 tokenId) view returns (string)',
	'function balanceOf(address owner) view returns (uint256)',
	'function getApproved(uint256 tokenId) view returns (address)',
	'function isApprovedForAll(address owner, address operator) view returns (bool)',
	'function ownerOf(uint256 tokenId) view returns (address)',
	'function supportsInterface(bytes4 interfaceId) view returns (bool)',
	// State-Changing
	'function approve(address to, uint256 tokenId)',
	'function safeTransferFrom(address from, address to, uint256 tokenId)',
	'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
	'function transferFrom(address from, address to, uint256 tokenId)',
	'function setApprovalForAll(address operator, bool approved)',
	// Events
	'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
	'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
	'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
];

export const IToken = [
	...IERC20,
	...IOwnable,
	'function addWhiteList(address addr, bool stat) external', // 添加白名单
	'function open() external', // 开启交易
	'function setFeePercentage(uint256 _newFee) external', // 设置手续费
	'function renounceOwnership()' // 放弃所有权
];

// ===== Deposit Struct =====

export const IPausable = [
	// Read-Only
	'function paused() view returns (bool)',
	// State-Changing
	'function pause()', //暂停
	'function unpause()', //取消暂停
	// Events
	'event Paused(address account)',
	'event Unpaused(address account)'
];

export const IReentrancyGuard = [
	// Read-Only
	'function _reentrancyGuardEntered() view returns (bool)'
];

export const ISafeERC20 = [
	// SafeERC20 functions are internal, but we can include the underlying IERC20
	...IERC20
];
//----------------------------------------------------------------------------------------------------------------------------------
export const IClones = [
	// Read-Only
	'function predictDeterministicAddress(address implementation, bytes32 salt, address deployer) view returns (address predicted)',
	// State-Changing
	'function clone(address implementation) returns (address instance)',
	'function cloneDeterministic(address implementation, bytes32 salt) returns (address instance)'
];

export const IInitializable = [
	// Read-Only
	'function _initialized() view returns (bool)', //是否初始化
	'function _initializing() view returns (bool)', //是否正在初始化
	// State-Changing
	'function initialize()', //初始化
	'function reinitializer(uint8 version)', //重新初始化
	'function onlyInitializing()'
];

export const IEnumerableSet = [
	// Read-Only
	'function length() view returns (uint256)', //长度
	'function at(uint256 index) view returns (address)', //获取索引
	'function contains(address value) view returns (bool)', //是否包含
	// State-Changing
	'function add(address value) returns (bool)', //添加
	'function remove(address value) returns (bool)' //删除
];

// ===== NeuraFiBank Contract =====
export const INeuraFiBank = [
	...IOwnable,
	...IPausable,
	...IReentrancyGuard,

	// Read-Only
	'function accountImplementation() view returns (address)',
	'function teamImplementation() view returns (address)',
	'function accounts(uint256) view returns (address)',
	'function teams(uint256) view returns (address)',
	'function accountOf(address) view returns (address)',
	'function teamOf(address) view returns (address)',
	'function rate(uint16) view returns (uint16)',
	'function replaceRate() view returns (uint16)',
	'function isAccount(address) view returns (bool)',
	'function levelOf(address, address) view returns (uint16)',
	'function levelBonus(address, address) view returns (uint256)',
	'function levelBonusClaimed(address, address) view returns (uint256)',
	'function referralBonus(address, address) view returns (uint256)',
	'function referralBonusClaimed(address, address) view returns (uint256)',
	'function levelType(uint16) view returns (uint256 amount, uint256 teamAmount, uint16 rate)',

	'function userPerformance(address, address) view returns (uint256)', //用户总业绩（某个代币的） 用户地址不是账户地址
	'function teamPerformance(address, address) view returns (uint256)', //团队历史业绩（某个代币的）
	'function blackList(address) view returns (bool)', // 黑名单

	// State-Changing
	'function createAccountByReferrer(address referrer) returns (address account)',
	'function depositFrom(address token, uint256 amount, uint16 cycle)',
	'function deposit(address token, uint256 amount, uint16 cycle)',
	'function renew(address token, uint256 index)',
	'function callAccount(address account, address token, uint256 amount, address to)',
	'function setRate(uint16 _cycle, uint16 _rate)',
	'function setReplaceRate(uint16 _replaceRate)',
	'function withdraw(address token, uint256 amount,address to)',
	'function withdrawInterest(address token, uint256 index)',
	'function withdrawDeposit(address token, uint256 index)',
	'function claimLevelBonus(address token) returns (uint256)',
	'function claimReferralBonus(address token) returns (uint256)',

	//设置黑名单账户
	'function setBlacklist(address _account, bool _isBlacklist) external',
	//设置等级类型
	'function setLevelType(uint8 _level, uint256 _amount, uint256 _teamAmount, uint16 _rate) external',
	//设置手续费
	'function setFee(uint16 _fee) external',

	// View Functions
	'function getAccountsLength() view returns (uint256)',
	'function getTeamsLength() view returns (uint256)',
	'function checkLevel(address user, address token) view returns (uint16)',

	// Events
	'event AccountCreated(address indexed user, address indexed account)', //创建账户
	'event TeamCreated(address indexed user, address indexed team)', //创建团队
	'event Deposited(address indexed from, address indexed token, uint256 amount)', //存入
	'event Withdrawn(address indexed to, address indexed token, uint256 amount)', //提现
	'event WithdrawnInterest(address indexed user, address indexed token, uint256 amount)' //获取利息
];

// ===== NeuraFiAccount Contract =====
export const INeuraFiAccount = [
	...IOwnable,
	...IPausable,
	...IReentrancyGuard,

	// Read-Only
	'function bank() view returns (address)',
	'function name() view returns (string)',
	'function team() view returns (address)',
	'function deposits(address, uint256) view returns (uint256 amount, uint256 startTime, uint256 rate, address lender, uint16 cycle, uint256 interest, uint256 lastInterestTime, uint256 borrowInterest)',
	'function interests(address) view returns (uint256)',
	'function historyDeposits(address) view returns (uint256)',

	// State-Changing
	'function initialize(address _owner, address _bank, address _team) returns (address account)',
	'function depositFrom(address token, uint256 amount, uint16 cycle)',
	'function deposit(address token, uint256 amount, uint16 cycle)',
	'function renew(address token, uint256 index) returns (uint256)',
	'function withdrawDeposit(address token, uint256 index) returns (uint256)',
	'function withdrawInterest(address token, uint256 index) returns (uint256)',
	'function withdraw(address token, uint256 amount)',
	'function sweep(address token, uint256 amount)',
	'function setName(string memory _name)',

	// View Functions
	'function getDepositValue(address token, uint256 index) view returns (uint256)',
	'function getDeposits(address token) view returns (tuple(uint256 amount, uint256 startTime, uint256 rate, address lender, uint16 cycle, uint256 interest, uint256 lastInterestTime, uint256 borrowInterest)[] memory)',
	'function getDepositsLength(address token) view returns (uint256)',
	'function getDepositsInterest(address token, uint256 index) view returns (uint256)',
	'function getActiveFunds(address token) view returns (uint256)',
	'function getDepositsTotal(address token) view returns (uint256)',
	'function tokens() view returns (address[] memory)',

	// Events
	'event Deposited(address indexed from, address indexed token, uint256 amount)',
	'event Withdrawn(address indexed to, address indexed token, uint256 amount)'
];

// ===== Team Contract =====
export const ITeam = [
	...IOwnable,

	// Read-Only
	'function name() view returns (string)',
	'function bank() view returns (address)',
	'function allAddresses(uint256) view returns (address)',
	'function parentOf(address) view returns (address)',

	'function group(address) view returns (uint256)', //伞下人数

	// State-Changing
	'function initialize(address _leader, address _bank) returns (address account)',
	'function bind(address parent)',
	'function setName(string memory _name)',
	'function unbind(address user)',

	// View Functions
	'function getChildren(address parent) view returns (address[] memory)',
	'function getTeamCount() view returns (uint256)',
	//获取等级
	'function getLevel(address token) view returns (uint16)',

	// Events
	'event Bound(address indexed child, address indexed parent)'
];

// export const ITeam = [
// 	...IOwnable,
// 	...IPausable,
// 	...IReentrancyGuard,

// ];

// /// 团队合约 只用来记录 团队人员信息
// contract Team is Ownable {
// 	using SafeERC20 for IERC20;
// 	using EnumerableSet for EnumerableSet.AddressSet; // 去重 + 可遍历
// 	address feeTo; //支付费用去处
// 	address token; //usdt

// 	string public name; //团队名称
// 	address[] public allAddresses; //加入团队的所有地址
// 	// 捐赠可获得等级和相应价格
// 	struct Donate {
// 		uint8 level;
// 		uint256 price;
// 	}
// 	mapping(uint8 => Donate) public donateInfo;
// 	//mapping(address => Donate) public user; //用户的等级和已经支付

// 	mapping(address => address) public parentOf; // child => parent 上下级关系
// 	mapping(address => EnumerableSet.AddressSet) private _children; // parent => children
// 	mapping(address => uint256) public group; // 用户伞下推广总人数

// 	//必须根调用者的上线用户是0 才可以绑定
// 	modifier onlyBinder() {
// 		require(parentOf[msg.sender] == address(0), 'Team: not binder'); //根调用者上线必须是0 才可以绑定
// 		_;
// 	}

// 	constructor() Ownable(msg.sender) {
// 		//写入基础捐赠信息
// 		donateInfo[2] = Donate(2, 200e18); //2级
// 		donateInfo[3] = Donate(3, 100e18); //3级
// 		donateInfo[4] = Donate(4, 5000e18); //4级
// 	}

// 	//捐赠购买
// 	function donate(address parent, uint8 level) external {
// 		require(donateInfo[level].price > 0, 'Team: invalid level'); //等级价格不能为0
// 		bind(parent); //绑定用户关系
// 		IERC20(token).safeTransferFrom(msg.sender, feeTo, donateInfo[level].price); //转移代币给手续费地址
// 	}

// 	/// @notice 绑定一次，不可修改；禁止自荐并做简易防环（最多向上追溯 32 层）
// 	function bind(address parent) private onlyBinder {
// 		require(parent != address(0), 'Team: zero addr'); //要绑定的父地址不能为0

// 		parentOf[msg.sender] = parent;
// 		_children[parent].add(msg.sender); //增加该用户的下线列表

// 		allAddresses.push(msg.sender); //增加记录总用户

// 		//循环增加 父地址的伞下人数 最多33层 ？？？
// 		address p = parent;
// 		for (uint256 i = 0; i < 33; i++) {
// 			if (p == address(this)) break; //如果父地址为当前合约地址 则退出
// 			group[p]++; //增加小组人数
// 			p = parentOf[p]; //获取父地址
// 		}
// 	}

// 	// 获取直接下线列表
// 	function getChildren(address parent) external view returns (address[] memory out) {
// 		uint256 n = _children[parent].length();
// 		out = new address[](n);
// 		for (uint256 i = 0; i < n; ++i) {
// 			out[i] = _children[parent].at(i);
// 		}
// 	}
// 	//获取团队所有人数
// 	function getTeamCount() external view returns (uint256) {
// 		return allAddresses.length;
// 	}

// 	//设置收币地址
// 	function setFeeTO(address _to) external onlyOwner {
// 		feeTo = _to;
// 	}

// 	//设置代币地址
// 	function setToken(address _token) external onlyOwner {
// 		token = _token;
// 	}

// 	function setDonateInfo(uint8 level, uint256 price) external onlyOwner {
// 		donateInfo[level] = Donate(level, price);
// 	}

// 	//解绑拥有者可以解绑 不解决业绩 等逻辑
// 	function unbind(address _user) external onlyOwner {
// 		parentOf[_user] = address(0);
// 		//删除下线
// 		for (uint256 i = 0; i < _children[msg.sender].length(); i++) {
// 			_children[msg.sender].remove(_children[msg.sender].at(i));
// 		}
// 	}

// 	//提取合约内各种代币
// 	function withdraw(address tokenAddr, uint256 amount) external onlyOwner {
// 		uint256 _balance; //初始余额为0
// 		uint256 _withdrawAmount; //获取额度为0
// 		if (tokenAddr == address(0)) {
// 			// 提取ETH的逻辑
// 			_balance = address(this).balance;
// 			_withdrawAmount = amount == 0 ? _balance : amount; // 如果_amount为0，则提取全部余额，否则提取_amount指定的数量
// 			require(_withdrawAmount <= _balance, 'Insufficient ETH balance');
// 			(bool _success, ) = owner().call{value: _withdrawAmount}('');
// 			require(_success, 'ETH transfer failed');
// 		} else {
// 			// 提取ERC20代币的逻辑
// 			IERC20 _token = IERC20(tokenAddr);
// 			_balance = _token.balanceOf(address(this));
// 			_withdrawAmount = amount == 0 ? _balance : amount; // 如果_amount为0，则提取全部余额，否则提取_amount指定的数量
// 			require(_withdrawAmount <= _balance, 'Insufficient token balance');
// 			_token.transfer(owner(), _withdrawAmount);
// 		}
// 	}
// }
