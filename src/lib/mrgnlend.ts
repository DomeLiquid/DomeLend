import {
  Balance,
  BalanceWithLendingPosition,
  Bank,
  BankWithState,
  Chain,
} from '@/types/account';

const DEFAULT_ACCOUNT_SUMMARY: AccountSummary = {
  healthFactor: 1,
  balance: 0,
  lendingAmount: 0,
  borrowingAmount: 0,
  apy: 0,
  outstandingUxpEmissions: 0,
  balanceUnbiased: 0,
  lendingAmountUnbiased: 0,
  borrowingAmountUnbiased: 0,
  lendingAmountWithBiasAndWeighted: 0,
  borrowingAmountWithBiasAndWeighted: 0,
  signedFreeCollateral: 0,
};

function getCurrentAction(
  isLendingMode: boolean,
  bank: ExtendedBankInfo,
): ActionType {
  if (!bank.isActive) {
    return isLendingMode ? ActionType.Deposit : ActionType.Borrow;
  } else {
    if (
      !isLendingMode &&
      bank.balanceWithLendingPosition?.lendingPosition?.isLending === false &&
      bank.balanceWithLendingPosition?.lendingPosition?.amount > 0.00000001
    ) {
      return ActionType.Borrow;
    }

    if (
      !isLendingMode &&
      bank.balanceWithLendingPosition?.lendingPosition?.isLending === true &&
      bank.balanceWithLendingPosition?.lendingPosition?.amount > 0.00000001
    ) {
      return ActionType.Withdraw;
    }

    if (
      bank.balanceWithLendingPosition?.lendingPosition?.isLending ===
      isLendingMode
    ) {
      if (isLendingMode) {
        return ActionType.Deposit;
      } else {
        return ActionType.Withdraw;
      }
    } else {
      if (isLendingMode) {
        return ActionType.Repay;
      } else {
        return ActionType.Borrow;
      }
    }
  }
}
function makeExtendedBankInfo(
  bankWithState: BankWithState,
  tokenWithPriceMetadata: TokenWithPriceMetadata,
  balanceWithLendingPosition?: BalanceWithLendingPosition,
  emissionTokenWithPriceMetadata?: TokenWithPriceMetadata,
  assetAmountMap?: Map<string, number>,
): ExtendedBankInfo {
  const walletBalance =
    assetAmountMap?.get(bankWithState.mixinSafeAssetId) ?? 0;
  const maxDeposit = Math.max(
    0,
    Math.min(walletBalance, bankWithState.state.borrowCap),
  );
  const maxBorrow = Math.min(
    bankWithState.state.borrowCap,
    bankWithState.state.availableLiquidity,
  );

  if (
    !balanceWithLendingPosition ||
    !balanceWithLendingPosition.lendingPosition ||
    balanceWithLendingPosition.lastUpdate === 0
  ) {
    return {
      bankId: bankWithState.id,
      token: tokenWithPriceMetadata,
      info: bankWithState,
      isActive: false,
      userInfo: {
        userAssetAmount: walletBalance
          ? {
              assetId: bankWithState.mixinSafeAssetId,
              amount: walletBalance,
            }
          : undefined,
        maxDeposit,
        maxRepay: 0,
        maxWithdraw: 0,
        maxBorrow,
      } as UserInfo,
    } as InactiveBankInfo;
  }

  const maxWithdraw = Math.min(
    bankWithState.state.availableLiquidity,
    balanceWithLendingPosition.lendingPosition?.isLending
      ? balanceWithLendingPosition.lendingPosition.amount ?? 0
      : 0,
  );

  const maxRepay = Math.min(
    walletBalance,
    balanceWithLendingPosition.lendingPosition?.isLending
      ? 0
      : balanceWithLendingPosition.lendingPosition.amount ?? 0,
  );

  return {
    bankId: bankWithState.id,
    token: tokenWithPriceMetadata,
    info: bankWithState,
    isActive: true,
    balanceWithLendingPosition,
    emissionTokenWithPriceMetadata,
    userInfo: {
      userAssetAmount: walletBalance
        ? {
            assetId: bankWithState.mixinSafeAssetId,
            amount: walletBalance,
          }
        : undefined,
      maxDeposit,
      maxRepay,
      maxWithdraw,
      maxBorrow,
    },
  };
}

