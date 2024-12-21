import { LendingModes, PoolTypes, sortDirection } from '@/types/type';
import { SortAssetOption } from '@/types/type';
import { SortType } from '@/types/type';
import { create, StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const SORT_OPTIONS_MAP: { [key in SortType]: SortAssetOption } = {
  APY_DESC: {
    label: 'APY highest to lowest',
    borrowLabel: 'APY highest to lowest',
    value: SortType.APY_DESC,
    field: 'APY',
    direction: sortDirection.DESC,
  },
  APY_ASC: {
    label: 'APY lowest to highest',
    borrowLabel: 'APY lowest to highest',
    value: SortType.APY_ASC,
    field: 'APY',
    direction: sortDirection.ASC,
  },
  TVL_DESC: {
    label: '$ highest to lowest',
    value: SortType.TVL_DESC,
    field: 'TVL',
    direction: sortDirection.DESC,
  },
  TVL_ASC: {
    label: '$ lowest to highest',
    value: SortType.TVL_ASC,
    field: 'TVL',
    direction: sortDirection.ASC,
  },
};

interface UiState {
  connected: boolean;
  isActionBoxInputFocussed: boolean;
  isMenuDrawerOpen: boolean;
  isFetchingData: boolean;
  isFilteredUserPositions: boolean;
  lendingMode: LendingModes;
  poolFilter: PoolTypes;
  sortOption: SortAssetOption;
  assetListSearch: string;

  setConnected: (connected: boolean) => void;
  setSortOption: (option: SortAssetOption) => void;
  setIsActionBoxInputFocussed: (isFocussed: boolean) => void;
  setIsMenuDrawerOpen: (isOpen: boolean) => void;
  setIsFetchingData: (isFetching: boolean) => void;
  setIsFilteredUserPositions: (isFiltered: boolean) => void;
  setLendingMode: (mode: LendingModes) => void;
  setPoolFilter: (filter: PoolTypes) => void;
  setAssetListSearch: (search: string) => void;
}

function createUiStore() {
  return create<UiState>()(
    persist(stateCreator, {
      name: 'uiStore',
      onRehydrateStorage: () => (state) => {
        state?.setIsActionBoxInputFocussed(false);
      },
    }),
  );
}
const stateCreator: StateCreator<UiState, [], []> = (set, get) => ({
  connected: false,
  sortAssetOption: SORT_OPTIONS_MAP[SortType.APY_DESC],
  isActionBoxInputFocussed: false,
  isMenuDrawerOpen: false,
  isFetchingData: false,
  isFilteredUserPositions: false,
  lendingMode: LendingModes.LEND,
  poolFilter: PoolTypes.ALL,
  sortOption: SORT_OPTIONS_MAP[SortType.APY_DESC],
  assetListSearch: '',

  setConnected: (connected: boolean) => {
    set({ connected: connected });
  },
  setSortOption: (option: SortAssetOption) => {
    set({ sortOption: option });
  },
  setIsActionBoxInputFocussed: (isFocussed: boolean) => {
    set({ isActionBoxInputFocussed: isFocussed });
  },
  setIsMenuDrawerOpen: (isOpen: boolean) => {
    set({ isMenuDrawerOpen: isOpen });
  },
  setIsFetchingData: (isFetching: boolean) => {
    set({ isFetchingData: isFetching });
  },
  setIsFilteredUserPositions: (isFiltered: boolean) => {
    set({ isFilteredUserPositions: isFiltered });
  },
  setLendingMode: (mode: LendingModes) => {
    set({ lendingMode: mode });
  },
  setPoolFilter: (filter: PoolTypes) => {
    set({ poolFilter: filter });
  },
  setAssetListSearch: (search: string) => {
    set({ assetListSearch: search });
  },
});

// export const useUiStore = createUiStore();

export { createUiStore, SORT_OPTIONS_MAP };
export type { UiState };
