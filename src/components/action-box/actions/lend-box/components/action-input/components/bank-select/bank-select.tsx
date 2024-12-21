import React from 'react';

import { BankTrigger, BankList } from './components';

import { ActionType } from '@/lib/mrgnlend';
import { ExtendedBankInfo } from '@/lib/mrgnlend';
import { BankListWrapper } from '@/components/action-box/components/action-input';
import { computeBankRate } from '../../../../utils/mrgnUtils';
import { SelectedBankItem } from '@/components/action-box/components/action-input';
import { LendingModes } from '@/types/type';
type BankSelectProps = {
  selectedBank: ExtendedBankInfo | null;
  banks: ExtendedBankInfo[];
  lendMode: ActionType;
  connected: boolean;
  isSelectable?: boolean;

  setSelectedBank: (selectedBank: ExtendedBankInfo | null) => void;
};

export const BankSelect = ({
  selectedBank,
  banks,
  lendMode,
  connected,
  isSelectable = true,

  setSelectedBank,
}: BankSelectProps) => {
  // idea check list if banks[] == 1 make it unselectable
  const [isOpen, setIsOpen] = React.useState(false);

  const lendingMode = React.useMemo(
    () =>
      lendMode === ActionType.Deposit || lendMode === ActionType.Withdraw
        ? LendingModes.LEND
        : LendingModes.BORROW,
    [lendMode],
  );

  const calculateRate = React.useCallback(
    (bank: ExtendedBankInfo) => {
      return computeBankRate(bank, lendingMode);
    },
    [lendingMode],
  );

  return (
    <>
      {!isSelectable && (
        <div className="flex w-full items-center gap-3">
          {selectedBank && (
            <SelectedBankItem
              bank={selectedBank}
              lendingMode={lendingMode}
              rate={calculateRate(selectedBank)}
            />
          )}
        </div>
      )}

      {isSelectable && (
        <BankListWrapper
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          Trigger={
            <BankTrigger
              selectedBank={selectedBank}
              lendingMode={lendingMode}
              isOpen={isOpen}
            />
          }
          Content={
            <BankList
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              selectedBank={selectedBank}
              onSetSelectedBank={setSelectedBank}
              lendMode={lendMode}
              banks={banks}
              connected={connected}
            />
          }
        />
      )}
    </>
  );
};