export { DEFAULT_ACCOUNT_SUMMARY };

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

interface BankMetadataMap {
  [key: string]: BankMetadata;
}

interface BankMetadata {
  id: string;
  mixinAssetId: string;
}

interface TokenWithPriceMetadata {
  price: number;
  priceHighest: number;
  priceLowest: number;

  assetId: string;
  chainId: string;
  symbol: string;
  name: string;
  iconUrl: string;
  chain: Chain;
}

interface TokenWithPriceMetadataMap {
  [key: string]: TokenWithPriceMetadata;
}

interface BalanceWithLendingPositionMap {
  [key: string]: BalanceWithLendingPosition; // key is bankId
}

interface AccountSummary {
  healthFactor: number;
  balance: number;
  lendingAmount: number;
  borrowingAmount: number;
  apy: number;
  outstandingUxpEmissions: number;
  balanceUnbiased: number;
  lendingAmountUnbiased: number;
  borrowingAmountUnbiased: number;
  lendingAmountWithBiasAndWeighted: number;
  borrowingAmountWithBiasAndWeighted: number;
  signedFreeCollateral: number;
}

// interface TokenPriceMap {
//   [key: string]: TokenPrice;
// }

// interface TokenPrice {
//   price: number;
// }

// interface ExtendedBankMetadata {
//   bankId: string;
//   tokenWithPriceMetadata: TokenWithPriceMetadata;
// }

interface BankState {
  lendingRate: number;
  borrowingRate: number;
  emissionsRate: number;
  emissions: Emissions;
  totalDeposits: number;
  depositCap: number;
  totalBorrows: number;
  borrowCap: number;
  availableLiquidity: number;
  utilizationRate: number;
  isIsolated: boolean;
}

interface LendingPosition {
  isLending: boolean;
  amount: number;
  usdValue: number;
  // weightedUSDValue: number;
  liquidationPrice: number | null;
  isDust: false;
}

export interface UserAssetAmount {
  // 用户的资产 Id 和资产数量
  assetId: string;
  amount: number;
}

interface UserInfo {
  userAssetAmount?: UserAssetAmount;
  maxDeposit: number;
  maxRepay: number;
  maxWithdraw: number;
  maxBorrow: number;
}

interface InactiveBankInfo {
  bankId: string;
  // meta: ExtendedBankMetadata;
  token: TokenWithPriceMetadata;
  info: BankWithState;
  isActive: false;
  // userInfo: UserInfo;
}

interface ActiveBankInfo {
  bankId: string;
  // meta: ExtendedBankMetadata;
  token: TokenWithPriceMetadata;
  info: BankWithState;
  userInfo: UserInfo;
  isActive: true;
  balanceWithLendingPosition: BalanceWithLendingPosition;
  emissionTokenWithPriceMetadata?: TokenWithPriceMetadata;
  // userInfo: UserInfo;
  // position: LendingPosition;
}

type ExtendedBankInfo = ActiveBankInfo | InactiveBankInfo;

enum Emissions {
  Inactive,
  Lending,
  Borrowing,
}

enum ActionType {
  Deposit = 'Supply',
  Borrow = 'Borrow',
  Repay = 'Repay',
  Withdraw = 'Withdraw',
}

enum RepayType {
  RepayRaw = 'Repay',
  //   RepayCollat = 'Collateral Repay',
}

type ActionMethodType = 'WARNING' | 'ERROR' | 'INFO';
interface ActionMethod {
  isEnabled: boolean;
  actionMethod?: ActionMethodType;
  description?: string;
  link?: string;
  linkText?: string;
  action?: {
    bank: ExtendedBankInfo;
    type: ActionType;
  };
}

export {
  Emissions,
  ActionType,
  RepayType,
  makeExtendedBankInfo,
  getCurrentAction,
  // makeExtendedBankMetadata,
};
export type {
  BalanceWithLendingPositionMap,
  AccountSummary,
  LendingPosition,
  // ExtendedBankMetadata,
  ActiveBankInfo,
  InactiveBankInfo,
  ExtendedBankInfo,
  BankState,
  ActionMethod,
  ActionMethodType,
  BankMetadataMap,
  BankMetadata,
  TokenWithPriceMetadataMap,
  TokenWithPriceMetadata,
};
