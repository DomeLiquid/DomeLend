import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActionBoxState {
  // State
  isSettingsDialogOpen: boolean;
  isActionComplete: boolean;

  // Actions
  setIsActionComplete: (isActionSuccess: boolean) => void;
  setIsSettingsDialogOpen: (isOpen: boolean) => void;
}

function createActionBoxStore() {
  return create<ActionBoxState>()(
    persist(stateCreator, {
      name: 'actionBoxStore',
    }),
  );
}

const stateCreator: StateCreator<ActionBoxState, [], []> = (set, get) => ({
  // State
  isSettingsDialogOpen: false,
  isActionComplete: false,

  // Actions
  setIsSettingsDialogOpen: (isOpen: boolean) =>
    set({ isSettingsDialogOpen: isOpen }),
  setIsActionComplete: (isActionSuccess: boolean) =>
    set({ isActionComplete: isActionSuccess }),
});

export { createActionBoxStore };
export type { ActionBoxState };
