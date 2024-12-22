import Image from 'next/image';

import {
  clampedNumeralFormatter,
  numeralFormatter,
  percentFormatter,
  usdFormatter,
  IconMixin,
} from './';

import { Skeleton } from '@/components/ui/skeleton';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { ActiveBankInfo, ExtendedBankInfo } from './mrgnlend';
import { cn, decimalStrToNumber } from './utils';

export const REDUCE_ONLY_BANKS = ['stSOL', 'RLB'];

export interface PreviewStat {
  label: string;
  color?: 'SUCCESS' | 'ALERT' | 'DESTRUCTIVE';
  value: () => React.JSX.Element;
}

export function getJupFeeStat(platformFee: number): PreviewStat {
  return {
    label: 'Platform fee',
    value: () => <>0.25%</>,
  };
}

export function getAmountStat(
  currentAmount: number,
  symbol: string,
  simulatedAmount?: number,
): PreviewStat {
  return {
    label: 'Your amount',
    value: () => (
      <span className="flex items-center whitespace-nowrap">
        {clampedNumeralFormatter(currentAmount)} {symbol}
        {simulatedAmount !== undefined ? (
          <>
            <ArrowRight width={12} height={12} className="mx-1" />
            {clampedNumeralFormatter(simulatedAmount)} {symbol}
          </>
        ) : (
          <></>
        )}
      </span>
    ),
  };
}

export function getPriceImpactStat(priceImpactPct: number): PreviewStat {
  return {
    label: 'Price impact',
    color:
      priceImpactPct > 0.01 && priceImpactPct > 0.05 ? 'DESTRUCTIVE' : 'ALERT',
    value: () => <>{percentFormatter.format(priceImpactPct)}</>,
  };
}

export function getSlippageStat(slippageBps: number): PreviewStat {
  return {
    label: 'Slippage',
    color: slippageBps > 500 ? 'ALERT' : undefined,
    value: () => <> {percentFormatter.format(slippageBps / 10000)}</>,
  };
}

export function getHealthStat(
  health: number,
  isLoading: boolean,
  simulationHealth?: number,
): PreviewStat {
  let computeHealth = simulationHealth
    ? isNaN(simulationHealth)
      ? health
      : simulationHealth
    : health;
  const healthColor =
    computeHealth >= 0.5
      ? 'SUCCESS'
      : computeHealth >= 0.25
        ? 'ALERT'
        : 'DESTRUCTIVE';

  return {
    label: 'Health',
    color: healthColor,
    value: () => (
      <>
        {health && percentFormatter.format(health)}
        {simulationHealth ? <ArrowRight width={12} height={12} /> : ''}
        {isLoading ? (
          <Skeleton className="h-4 w-[45px] bg-[#373F45]" />
        ) : simulationHealth ? (
          percentFormatter.format(simulationHealth)
        ) : (
          ''
        )}
      </>
    ),
  };
}

export function getLiquidationStat(
  bank: ActiveBankInfo,
  isLoading: boolean,
  simulationLiq: number,
): PreviewStat {
  const price = bank.token.price;

  const computeLiquidation = isNaN(simulationLiq)
    ? bank.balanceWithLendingPosition.lendingPosition?.liquidationPrice
    : simulationLiq ??
      bank.balanceWithLendingPosition.lendingPosition?.liquidationPrice;

  const healthColor = computeLiquidation
    ? computeLiquidation / price >= 0.5
      ? 'SUCCESS'
      : computeLiquidation / price >= 0.25
        ? 'ALERT'
        : 'DESTRUCTIVE'
    : undefined;

  return {
    label: 'Liquidation price',
    color: healthColor,
    value: () => (
      <>
        {bank.balanceWithLendingPosition.lendingPosition?.liquidationPrice &&
          bank.balanceWithLendingPosition.lendingPosition?.liquidationPrice >
            0.01 &&
          usdFormatter.format(
            bank.balanceWithLendingPosition.lendingPosition.liquidationPrice,
          )}
        {bank.balanceWithLendingPosition.lendingPosition?.liquidationPrice &&
          simulationLiq && <ArrowRight width={12} height={12} />}
        {isLoading ? (
          <Skeleton className="h-4 w-[45px] bg-[#373F45]" />
        ) : simulationLiq ? (
          usdFormatter.format(simulationLiq)
        ) : (
          ''
        )}
      </>
    ),
  };
}

export function getPoolSizeStat(
  bankCap: number,
  bank: ExtendedBankInfo,
  isLending: boolean,
): PreviewStat {
  const isReduceOnly = false;

  const isBankHigh =
    (isLending
      ? bank.info.state.totalDeposits
      : bank.info.state.totalBorrows) >=
    bankCap * 0.9;
  const isBankFilled =
    (isLending
      ? bank.info.state.totalDeposits
      : bank.info.state.totalBorrows) >=
    bankCap * 0.99999;

  return {
    label: 'Pool size',
    value: () => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                'flex items-center justify-end gap-1.5 text-white',
                (isReduceOnly || isBankHigh) && 'text-warning',
                isBankFilled && 'text-destructive-foreground',
              )}
            >
              {numeralFormatter(
                isLending
                  ? bank.info.state.totalDeposits
                  : Math.max(
                      0,
                      Math.min(
                        bank.info.state.totalDeposits,
                        decimalStrToNumber(
                          bank.info.bankConfig.liabilityLimit.toString(),
                        ),
                      ) - bank.info.state.totalBorrows,
                    ),
              )}

              {(isReduceOnly || isBankHigh || isBankFilled) && (
                <AlertTriangle size={14} />
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col items-start gap-1">
              <h4 className="flex items-center gap-1.5 text-base">
                {isReduceOnly ? (
                  <>
                    <AlertTriangle size={16} /> Reduce Only
                  </>
                ) : (
                  isBankHigh &&
                  (isBankFilled ? (
                    <>
                      <AlertTriangle size={16} /> Limit Reached
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} /> Approaching Limit
                    </>
                  ))
                )}
              </h4>

              <p>
                {isReduceOnly
                  ? 'stSOL is being discontinued.'
                  : `${bank.token.symbol} ${isLending ? 'deposits' : 'borrows'} are at ${percentFormatter.format(
                      (isLending
                        ? bank.info.state.totalDeposits
                        : bank.info.state.totalBorrows) / bankCap,
                    )} capacity.`}
              </p>
              <a href="https://docs.DomeFi.com">
                <u>Learn more.</u>
              </a>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  };
}

export function getBankTypeStat(bank: ExtendedBankInfo): PreviewStat {
  return {
    label: 'Type',
    value: () => (
      <>
        {bank.info.state.isIsolated ? (
          <>
            Isolated pool{' '}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={12} />
                </TooltipTrigger>
                <TooltipContent>
                  <h4 className="text-base">Isolated pools are risky ⚠️</h4>
                  Assets in isolated pools cannot be used as collateral. When
                  you borrow an isolated asset, you cannot borrow other assets.
                  Isolated pools should be considered particularly risky. As
                  always, remember that DomeFi is a decentralized protocol and
                  all deposited funds are at risk.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <>Global pool</>
        )}
      </>
    ),
  };
}

export function getOracleStat(bank: ExtendedBankInfo): PreviewStat {
  let oracle = '';
  switch (bank?.info.bankConfig.oracleSetup) {
  }

  return {
    label: 'Oracle',
    value: () => (
      <>
        {oracle}
        {oracle === 'Mixin' ? <IconMixin size={14} /> : <IconMixin size={14} />}
      </>
    ),
  };
}
