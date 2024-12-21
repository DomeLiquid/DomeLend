import React from 'react';

import { useActionBoxStore } from '../../store';
import { AccountSummary, ExtendedBankInfo } from '@/lib/mrgnlend';
import { Account } from '@/types/account';

type ActionBoxContextType = {
  banks: ExtendedBankInfo[];
  // nativeSolBalance: number;
  connected: boolean;
  // DomeFiClient: DomeFiClient | null;
  selectedAccount: Account | null;
  // walletContextState?: WalletContextStateOverride | WalletContextState;
  accountSummaryArg?: AccountSummary;
};

const ActionBoxContext = React.createContext<ActionBoxContextType | null>(null);

export const ActionBoxProvider: React.FC<
  ActionBoxContextType & { children: React.ReactNode }
> = ({ children, ...props }) => {
  const [isActionComplete] = useActionBoxStore((state) => [
    state.isActionComplete,
    // state.previousTxn,
    state.setIsActionComplete,
    // state.setPreviousTxn,
  ]);

  return (
    <ActionBoxContext.Provider value={props}>
      {children}
      {/* {isActionComplete && (
        // <ActionComplete isActionComplete={isActionComplete} />
      )} */}
    </ActionBoxContext.Provider>
  );
};

export const useActionBoxContext = () => {
  const context = React.useContext(ActionBoxContext);
  return context;
};
