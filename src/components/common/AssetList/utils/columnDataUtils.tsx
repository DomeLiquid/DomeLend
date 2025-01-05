import { ActionBox } from '@/components/action-box/action-box';
import { Button } from '@/components/ui/button';
import { TooltipContent } from '@/components/ui/tooltip';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipProvider } from '@/components/ui/tooltip';
import { aprToApy } from '@/lib';
import { accountSummary } from '@/lib/actions';
import {
  AccountSummary,
  ActionType,
  Emissions,
  ExtendedBankInfo,
  getCurrentAction,
} from '@/lib/mrgnlend';
import { Asset, Chain, Account } from '@/types/account';

export interface AssetData {
  chainId: string;
  symbol: string;
  name: string;
  iconUrl: string;
  chain: Chain;
}

export interface RateData {
  emissionRate: number;
  lendingRate: number;
  rateAPY: number;
  symbol: string;
  isInLendingMode: boolean;
}

export interface AssetPriceData {
  assetPrice: number;
  assetPriceOffset: number;
  price: number;
  symbol: string;
  oracle: string;
  isOracleStale: boolean;
  isInLendingMode?: boolean;
}

export interface AssetWeightData {
  assetWeight: number;
}

export interface DepositsData {
  isReduceOnly: boolean;
  isBankHigh: boolean;
  isBankFilled: boolean;
  bankCap: number;
  bankDeposits: number;
  capacity: number;
  available: number;
  symbol: string;
  denominationUSD: boolean;
  isInLendingMode: boolean;
}

export interface BankCapData {
  bankCap: number;
  denominationUSD: boolean;
  bank: ExtendedBankInfo;
}

export interface UtilizationData {
  utilization: number;
}

export interface PositionData {
  denominationUSD: boolean;
  price: number;
  walletAmount: number;
  symbol: string;
  positionAmount?: number;
  positionUsd?: number;
  liquidationPrice?: number;
  isInLendingMode: boolean;
  isUserPositionPoorHealth: boolean;
}

export const getAssetData = (bankInfo: ExtendedBankInfo): AssetData => ({
  symbol: bankInfo.token.symbol,
  name: bankInfo.token.name,
  iconUrl: bankInfo.token.iconUrl,
  chainId: bankInfo.token.chainId,
  chain: bankInfo.token.chain,
});

export const getRateData = (
  bankInfo: ExtendedBankInfo,
  isInLendingMode: boolean,
): RateData => {
  const { lendingRate, borrowingRate, emissions, emissionsRate } =
    bankInfo.info.state;

  const interestRate = isInLendingMode ? lendingRate : borrowingRate;
  const emissionRate = isInLendingMode
    ? emissions == Emissions.Lending
      ? emissionsRate
      : 0
    : emissions == Emissions.Borrowing
      ? emissionsRate
      : 0;

  const rateAPR = interestRate + emissionRate;

  const rateAPY = aprToApy(rateAPR);

  return {
    emissionRate,
    lendingRate,
    rateAPY,
    symbol: bankInfo.token.symbol,
    isInLendingMode,
  };
};

export const getAssetPriceData = (
  bankInfo: ExtendedBankInfo,
): AssetPriceData => {
  const assetPrice = bankInfo.token.price;

  let oracle = '' as '' | 'Mixin';
  switch (bankInfo.info.bankConfig.oracleSetup) {
    case 1:
      oracle = 'Mixin';
      break;
  }

  const assetPriceOffset = Math.max(
    bankInfo.token.priceHighest - bankInfo.token.price,
    bankInfo.token.price - bankInfo.token.priceLowest,
  );

  const isOracleStale = false;

  return {
    assetPrice,
    assetPriceOffset,
    price: bankInfo.token.price,
    symbol: bankInfo.token.symbol,
    oracle,
    isOracleStale,
  };
};

export const getAssetWeightData = (
  bank: ExtendedBankInfo,
  isInLendingMode: boolean,
): AssetWeightData => {
  const assetWeight = isInLendingMode
    ? bank.info.bankConfig.assetWeightInit
    : 1 / bank.info.bankConfig.liabilityWeightInit;

  return {
    assetWeight,
  };
};

export const getDepositsData = (
  bank: ExtendedBankInfo,
  isInLendingMode: boolean,
  denominationUSD: boolean,
): DepositsData => {
  const bankCap = isInLendingMode
    ? bank.info.state.depositCap
    : bank.info.state.borrowCap;

  const isBankFilled =
    (isInLendingMode
      ? bank.info.state.totalDeposits
      : bank.info.state.totalBorrows) >=
    bankCap * 0.99999;

  const isBankHigh =
    (isInLendingMode
      ? bank.info.state.totalDeposits
      : bank.info.state.totalBorrows) >=
    bankCap * 0.9;

  const isReduceOnly = false;

  const bankDeposits =
    (isInLendingMode
      ? bank.info.state.totalDeposits
      : Math.min(
          bank.info.state.availableLiquidity,
          bank.info.state.borrowCap - bank.info.state.totalBorrows,
        )) * (denominationUSD ? bank.token.price : 1);

  const capacity =
    (isInLendingMode
      ? bank.info.state.totalDeposits
      : bank.info.state.totalBorrows) / bankCap;

  const available =
    bankCap -
    (isInLendingMode
      ? bank.info.state.totalDeposits
      : bank.info.state.totalBorrows);

  return {
    isReduceOnly,
    isBankHigh,
    isBankFilled,
    bankCap,
    bankDeposits,
    capacity,
    available,
    symbol: bank.token.symbol,
    denominationUSD,
    isInLendingMode,
  };
};

