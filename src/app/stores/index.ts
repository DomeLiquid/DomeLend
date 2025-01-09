import { StoreApi } from 'zustand';
import { UseBoundStore } from 'zustand';
import { UiState, createUiStore, SORT_OPTIONS_MAP } from './uiStore';
import { ActionBoxState, createActionBoxStore } from './actionBoxStore';
import {
  createMrgnlendStore,
  createPersistentMrgnlendStore,
} from './mrgnlendStore';
import { MrgnlendState } from './mrgnlendStore';
import { UserProfileState, createUserProfileStore } from './userProfileStore';

import { createLendBoxStore, LendBoxState } from './lend-box-store';

const useLendBoxGeneralStore: UseBoundStore<StoreApi<LendBoxState>> =
  createLendBoxStore();
const useLendBoxDialogStore: UseBoundStore<StoreApi<LendBoxState>> =
  createLendBoxStore();

const useLendBoxStore = (
  isDialog?: boolean,
): UseBoundStore<StoreApi<LendBoxState>> => {
  // if (!isDialog) {
  //   return useLendBoxGeneralStore;
  // } else {
  return useLendBoxDialogStore;
  // }
};

const useUiStore: UseBoundStore<StoreApi<UiState>> = createUiStore();
const useActionBoxGeneralStore: UseBoundStore<StoreApi<ActionBoxState>> =
  createActionBoxStore();
const useActionBoxDialogStore: UseBoundStore<StoreApi<ActionBoxState>> =
  createActionBoxStore();
const useMrgnlendStore: UseBoundStore<StoreApi<MrgnlendState>> =
  createPersistentMrgnlendStore();
const useUserProfileStore: UseBoundStore<StoreApi<UserProfileState>> =
  createUserProfileStore();

const useActionBoxStore = (
  isDialog?: boolean,
): UseBoundStore<StoreApi<ActionBoxState>> => {
  if (!isDialog) {
    return useActionBoxGeneralStore;
  } else {
    return useActionBoxDialogStore;
  }
};

export {
  useUiStore,
  useActionBoxGeneralStore,
  useActionBoxDialogStore,
  useMrgnlendStore,
  SORT_OPTIONS_MAP,
  useUserProfileStore,
  useLendBoxStore,
  // useLendBoxDialogStore,
  useActionBoxStore,
};
