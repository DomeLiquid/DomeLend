import { ActionMethod } from '@/lib/mrgnlend';
import { ActionType, ExtendedBankInfo } from '@/lib/mrgnlend';
import { create, StateCreator } from 'zustand';

interface LendBoxState {
  // State
  amountRaw: string;

  lendMode: ActionType;
  selectedBank: ExtendedBankInfo | null;

  simulationResult: any | null;
  // actionTxns: ActionTxns;

  errorMessage: ActionMethod | null;
  isLoading: boolean;

  // Actions
  refreshState: (actionMode?: ActionType) => void;
  refreshSelectedBanks: (banks: ExtendedBankInfo[]) => void;
  fetchActionBoxState: (args: {
    requestedLendType?: ActionType;
    requestedBank?: ExtendedBankInfo;
  }) => void;
  setLendMode: (lendMode: ActionType) => void;
  setAmountRaw: (amountRaw: string, maxAmount?: number) => void;
  // setSimulationResult: (simulationResult: SimulationResult | null) => void;
  setSimulationResult: (simulationResult: any | null) => void;
  // setActionTxns: (actionTxns: ActionTxns) => void;
  setSelectedBank: (bank: ExtendedBankInfo | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setErrorMessage: (errorMessage: ActionMethod | null) => void;
}

function createLendBoxStore() {
  return create<LendBoxState>(stateCreator);
}

const initialState = {
  amountRaw: '',
  simulationResult: null,
  lendMode: ActionType.Deposit,
  selectedBank: null,
  actionTxns: { actionTxn: null, additionalTxns: [] },
  errorMessage: null,
  isLoading: false,
};

const stateCreator: StateCreator<LendBoxState, [], []> = (set, get) => ({
  // State
  ...initialState,

  refreshState(lendMode?: ActionType) {
    if (lendMode) {
      set({ ...initialState, lendMode });
    } else {
      set({ ...initialState });
    }
  },

  fetchActionBoxState(args) {
    let requestedAction: ActionType;
    let requestedBank: ExtendedBankInfo | null = null;
    const lendMode = get().lendMode;

    if (args.requestedLendType) {
      requestedAction = args.requestedLendType;
    } else {
      requestedAction = initialState.lendMode;
    }

    if (args.requestedBank) {
      requestedBank = args.requestedBank;
    } else {
      requestedBank = null;
    }

    const selectedBank = get().selectedBank;

    const needRefresh =
      !selectedBank ||
      lendMode !== requestedAction ||
      (requestedBank && requestedBank.bankId !== selectedBank.bankId);

    if (needRefresh)
      set({
        ...initialState,
        lendMode: requestedAction,
        selectedBank: requestedBank,
      });
  },

  async setAmountRaw(amountRaw, maxAmount) {
    if (!maxAmount) {
      set({ amountRaw });
    } else {
      const strippedAmount = amountRaw.replace(/,/g, '');
      let amount = isNaN(Number.parseFloat(strippedAmount))
        ? 0
        : Number.parseFloat(strippedAmount);
      const numberFormatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 10,
      });

      if (amount && amount > maxAmount) {
        amount = maxAmount;
      }

      set({ amountRaw: numberFormatter.format(amount) });
    }
  },

  refreshSelectedBanks(banks: ExtendedBankInfo[]) {
    const selectedBank = get().selectedBank;

    if (selectedBank) {
      const updatedBank = banks.find((v) => v.bankId === selectedBank.bankId);
      if (updatedBank) {
        set({ selectedBank: updatedBank });
      }
    }
  },

  setSelectedBank(tokenBank) {
    const currentState = get();
    // 如果新旧 bank 相同，不做更新
    if (
      tokenBank?.bankId === currentState.selectedBank?.bankId &&
      tokenBank?.isActive === currentState.selectedBank?.isActive
    ) {
      return;
    }

    set({
      selectedBank: tokenBank,
      amountRaw: '',
      errorMessage: null,
      simulationResult: null,
      isLoading: false,
    });
  },

  setLendMode(lendMode) {
    const selectedActionMode = get().lendMode;
    const hasActionModeChanged =
      !selectedActionMode || lendMode !== selectedActionMode;

    if (hasActionModeChanged) set({ amountRaw: '', errorMessage: null });

    set({ lendMode });
  },

  setSimulationResult(simulationResult) {
    set({ simulationResult });
  },

  setIsLoading(isLoading) {
    set({ isLoading });
  },

  setErrorMessage(errorMessage) {
    set({ errorMessage });
  },
});

export { createLendBoxStore };
export type { LendBoxState };
