import { BankState, LendingPosition } from '@/lib/mrgnlend';

export interface DomeFiResponse<T> {
  data: T;
  code: string;
  message: string;
}

export interface Account {
  id: string;
  groupId: string;
  pubKey: string;
  accountFlags: number;
  index: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckPaymentResultResponse {
  requestId: string;
  status: string;
  message?: string;
}

export interface GetPaymentInfoResponse {
  requestId: string;
  status: string;
  bankId: string;
  accountId: string;
  action: string;
  amount: string;
  asset: Asset;
  payInfo: PayInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayInfo {
  link: string;
  iconURL: string;
}

export interface Payment {
  requestId: string;
  status: string;
  message: string;
  action: string;
  memo: string;

  assetId: string;
  amount: number;
  asset?: Asset;
}

export interface Asset {
  assetId: string;
  chainId: string;
  symbol: string;
  name: string;
  iconUrl: string;
  chain: Chain;
  price: number;
}

export interface AssetWithPrice extends Asset {
  price: number;
  priceHighest: number;
  priceLowest: number;
}

export interface Chain {
  chainId: string;
  name: string;
  symbol: string;
  iconUrl: string;
}

export interface GetPaymentResult {
  requestId: string;
  status: string;
  message: string;
  action: string;
  assetId: string;
  asset?: Asset;

  paymentLink?: string;
}

export interface PaymentParams {
  uuid?: string;
  mainnetAddress?: string;
  mixAddress?: string;
  members?: string[];
  threshold?: number;

  asset?: string;
  amount?: string;
  memo?: string;
  trace?: string;
  returnTo?: string;
}

export interface Bank {
  id: string;
  groupId: string;
  name: string;
  mixinSafeAssetId: string;
  assetShareValue: string;
  liabilityShareValue: string;
  liquidityVault: string;
  insuranceVault: string;
  feeVault: string;
  collectedInsuranceFeesOutstanding: string;
  collectedGroupFeesOutstanding: string;
  totalLiabilityShares: string;
  totalAssetShares: string;
  flags: number;
  bankConfig: BankConfig;
  emissionsMixinSafeAssetId: null;
  emissionsRate: string;
  emissionsRemaining: string;
  createdAt: number;
  lastUpdate: number;
}

export interface BankWithState extends Bank {
  state: BankState;
}

export interface BankConfig {
  assetWeightInit: number;
  assetWeightMaint: number;
  liabilityWeightInit: number;
  liabilityWeightMaint: number;
  depositLimit: number;
  liabilityLimit: number;
  interestRateConfig: InterestRateConfig;
  operationalState: number;
  riskTier: number;
  totalAssetValueInitLimit: number;
  oracleSetup: number;
  oracleMaxAge: number;
}

export interface InterestRateConfig {
  optimalUtilizationRate: number;
  plateauInterestRate: number;
  maxInterestRate: number;
  insuranceFeeFixedApr: number;
  insuranceIrFee: number;
  protocolFixedFeeApr: number;
  protocolIrFee: number;
}

export interface ListBanksResponseItem {
  bank: Bank;
  asset: Asset;
}

export interface Balance {
  accountId: string;
  bankId: string;
  active: boolean;
  amount: number; // amount of asset
  assetShares: number;
  liabilityShares: number;
  emissionsOutstanding: number | null;
  lastUpdate: number;
}

export interface ListBalanceResponseItem {
  balanceAmount: Balance;
  position?: LendingPosition;
}

export interface BalanceWithLendingPosition extends Balance {
  lendingPosition?: LendingPosition;
}

export interface CalCollateralResponse {
  health: string;
  availableCollateral: string;
}

export interface AccountPositions {
  totalAssets: string;
  totalLiabilities: string;
  interestEarned: string;
  netAsset: string;
  health: string;
}

export interface CreatePaymentRequest {
  bankId: string;
  accountId: string;
  amount: string;
  action: string;
  meta?: Record<'withdraw_all' | 'repay_all', boolean>;
}

export interface UserAssetAmount {
  // 用户的资产 Id 和资产数量
  assetId: string;
  amount: number;
}

export interface PriceData {
  price: string;
  unix: number;
}
