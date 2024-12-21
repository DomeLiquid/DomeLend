import { ActionType, ExtendedBankInfo } from '@/lib/mrgnlend';
import React from 'react';
import { BankSelect } from './components/bank-select';
import { Input } from '@/components/ui/input';
import { formatAmount } from '../../utils/mrgnUtils';
import { LendingAction } from './components/lending-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type ActionInputProps = {
  amountRaw?: string; // Changed to optional
  walletAmount: number | undefined;
  maxAmount: number;
  banks: ExtendedBankInfo[];
  selectedBank: ExtendedBankInfo | null;
  lendMode: ActionType;
  isAllMode?: boolean;
  connected: boolean;
  showCloseBalance?: boolean;
  isDialog?: boolean;
  isMini?: boolean;
  setAmountRaw: (amount: string) => void;
  setSelectedBank: (bank: ExtendedBankInfo | null) => void;
  setIsAllMode?: (isAll: boolean) => void;
};

export const ActionInput = ({
  banks,
  walletAmount,
  maxAmount,
  showCloseBalance,
  connected,
  isDialog,
  isAllMode,
  amountRaw = '0',
  selectedBank,
  lendMode,
  setAmountRaw,
  setSelectedBank,
  setIsAllMode,
}: ActionInputProps) => {
  const amountInputRef = React.useRef<HTMLInputElement>(null);

  const numberFormater = React.useMemo(
    () => new Intl.NumberFormat('en-US', { maximumFractionDigits: 10 }),
    [],
  );

  // 修改禁用逻辑，只在全部模式下禁用输入
  const isInputDisabled = React.useMemo(() => isAllMode, [isAllMode]);

  // 计算最大可用金额
  const effectiveMaxAmount = React.useMemo(() => {
    if (!selectedBank) return 0;

    if (lendMode === ActionType.Deposit) {
      // 存款时使用钱包余额和银行上限的较小值
      const bankCap = Number(selectedBank.info.bankConfig.depositLimit);
      return Math.min(walletAmount || 0, bankCap);
    }

    return maxAmount;
  }, [selectedBank, lendMode, walletAmount, maxAmount]);

  // 检查银行状态
  const bankValidation = React.useMemo(() => {
    if (!selectedBank) return null;

    const hasLendingPosition =
      selectedBank.isActive &&
      selectedBank.balanceWithLendingPosition?.lendingPosition?.isLending;
    const hasBorrowPosition =
      selectedBank.isActive &&
      !selectedBank.balanceWithLendingPosition?.lendingPosition?.isLending &&
      selectedBank.balanceWithLendingPosition?.amount > 0;

    if (lendMode === ActionType.Deposit && hasBorrowPosition) {
      return {
        type: 'error',
        title: 'Cannot Deposit',
        description:
          'You need to repay your borrowed amount before making a deposit.',
      };
    }

    if (lendMode === ActionType.Borrow && hasLendingPosition) {
      return {
        type: 'error',
        title: 'Cannot Borrow',
        description:
          'You need to withdraw your deposited amount before borrowing.',
      };
    }

    return null;
  }, [selectedBank, lendMode]);

  const formatAmountCb = React.useCallback(
    (newAmount: string, bank: ExtendedBankInfo | null) => {
      return formatAmount(newAmount, effectiveMaxAmount, bank, numberFormater);
    },
    [effectiveMaxAmount, numberFormater],
  );

  const handleInputChange = React.useCallback(
    (newAmount: string) => {
      setAmountRaw(formatAmountCb(newAmount, selectedBank));
    },
    [formatAmountCb, setAmountRaw, selectedBank],
  );

  // Handle all mode changes
  React.useEffect(() => {
    if (isAllMode && effectiveMaxAmount > 0) {
      handleInputChange(effectiveMaxAmount.toString());
    }
  }, [isAllMode, effectiveMaxAmount, handleInputChange]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-background p-2.5">
        <div className="flex items-center justify-center gap-1 text-3xl font-medium">
          <div className="w-full max-w-[162px] flex-auto">
            <BankSelect
              selectedBank={selectedBank}
              setSelectedBank={(bank) => {
                setSelectedBank(bank);
              }}
              isSelectable={!isDialog}
              banks={banks}
              lendMode={lendMode}
              connected={connected}
            />
          </div>
          <div className="flex-auto">
            <Input
              type="text"
              ref={amountInputRef}
              inputMode="decimal"
              value={amountRaw}
              disabled={isInputDisabled}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="0"
              className="min-w-[130px] border-none bg-transparent text-right text-base font-medium outline-none focus-visible:outline-none focus-visible:ring-0"
            />
          </div>
        </div>
        {(lendMode === ActionType.Withdraw || lendMode === ActionType.Repay) &&
          setIsAllMode && (
            <div className="mt-2 flex items-center space-x-2">
              <Checkbox
                id="all-mode"
                checked={isAllMode}
                onCheckedChange={(checked) => {
                  setIsAllMode(checked as boolean);
                  if (!checked) {
                    handleInputChange('');
                  }
                }}
                className="peer-disabled:border-muted-border"
              />
              <Label
                htmlFor="all-mode"
                className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {lendMode === ActionType.Withdraw
                  ? 'Withdraw all'
                  : 'Repay all'}
              </Label>
            </div>
          )}
        <LendingAction
          walletAmount={walletAmount}
          maxAmount={effectiveMaxAmount}
          onSetAmountRaw={(amount) => handleInputChange(amount)}
          selectedBank={selectedBank}
          lendMode={lendMode}
        />
      </div>

      {bankValidation && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center pt-1">
            {bankValidation.title}
          </AlertTitle>
          <AlertDescription className="flex items-center pt-1">
            {bankValidation.description}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
