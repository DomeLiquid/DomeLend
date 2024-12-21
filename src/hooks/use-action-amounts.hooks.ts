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
    return assetAmountMap.get(selectedBank.info.mixinSafeAssetId) ?? 0;
  }, [selectedBank, assetAmountMap]);

  const maxAmount = React.useMemo(() => {
    if (!selectedBank) {
      return 0;
    }

    switch (actionMode) {
      case ActionType.Deposit:
        if (!selectedBank.isActive) return 0;
        return selectedBank.userInfo.maxDeposit ?? 0;
      case ActionType.Withdraw:
        if (!selectedBank.isActive) return 0;
        return selectedBank.userInfo.maxWithdraw ?? 0;
      case ActionType.Borrow:
        if (!selectedBank.isActive) return 0;
        return selectedBank.userInfo.maxBorrow ?? 0;
      case ActionType.Repay:
        if (!selectedBank.isActive) return 0;
        return selectedBank.userInfo.maxRepay ?? 0;
      default:
        return 0;
    }
  }, [selectedBank, actionMode]);

  return {
    amount,
    debouncedAmount,
    walletAmount,
    maxAmount,
  };
}
