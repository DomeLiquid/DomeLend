import React from 'react';

import Image from 'next/image';
import {
  aprToApy,
  clampedNumeralFormatter,
  numeralFormatter,
  percentFormatter,
  usdFormatter,
  usdFormatterDyn,
} from '@/lib';
import { TriangleAlert, ExternalLink, InfoIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IconMixin } from '@/lib';

import {
  AssetData,
  AssetPriceData,
  AssetWeightData,
  BankCapData,
  DepositsData,
  PositionData,
  RateData,
  UtilizationData,
} from '../utils';
import { Link } from '@/navigation';
import { TokenSymbol } from '@/components/token-item';
import { Asset } from '@/types/account';

export const EMISSION_MINT_INFO_MAP = new Map<
  string,
  { tokenSymbol: string; tokenLogoUri: string }
>([
  [
    'UXD',
    {
      tokenSymbol: 'UXP',
      tokenLogoUri: '/uxp-icon-white.png',
    },
  ],
  [
    'bSOL',
    {
      tokenSymbol: 'BLZE',
      tokenLogoUri: '/blze.png',
    },
  ],
  [
    'PYUSD',
    {
      tokenSymbol: 'PYUSD',
      tokenLogoUri: '/pyusd.png',
    },
  ],
]);

export const getAssetCell = (asset: AssetData) => (
  <div className="flex items-center justify-start gap-2">
    <TokenSymbol asset={asset as Asset} />
    <div>{asset.symbol}</div>
  </div>
);

