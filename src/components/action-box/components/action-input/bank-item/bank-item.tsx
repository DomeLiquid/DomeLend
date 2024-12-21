import React from 'react';

import { LendingModes } from '@/types/type';
import { ExtendedBankInfo } from '@/lib/mrgnlend';
import { numeralFormatter, usdFormatter } from '@/lib';
import { cn, decimalStrToNumber } from '@/lib/utils';
import { TokenSymbol } from '@/components/token-item';

type BankItemProps = {
  bank: ExtendedBankInfo;
  showBalanceOverride: boolean;
  rate?: string;
  lendingMode?: LendingModes;
  isRepay?: boolean;
  available?: boolean;
};

export const BankItem = ({
  bank,
  showBalanceOverride,
  rate,
  lendingMode,
  isRepay,
  available = true,
}: BankItemProps) => {
  const balance = React.useMemo(() => {
    switch (lendingMode) {
      case LendingModes.LEND:
        return bank.isActive ? bank.balanceWithLendingPosition.amount : 0;
      case LendingModes.BORROW:
        return bank.isActive ? bank.balanceWithLendingPosition.amount : 0;
      default:
        return 0;
    }
  }, [bank, lendingMode]);

  const openPosition = React.useMemo(() => {
    return isRepay
      ? bank.isActive
        ? bank.balanceWithLendingPosition.amount
        : 0
      : parseFloat(bank.info.bankConfig.depositLimit.toString());
  }, [bank, isRepay]);

  const balancePrice = React.useMemo(
    () =>
      decimalStrToNumber(balance.toString()) * bank.token.price > 0.00001
        ? usdFormatter.format(
            decimalStrToNumber(balance.toString()) * bank.token.price,
          )
        : `$${(decimalStrToNumber(balance.toString()) * bank.token.price).toExponential(2)}`,
    [bank, balance],
  );

  const openPositionPrice = React.useMemo(
    () =>
      decimalStrToNumber(openPosition.toString()) * bank.token.price > 0.00001
        ? usdFormatter.format(
            decimalStrToNumber(openPosition.toString()) * bank.token.price,
          )
        : `$${(decimalStrToNumber(openPosition.toString()) * bank.token.price).toExponential(2)}`,
    [bank, openPosition],
  );

  return (
    <>
      <div className="flex items-center gap-3">
        <TokenSymbol
          asset={bank.token}
          coinIconClassName="w-8 h-8"
          chainIconClassName="w-4 h-4"
        />
        <div>
          <p className="flex items-center text-gray-900 dark:text-gray-200">
            {bank.token.symbol}
            {!available && (
              <span className="ml-1 text-[11px] font-light text-gray-600 dark:text-gray-400">
                (currently unavailable)
              </span>
            )}
          </p>
          {lendingMode && (
            <p
              className={cn(
                'text-xs font-normal',
                (lendingMode === LendingModes.LEND || isRepay) &&
                  'text-[#75BA80]',
                lendingMode === LendingModes.BORROW &&
                  !isRepay &&
                  'text-[#B8B45F]',
              )}
            >
              {rate}
            </p>
          )}
        </div>
      </div>

      {((!isRepay &&
        lendingMode &&
        lendingMode === LendingModes.BORROW &&
        decimalStrToNumber(balance.toString()) > 0) ||
        showBalanceOverride) && (
        <div className="space-y-0.5 text-right text-sm font-normal">
          <p className="text-gray-900 dark:text-gray-200">
            {decimalStrToNumber(balance.toString()) > 0.00000001
              ? numeralFormatter(decimalStrToNumber(balance.toString()))
              : `$${decimalStrToNumber(balance.toString()).toExponential(8)}`}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {balancePrice}
          </p>
        </div>
      )}

      {isRepay && decimalStrToNumber(openPosition.toString()) > 0 && (
        <div className="space-y-0.5 text-right text-sm font-normal">
          <p>
            {decimalStrToNumber(openPosition.toString()) > 0.0000001
              ? numeralFormatter(decimalStrToNumber(openPosition.toString()))
              : `$${decimalStrToNumber(openPosition.toString()).toExponential(2)}`}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {openPositionPrice}
          </p>
        </div>
      )}
    </>
  );
};