export const getBankCapData = (
  bank: ExtendedBankInfo,
  isInLendingMode: boolean,
  denominationUSD: boolean,
): BankCapData => {
  const bankCapUi = isInLendingMode
    ? bank.info.state.depositCap
    : bank.info.state.borrowCap;

  const bankCap =
    (isInLendingMode ? bankCapUi : bank.info.state.totalBorrows) *
    (denominationUSD ? bank.token.price : 1);

  return {
    bankCap,
    denominationUSD,
    bank,
  };
};

export const getUtilizationData = (
  bank: ExtendedBankInfo,
): UtilizationData => ({
  utilization: bank.info.state.utilizationRate,
});

export const getPositionData = (
  bank: ExtendedBankInfo,
  denominationUSD: boolean,
  // nativeSolBalance: number,
  isInLendingMode: boolean,
): PositionData => {
  let positionAmount,
    liquidationPrice,
    positionUsd,
    isUserPositionPoorHealth = false;

  const walletAmount =
    0 || (bank.isActive ? bank.userInfo.userAssetAmount?.amount : 0);

  if (
    bank.isActive &&
    bank.balanceWithLendingPosition.lendingPosition &&
    bank.balanceWithLendingPosition.lendingPosition.isLending ===
      isInLendingMode
  ) {
    positionAmount = bank.balanceWithLendingPosition.lendingPosition.amount;
    positionUsd = bank.balanceWithLendingPosition.lendingPosition.usdValue;
    liquidationPrice =
      bank.balanceWithLendingPosition.lendingPosition.liquidationPrice;

    if (bank.balanceWithLendingPosition.lendingPosition.liquidationPrice) {
      const alertRange = 0.05;
      if (bank.balanceWithLendingPosition.lendingPosition.isLending) {
        isUserPositionPoorHealth =
          bank.token.price <
          bank.balanceWithLendingPosition.lendingPosition.liquidationPrice +
            bank.balanceWithLendingPosition.lendingPosition.liquidationPrice *
              alertRange;
      } else {
        isUserPositionPoorHealth =
          bank.token.price >
          bank.balanceWithLendingPosition.lendingPosition.liquidationPrice -
            bank.balanceWithLendingPosition.lendingPosition.liquidationPrice *
              alertRange;
      }
      if (
        bank.balanceWithLendingPosition.lendingPosition.liquidationPrice <= 0
      ) {
        isUserPositionPoorHealth = false;
      }
    }
  }

  return {
    denominationUSD,
    price: bank.token.price,
    walletAmount,
    positionAmount,
    positionUsd,
    liquidationPrice,
    isUserPositionPoorHealth,
    isInLendingMode,
    symbol: bank.token.symbol,
  } as PositionData;
};

const ActionBoxCell = ({
  selectedAccount,
  accountSummary,
  bank,
  isInLendingMode,
  connected,
  fetchMrgnlendState,
}: {
  selectedAccount: Account;
  accountSummary: AccountSummary;
  bank: ExtendedBankInfo;
  isInLendingMode: boolean;
  connected: boolean;
  fetchMrgnlendState: () => void;
}) => {
  const currentAction = getCurrentAction(isInLendingMode, bank);

  if (currentAction === ActionType.Repay) {
    return (
      <>
        <ActionBox.Repay
          isDialog={true}
          useProvider={true}
          repayProps={{
            requestedBank: bank,
            selectedAccount: selectedAccount,
            accountSummaryArg: accountSummary,
            connected: connected,
            onComplete: () => {
              fetchMrgnlendState();
            },
          }}
          dialogProps={{
            title: `${currentAction} ${bank.token.symbol}`,
            trigger: (
              <Button
                variant="secondary"
                className="w-full max-w-[140px] hover:bg-primary hover:text-primary-foreground"
              >
                {currentAction}
              </Button>
            ),
          }}
        />
      </>
    );
  } else {
    return (
      <>
        <ActionBox.Lend
          isDialog={true}
          useProvider={true}
          lendProps={{
            requestedBank: bank,
            requestedLendType: currentAction,
            selectedAccount: selectedAccount,
            accountSummaryArg: accountSummary,
            connected: connected,
            // walletContextState,
            onComplete: () => {
              fetchMrgnlendState();
            },
          }}
          dialogProps={{
            title: `${currentAction} ${bank.token.symbol}`,
            trigger: (
              <Button
                variant="secondary"
                className="w-full max-w-[140px] hover:bg-primary hover:text-primary-foreground"
              >
                {currentAction}
              </Button>
            ),
          }}
        />
      </>
    );
  }
};

export const getAction = (
  selectedAccount: Account,
  accountSummary: AccountSummary,
  bank: ExtendedBankInfo,
  isInLendingMode: boolean,
  Account: Account | null,
  connected: boolean,
  fetchMrgnlendState: () => void,
) => {
  const currentAction = getCurrentAction(isInLendingMode, bank);
  const isDust =
    bank.isActive && bank.balanceWithLendingPosition?.lendingPosition?.isDust;

  return (
    <>
      {Account === null && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center gap-4 px-0 sm:pl-4 lg:justify-end">
                <ActionBoxCell
                  selectedAccount={selectedAccount}
                  accountSummary={accountSummary}
                  bank={bank}
                  isInLendingMode={isInLendingMode}
                  connected={connected}
                  fetchMrgnlendState={fetchMrgnlendState}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              User account will be automatically created on first deposit
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {Account !== null && (
        <div className="flex items-center justify-center gap-4 px-0 sm:pl-4 lg:justify-end">
          <ActionBoxCell
            selectedAccount={selectedAccount}
            accountSummary={accountSummary}
            bank={bank}
            isInLendingMode={isInLendingMode}
            connected={connected}
            // walletContextState={walletContextState}
            fetchMrgnlendState={fetchMrgnlendState}
          />
        </div>
      )}
    </>
  );
};
