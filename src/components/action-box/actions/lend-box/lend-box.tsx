/* eslint-disable react-hooks/exhaustive-deps */
import { useLendBoxStore, useMrgnlendStore } from '@/app/stores';
import {
  accountSummary as computeAccountSummary,
  createPayment,
} from '@/lib/actions';
import {
  AccountSummary,
  ActionType,
  ActiveBankInfo,
  DEFAULT_ACCOUNT_SUMMARY,
  ExtendedBankInfo,
} from '@/lib/mrgnlend';
import { Account } from '@/types/account';
import React from 'react';
import { useActionBoxStore } from '../../store';
import { useActionAmounts } from '@/hooks';
import { useLendSimulation } from './hooks';
import { ActionInput } from './components/action-input';
import { Collateral } from './components/collateral';
import { ActionButton } from '../../components/action-button';
import { Preview } from './components/preview';
import { SimulatedActionPreview } from './utils/lend-simulation.utils';
import Meteors from '@/components/magicui/meteors';
import { useRouter } from '@/navigation';
import { showToast } from '@/lib/utils';

export type LendBoxProps = {
  connected: boolean;
  selectedAccount: Account | null;
  banks: ExtendedBankInfo[];
  requestedLendType: ActionType;
  requestedBank?: ExtendedBankInfo | null;
  accountSummaryArg?: AccountSummary;
  isDialog?: boolean;

  onConnect?: () => void;
  onComplete?: () => void;
  captureEvent?: (event: string, properties?: Record<string, any>) => void;
};