export const getAssetPriceCell = ({
  oracle,
  assetPrice,
  assetPriceOffset,
  symbol,
  price,
  isOracleStale,
  isInLendingMode = true,
}: AssetPriceData) => (
  <div className="relative flex items-center justify-end gap-1.5 pl-4">
    <div className="relative">
      {assetPrice >= 0.01
        ? usdFormatterDyn.format(assetPrice)
        : `$${assetPrice}`}
      {assetPriceOffset > assetPrice * 0.1 && (
        <div className="absolute right-2 top-[-8px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute text-xs">⚠️</div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-2">
                  <h4 className="text-base">Wide oracle price bands</h4>
                  {`${symbol} price estimates is
              ${usdFormatter.format(price)} ± ${assetPriceOffset.toFixed(
                2,
              )}, which is wide. Proceed with caution. DomeFi prices assets at the bottom of confidence bands and liabilities at the top.`}
                  <br />
                  <a href="https://docs.DomeFi.com">
                    <u>Learn more.</u>
                  </a>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>

    {/* {oracle && ( */}
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            {oracle === 'Mixin' ? (
              <IconMixin size={14} />
            ) : (
              <IconMixin size={14} />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>Powered by Mixin</TooltipContent>
      </Tooltip>
    </TooltipProvider>
    {/* )} */}
    {isOracleStale && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <TriangleAlert size={14} className="shrink-0 text-warning" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[17rem] space-y-3">
            <p>
              {isInLendingMode ? 'Withdrawals from' : 'Borrows from'} this bank
              may fail due to network congestion preventing oracles from
              updating price data.
            </p>
            <p>
              <Link
                href="https://docs.DomeFi.com/faqs#what-does-the-stale-oracles-error-mean"
                target="_blank"
                rel="noreferrer"
                className="border-b border-primary/50 leading-normal transition-colors hover:border-transparent"
              >
                <ExternalLink
                  size={12}
                  className="mr-1 inline -translate-y-[1px]"
                />
                Learn more about DomeFi&apos;s decentralized oracle strategy.
              </Link>
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
);

export const getRateCell = ({
  rateAPY,
  symbol,
  emissionRate,
  lendingRate,
  isInLendingMode,
}: RateData) => {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2',
        isInLendingMode ? 'text-success' : 'text-warning',
      )}
    >
      {emissionRate > 0 &&
        EMISSION_MINT_INFO_MAP.get(symbol) !== undefined &&
        isInLendingMode && (
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image
                    src={EMISSION_MINT_INFO_MAP.get(symbol)!.tokenLogoUri}
                    alt="info"
                    height={18}
                    width={18}
                    className="rounded-full"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col items-start gap-1.5">
                    <h4 className="flex items-center gap-1.5 text-base">
                      <Image
                        src={EMISSION_MINT_INFO_MAP.get(symbol)!.tokenLogoUri}
                        alt="info"
                        height={18}
                        width={18}
                        className="rounded-full"
                      />{' '}
                      Liquidity rewards
                    </h4>
                    <p className="text-xs">
                      {`${percentFormatter.format(aprToApy(lendingRate))} Supply APY + ${percentFormatter.format(
                        aprToApy(emissionRate),
                      )} ${EMISSION_MINT_INFO_MAP.get(symbol)!.tokenSymbol} rewards. `}
                    </p>
                    <p className="text-xs">
                      <Link
                        target="_blank"
                        rel="noreferrer"
                        href="https://docs.DomeFi.com"
                        className="inline-block border-b text-xs transition-colors hover:border-transparent"
                      >
                        Learn more.
                      </Link>
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      {/* {symbol === 'mSOL' && (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src={`${IMAGE_CDN_URL}/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey.png`}
                  alt="info"
                  height={18}
                  width={18}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col items-start gap-1.5">
                  <h4 className="flex items-center gap-1.5 text-base">
                    <Image
                      src={`${IMAGE_CDN_URL}/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey.png`}
                      alt="info"
                      height={18}
                      width={18}
                    />
                    MNDE rewards
                  </h4>
                  <p className="text-xs">Eligible for Marinade Earn rewards.</p>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="https://marinade.finance/app/earn/"
                    className="inline-block border-b text-xs transition-colors hover:border-transparent"
                  >
                    Learn more
                  </Link>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )} */}

      <div className="flex justify-end">{percentFormatter.format(rateAPY)}</div>
    </div>
  );
};

export const getAssetWeightCell = ({ assetWeight }: AssetWeightData) => (
  <div className="flex justify-end">
    {!assetWeight ? <>-</> : <>{(assetWeight * 100).toFixed(0) + '%'}</>}
  </div>
);

export const getDepositsCell = (depositsData: DepositsData) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'flex items-center justify-end gap-1.5',
              (depositsData.isReduceOnly || depositsData.isBankHigh) &&
                'text-warning',
              depositsData.isBankFilled && 'text-destructive-foreground',
            )}
          >
            {depositsData.denominationUSD
              ? usdFormatter.format(depositsData.bankDeposits)
              : clampedNumeralFormatter(depositsData.bankDeposits)}

            {(depositsData.isReduceOnly ||
              depositsData.isBankHigh ||
              depositsData.isBankFilled) && <TriangleAlert size={14} />}
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-left">
          <div>
            {depositsData.isReduceOnly
              ? 'Reduce Only'
              : depositsData.isBankHigh &&
                (depositsData.isBankFilled
                  ? 'Limit Reached'
                  : 'Approaching Limit')}
          </div>

          {depositsData.isReduceOnly ? (
            <span>{depositsData.symbol} is being discontinued.</span>
          ) : (
            <>
              <span>
                {depositsData.symbol}{' '}
                {depositsData.isInLendingMode ? 'deposits' : 'borrows'} are at{' '}
                {percentFormatter.format(depositsData.capacity)} capacity.
              </span>
              {!depositsData.isBankFilled && (
                <>
                  <br />
                  <br />
                  <span>
                    Available: {clampedNumeralFormatter(depositsData.available)}
                  </span>
                </>
              )}
            </>
          )}
          <br />
          <br />
          <a href="https://docs.DomeFi.com">
            <u>Learn more.</u>
          </a>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const getBankCapCell = ({ bankCap, denominationUSD }: BankCapData) => (
  <div className="flex justify-end">
    {denominationUSD
      ? usdFormatter.format(bankCap)
      : clampedNumeralFormatter(bankCap)}
  </div>
);

export const getUtilizationCell = ({ utilization }: UtilizationData) => (
  <div className="flex justify-end">{percentFormatter.format(utilization)}</div>
);

export const getPositionCell = (positionData: PositionData) => {
  const selectedPositionAmount = positionData.denominationUSD
    ? positionData.positionUsd
    : positionData.positionAmount;

  return (
    <div className="flex w-full items-center gap-5 rounded-md bg-background-gray px-2 py-3">
      <dl className="flex items-center gap-2">
        <dt className="text-xs font-light text-accent-foreground">Wallet:</dt>
        <dd>
          {/* {positionData.denominationUSD
            ? usdFormatter.format(
                positionData.walletAmount * positionData.price,
              )
            : `${numeralFormatter(positionData.walletAmount)} ${positionData.symbol}`} */}
          {'-'}
          {/* {'$0'} */}
        </dd>
      </dl>
      {positionData.positionAmount && (
        <dl className="flex items-center gap-2">
          <dt className="text-xs font-light text-accent-foreground">
            {positionData.isInLendingMode ? 'Lending:' : 'Borrowing:'}
          </dt>
          <dd className="flex items-center gap-1">
            {clampedNumeralFormatter(positionData.positionAmount) +
              ' ' +
              positionData.symbol}
          </dd>
        </dl>
      )}
      {positionData.liquidationPrice && (
        <dl className="flex items-center gap-2">
          <dt
            className={cn(
              'flex gap-1 text-xs font-light text-accent-foreground',
              positionData.isUserPositionPoorHealth &&
                'text-destructive-foreground',
            )}
          >
            {positionData.isUserPositionPoorHealth && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TriangleAlert size={16} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your account is at risk of liquidation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            Liquidation price:
          </dt>
          <dd
            className={cn(
              positionData.isUserPositionPoorHealth &&
                'text-destructive-foreground',
            )}
          >
            {usdFormatterDyn.format(positionData.liquidationPrice)}
          </dd>
        </dl>
      )}
    </div>
  );
};
