import { create, StateCreator } from 'zustand';

import {
  ActionMethod,
  ActionType,
  ExtendedBankInfo,
  RepayType,
} from '@/lib/mrgnlend';
import { persist } from 'zustand/middleware';

export interface ActionBoxState {
  // State
  amountRaw: string;
  repayAmountRaw: string;
  maxAmountCollat: number;

  leverage: number;
  maxLeverage: number;

  actionMode: ActionType;
  repayMode: RepayType;

  selectedBank: ExtendedBankInfo | null;
  selectedRepayBank: ExtendedBankInfo | null;

  errorMessage: ActionMethod | null;
  isLoading: boolean;

  setActionMode: (actionMode: ActionType) => void;

  // Actions
  //   refreshState: (actionMode?: ActionType) => void;
  //   refreshSelectedBanks: (banks: ExtendedBankInfo[]) => void;
  //   fetchActionBoxState: (args: {
  //     requestedAction?: ActionType;
  //     requestedBank?: ExtendedBankInfo;
  //   }) => void;
  //   setSlippageBps: (slippageBps: number) => void;
  //   setActionMode: (actionMode: ActionType) => void;
  //   setRepayMode: (repayMode: RepayType) => void;
  //   setAmountRaw: (amountRaw: string, maxAmount?: number) => void;
  //   setSelectedBank: (bank: ExtendedBankInfo | null) => void;
  //   setRepayBank: (bank: ExtendedBankInfo | null) => void;
  //   setIsLoading: (isLoading: boolean) => void;
}

function createActionBoxStore() {
  return create<ActionBoxState>()(
    persist(stateCreator, {
      name: 'uiStore',
      onRehydrateStorage: () => (state) => {},
    }),
  );
}

const initialState = {
  amountRaw: '',
  repayAmountRaw: '',
  maxAmountCollat: 0,
  errorMessage: null,

  leverage: 0,
  maxLeverage: 0,

  actionMode: ActionType.Deposit,
  repayMode: RepayType.RepayRaw,

  selectedBank: null,
  selectedRepayBank: null,
  selectedStakingAccount: null,

  actionQuote: null,
  actionTxns: { actionTxn: null, feedCrankTxs: [] },

  isLoading: false,
};

const stateCreator: StateCreator<ActionBoxState, [], []> = (set, get) => ({
  // State
  ...initialState,

  setActionMode(actionMode) {
    const selectedActionMode = get().actionMode;
    const hasActionModeChanged =
      !selectedActionMode || actionMode !== selectedActionMode;

    if (hasActionModeChanged)
      set({ amountRaw: '', repayAmountRaw: '', errorMessage: null });

    if (actionMode !== ActionType.Repay) {
      set({ repayMode: RepayType.RepayRaw });
    }

    set({ actionMode });
  },
});

export { createActionBoxStore };