export const LendBox = ({
  connected,
  banks,
  selectedAccount,
  requestedLendType,
  requestedBank,
  accountSummaryArg,
  isDialog,
  onConnect,
  onComplete,
  captureEvent,
}: LendBoxProps) => {
  const router = useRouter();
  const [assetAmountMap] = useMrgnlendStore((state) => [state.assetAmountMap]);
  const [
    amountRaw,
    lendMode,
    selectedBank,
    simulationResult,
    isLoading,
    errorMessage,
    refreshState,
    fetchActionBoxState,
    setLendMode,
    setAmountRaw,
    setSelectedBank,
    refreshSelectedBanks,
    setSimulationResult,
    setIsLoading,
    setErrorMessage,
  ] = useLendBoxStore(isDialog)((state) => [
    state.amountRaw,
    state.lendMode,
    state.selectedBank,
    state.simulationResult,
    state.isLoading,
    state.errorMessage,
    state.refreshState,
    state.fetchActionBoxState,
    state.setLendMode,
    state.setAmountRaw,
    state.setSelectedBank,
    state.refreshSelectedBanks,
    state.setSimulationResult,
    state.setIsLoading,
    state.setErrorMessage,
  ]);

  const [isAllMode, setIsAllMode] = React.useState(false);

  const accountSummary = React.useMemo(() => {
    return (
      accountSummaryArg ??
      (selectedAccount
        ? computeAccountSummary(selectedAccount.id)
        : DEFAULT_ACCOUNT_SUMMARY)
    );
  }, [accountSummaryArg, selectedAccount, banks]);

  const actionBoxStore = useActionBoxStore();

  const { amount, debouncedAmount, walletAmount, maxAmount } = useActionAmounts(
    {
      amountRaw: amountRaw,
      selectedBank: selectedBank,
      actionMode: lendMode,
      assetAmountMap,
    },
  );

  React.useEffect(() => {
    fetchActionBoxState({
      requestedLendType,
      requestedBank: requestedBank ?? undefined,
    });
  }, [requestedLendType, requestedBank, fetchActionBoxState]);

  React.useEffect(() => {
    if (!connected) {
      refreshState(lendMode);
    }
  }, [refreshState, connected, lendMode]);

  React.useMemo(() => {
    if (requestedBank) {
      setSelectedBank(requestedBank);
    }
  }, [requestedBank]);

  React.useEffect(() => {
    if (requestedBank) {
      setSelectedBank(requestedBank);
    }
  }, []);

  const { actionSummary } = useLendSimulation({
    debouncedAmount: debouncedAmount ?? 0,
    selectedAccount,
    accountSummary: accountSummary as AccountSummary,
    selectedBank,
    lendMode,
    simulationResult,
    setSimulationResult,
    setErrorMessage,
    setIsLoading,
  });

  // Cleanup the store when the wallet disconnects
  React.useEffect(() => {
    refreshState(lendMode);
  }, [connected, lendMode]);

  React.useEffect(() => {
    fetchActionBoxState({
      requestedLendType,
      requestedBank: requestedBank ?? undefined,
    });
  }, [requestedLendType, requestedBank]);

  const bankValidation = React.useMemo(() => {
    if (!selectedBank?.isActive) return null;

    const hasLendingPosition =
      selectedBank.balanceWithLendingPosition?.lendingPosition?.isLending;
    const hasBorrowPosition =
      !selectedBank.balanceWithLendingPosition?.lendingPosition?.isLending &&
      selectedBank.balanceWithLendingPosition?.amount > 0;

    if (lendMode === ActionType.Deposit && hasBorrowPosition) {
      return {
        type: 'error',
        title: 'Cannot Deposit',
        description:
          'You need to repay your borrowed amount before making a deposit.',
        disabled: true,
      };
    }

    if (lendMode === ActionType.Borrow && hasLendingPosition) {
      return {
        type: 'error',
        title: 'Cannot Borrow',
        description:
          'You need to withdraw your deposited amount before borrowing.',
        disabled: true,
      };
    }

    return null;
  }, [selectedBank, lendMode]);

  const isActionDisabled = React.useMemo(() => {
    if (bankValidation?.disabled) return true;
    if (!connected || !selectedBank || !amountRaw) return true;
    if (isLoading) return true;
    if (errorMessage?.isEnabled) return true;

    const amount = Number(amountRaw);
    return amount <= 0;
  }, [
    bankValidation,
    connected,
    selectedBank,
    amountRaw,
    isLoading,
    errorMessage,
  ]);

  const handleLendingAction = React.useCallback(async () => {
    if (!selectedBank || !amount) {
      console.error('selectedBank or amount is null');

      setErrorMessage({
        isEnabled: true,
        actionMethod: 'ERROR',
        description: 'Please select a bank and enter an amount',
      });
      showToast.error('Please select a bank and enter an amount');
      return;
    }

    if (!selectedAccount) {
      console.error('selectedAccount is null');
      showToast.error('Please connect your wallet');
      return;
    }

    if (amount <= 0) {
      return;
    }

    let meta: Record<'withdraw_all' | 'repay_all', boolean> = {
      withdraw_all: false,
      repay_all: false,
    };

    if (isAllMode) {
      if (lendMode === ActionType.Withdraw) {
        meta.withdraw_all = true;
      } else if (lendMode === ActionType.Repay) {
        meta.repay_all = true;
      }
    }

    const requestId = await createPayment({
      bankId: selectedBank.info.id,
      accountId: selectedAccount?.id ?? '',
      amount: amount.toString(),
      action: lendMode,
      meta,
    });

    router.push(`/payment/${requestId}`);
  }, [
    selectedBank,
    amount,
    lendMode,
    isAllMode,
    setAmountRaw,
    selectedAccount,
    captureEvent,
    onComplete,
    setIsLoading,
  ]);

  return (
    <div>
      <div className="mb-6">
        <ActionInput
          banks={banks}
          walletAmount={walletAmount}
          amountRaw={amountRaw}
          maxAmount={maxAmount}
          connected={connected}
          selectedBank={selectedBank ?? (requestedBank as ExtendedBankInfo)}
          lendMode={lendMode}
          isDialog={isDialog}
          isAllMode={isAllMode}
          setAmountRaw={setAmountRaw}
          setSelectedBank={setSelectedBank}
          setIsAllMode={setIsAllMode}
        />
      </div>

      <div className="mb-6">
        <Collateral
          selectedAccount={selectedAccount}
          actionSummary={actionSummary as SimulatedActionPreview}
          accountSummaryArg={accountSummaryArg}
        />
      </div>

      <div className="mb-3">
        <ActionButton
          isLoading={isLoading}
          isEnabled={!isActionDisabled}
          connected={connected}
          handleAction={() => handleLendingAction()}
          handleConnect={() => onConnect && onConnect()}
          buttonLabel={lendMode}
          errorMessage={bankValidation?.description}
        />
      </div>

      <Preview
        accountSummary={accountSummary as AccountSummary}
        actionSummary={actionSummary as SimulatedActionPreview}
        selectedBank={selectedBank as ActiveBankInfo}
        isLoading={isLoading}
        lendMode={lendMode}
      />
    </div>
  );
};
