import { create } from 'zustand';
import type { Balance, ListBanksResponseItem } from '@/types/account';

// interface BanksState {
//   banks: ListBanksResponseItem[];
//   balances: Balance[];
// }

// interface BanksActions {
//   setBanks: (banks: ListBanksResponseItem[]) => void;
//   setBalances: (balances: Balance[]) => void;
// }

// export const useBanksStore = create<BanksState & BanksActions>()((set) => ({
//   banks: [],
//   balances: [],
//   setBanks: (banks: ListBanksResponseItem[]) => set(() => ({ banks })),
//   setBalances: (balances: Balance[]) => set(() => ({ balances })),
// }));
