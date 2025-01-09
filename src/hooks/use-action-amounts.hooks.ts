import { ActionType, ExtendedBankInfo } from '@/lib/mrgnlend';
import React from 'react';
import { useAmountDebounce } from './useAmountDebounce';

export function useActionAmounts({
  amountRaw,
  selectedBank,
  actionMode,
  maxAmountCollateral,
  assetAmountMap,
}: {
  amountRaw: string;
  actionMode: ActionType;
  selectedBank: ExtendedBankInfo | null;
  maxAmountCollateral?: number;
  assetAmountMap?: Map<string, number>;
}) {
  const amount = React.useMemo(() => {
    const strippedAmount = amountRaw.replace(/,/g, '');
    return isNaN(Number.parseFloat(strippedAmount))
      ? 0
      : Number.parseFloat(strippedAmount);
  }, [amountRaw]);

  const debouncedAmount = useAmountDebounce<number | null>(amount, 500);

  const walletAmount = React.useMemo(() => {
    if (!selectedBank || !assetAmountMap) {
      return 0;
    }
    const amount = assetAmountMap.get(selectedBank.info.mixinSafeAssetId) ?? 0;
    // console.log('计算 walletAmount:', {
    //   symbol: selectedBank.token.symbol,
    //   amount
    // });
    return amount;
  }, [selectedBank, assetAmountMap]);

  // 向上取整到指定小数位数
  const roundUpToDecimals = (num: number, decimals: number): number => {
    const multiplier = Math.pow(10, decimals);
    return Math.ceil(num * multiplier) / multiplier;
  };

  const maxAmount = React.useMemo(() => {
    if (!selectedBank) {
      return 0;
    }

    if (!selectedBank.isActive) {
      return 0;
    }

    let result = 0;
    switch (actionMode) {
      case ActionType.Deposit:
        result = selectedBank.userInfo.maxDeposit ?? 0;
        break;
      case ActionType.Withdraw:
        result = selectedBank.userInfo.maxWithdraw ?? 0;
        break;
      case ActionType.Borrow:
        result = selectedBank.userInfo.maxBorrow ?? 0;
        break;
      case ActionType.Repay:
        // 对于还款额度，向上取整到5位小数
        const rawMaxRepay = selectedBank.userInfo.maxRepay ?? 0;
        result = roundUpToDecimals(rawMaxRepay, 5);
        break;
    }

    // console.log('计算 maxAmount:', {
    //   symbol: selectedBank.token.symbol,
    //   mode: actionMode,
    //   result,
    // });
    return result;
  }, [selectedBank, actionMode]);

  return {
    amount,
    debouncedAmount,
    walletAmount,
    maxAmount,
  };
}
