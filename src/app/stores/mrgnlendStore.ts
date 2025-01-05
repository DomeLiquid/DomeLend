import {
  accountSummary,
  getAccounts,
  getGroupAssetsWithPrice,
  getUserAssetsInfo,
  listBalances,
  listBanks,
} from '@/lib/actions';
import {
  AccountSummary,
  BalanceWithLendingPositionMap,
  BankMetadataMap,
  DEFAULT_ACCOUNT_SUMMARY,
  ExtendedBankInfo,
  LendingPosition,
  makeExtendedBankInfo,
  TokenWithPriceMetadata,
  TokenWithPriceMetadataMap,
} from '@/lib/mrgnlend';
import {
  Asset,
  AssetWithPrice,
  Balance,
  Bank,
  BankWithState,
  Account,
} from '@/types/account';
import { create, StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getAssetsInfo } from '../../lib/assets';

interface ProtocolStats {
  deposits: number;
  borrows: number;
  tvl: number;
  pointsTotal: number;
}

interface MrgnlendState {
  // State
  initialized: boolean;

  assetAmountMap: Map<string, number>;

  userDataFetched: boolean;
  isRefreshingStore: boolean;
  Accounts: Account[];
  selectedAccount: Account | null;
  accountSummary: AccountSummary;
  extendedBankInfos: ExtendedBankInfo[];
  protocolStats: ProtocolStats;
  bankMetadataMap: BankMetadataMap;
  tokenMetadataMap: TokenWithPriceMetadataMap;

  // Actions
  fetchMrgnlendState: (args?: {}) => Promise<void>;

  setIsRefreshingStore: (isRefreshingStore: boolean) => void;
  setSelectedAccount: (selectedAccount: Account | null) => void;
  resetUserData: () => void;
}

function createMrgnlendStore() {
  return create<MrgnlendState>(stateCreator);
}

function createPersistentMrgnlendStore() {
  return create<
    MrgnlendState,
    [['zustand/persist', Pick<MrgnlendState, 'protocolStats'>]]
  >(
    persist(stateCreator, {
      name: 'mrgnlend-peristent-store',
      // storage: createJSONStorage(() => localStorage),
      partialize(state) {
        return {
          protocolStats: state.protocolStats,
        };
      },
    }),
  );
}

const stateCreator: StateCreator<MrgnlendState, [], []> = (set, get) => ({
  initialized: false,

  assetAmountMap: new Map<string, number>(),

  userDataFetched: false,
  isRefreshingStore: false,
  Accounts: [],
  selectedAccount: null,
  accountSummary: DEFAULT_ACCOUNT_SUMMARY,
  protocolStats: {
    deposits: 0,
    borrows: 0,
    tvl: 0,
    pointsTotal: 0,
  },
  bankMetadataMap: {},
  tokenMetadataMap: {},

  extendedBankMetadatas: [],
  extendedBankInfos: [],

  fetchMrgnlendState: async (args?: { accountId?: string }) => {
    let Accounts: Account[] = [];
    let selectedAccount: Account | null = null;
    let bankMetadataMap: BankMetadataMap = {};
    let tokenMetadataMap: TokenWithPriceMetadataMap = {};
    let userDataFetched = false;
    let { assetAmountMap } = get();

    if (get().selectedAccount) {
      args = {
        ...args,
        accountId: get().selectedAccount?.id,
      };
    }
    try {
      const accounts = await getAccounts();
      if (accounts?.length) {
        Accounts = accounts;
        selectedAccount = args?.accountId
          ? accounts.find((account) => account.id === args.accountId) ||
            accounts[0]
          : accounts[0];
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const assetsWithPrice = await getGroupAssetsWithPrice();
      if (assetsWithPrice && assetsWithPrice.length > 0) {
        tokenMetadataMap = assetsWithPrice.reduce(
          (acc: TokenWithPriceMetadataMap, asset: AssetWithPrice) => {
            acc[asset.assetId] = {
              price: asset.price,
              priceHighest: asset.priceHighest,
              priceLowest: asset.priceLowest,
              assetId: asset.assetId,
              chainId: asset.chainId,
              symbol: asset.symbol,
              name: asset.name,
              iconUrl: asset.iconUrl,
              chain: asset.chain,
            };
            return acc;
          },
          {},
        );
      }
    } catch (error) {
      console.error(error);
    }

    let banksWithState: BankWithState[] | null = [];
    try {
      banksWithState = await listBanks();
      if (banksWithState) {
        bankMetadataMap = banksWithState.reduce(
          (acc: BankMetadataMap, bank) => {
            acc[bank.id] = {
              id: bank.id,
              mixinAssetId: bank.mixinSafeAssetId,
            };
            return acc;
          },
          {},
        );
      }
    } catch (error) {
      console.error('Error fetching banks', error);
    }

    const banksWithPriceAndToken: {
      bankWithState: BankWithState;
      tokenWithPriceMetadata: TokenWithPriceMetadata;
    }[] = [];
    if (banksWithState) {
      banksWithState.forEach((bankWithState) => {
        const tokenWithPriceMetadata =
          tokenMetadataMap[bankWithState.mixinSafeAssetId];

        if (tokenWithPriceMetadata) {
          banksWithPriceAndToken.push({
            bankWithState,
            tokenWithPriceMetadata,
          });
        }
      });
    }

    if (!assetAmountMap || assetAmountMap.size === 0) {
      const assetIds = banksWithPriceAndToken.map(
        (bank) => bank.tokenWithPriceMetadata.assetId,
      );
      const assets = await getAssetsInfo(assetIds);
      if (assets && assets.length > 0) {
        const newAssetAmountMap = new Map();
        assets.forEach((asset: any) => {
          newAssetAmountMap.set(
            asset.asset_id || asset.assetId,
            asset.balance || asset.amount,
          );
        });
        set({ assetAmountMap: newAssetAmountMap });
      }
    }

    let accountSummaryInfo: AccountSummary | null = DEFAULT_ACCOUNT_SUMMARY;
    let balancesWithLendingPositionMap: BalanceWithLendingPositionMap = {};
    if (selectedAccount) {
      try {
        const [accountSummaryResult, balancesWithLendingPosition] =
          await Promise.all([
            accountSummary(selectedAccount.id),
            listBalances(selectedAccount.id),
          ]);
        accountSummaryInfo = accountSummaryResult || DEFAULT_ACCOUNT_SUMMARY;

        if (balancesWithLendingPosition) {
          balancesWithLendingPositionMap = balancesWithLendingPosition.reduce(
            (acc: BalanceWithLendingPositionMap, balance) => {
              acc[balance.balanceAmount.bankId] = {
                ...balance.balanceAmount,
                lendingPosition: balance.position,
              };
              return acc;
            },
            {},
          );
        }
        userDataFetched = true;
      } catch (error) {
        console.error('Error fetching account data', error);
      }
    }

    const extendedBankInfos = banksWithPriceAndToken.reduce(
      (acc: ExtendedBankInfo[], bankWithPriceAndToken) => {
        acc.push(
          makeExtendedBankInfo(
            bankWithPriceAndToken.bankWithState,
            bankWithPriceAndToken.tokenWithPriceMetadata,
            balancesWithLendingPositionMap[
              bankWithPriceAndToken.bankWithState.id
            ],
            tokenMetadataMap[
              bankWithPriceAndToken.bankWithState.emissionsMixinSafeAssetId ||
                ''
            ],
            assetAmountMap,
          ),
        );
        return acc;
      },
      [],
    );

    const { deposits, borrows } = extendedBankInfos.reduce(
      (acc, bank) => {
        const price = bank.token.price;
        acc.deposits += bank.info.state.totalDeposits * price;
        acc.borrows += bank.info.state.totalBorrows * price;
        return acc;
      },
      { deposits: 0, borrows: 0 },
    );

    const sortedExtendedBankInfos = extendedBankInfos.sort(
      (a, b) =>
        b.info.state.totalDeposits * b.token.price -
        a.info.state.totalDeposits * a.token.price,
    );

    const pointsTotal = get().protocolStats.pointsTotal;

    set({
      initialized: true,
      userDataFetched,
      isRefreshingStore: false,
      Accounts,
      selectedAccount,
      accountSummary: accountSummaryInfo,
      extendedBankInfos: sortedExtendedBankInfos,
      protocolStats: {
        deposits,
        borrows,
        tvl: deposits + borrows,
        pointsTotal,
      },
      bankMetadataMap,
      tokenMetadataMap,
    });

    // TODO pointsTotal
  },
  setIsRefreshingStore: (isRefreshingStore: boolean) =>
    set(() => ({ isRefreshingStore })),
  resetUserData: () => {
    const extendedBankInfos = get().extendedBankInfos.map(
      (extendedBankInfo) => ({
        ...extendedBankInfo,
        info: {
          ...extendedBankInfo.info,
          state: {
            ...extendedBankInfo.info.state,
            totalDeposits: 0,
            totalBorrows: 0,
          },
        },
      }),
    );

    set({
      initialized: false,
      userDataFetched: false,
      isRefreshingStore: false,
      Accounts: [],
      selectedAccount: null,
      accountSummary: DEFAULT_ACCOUNT_SUMMARY,
      extendedBankInfos,
      protocolStats: {
        deposits: 0,
        borrows: 0,
        tvl: 0,
        pointsTotal: 0,
      },
      bankMetadataMap: {},
      tokenMetadataMap: {},
    });
  },
  setSelectedAccount: (selectedAccount: Account | null) => {
    set(() => ({ selectedAccount }));
    get().fetchMrgnlendState({ accountId: selectedAccount?.id });
  },
});

export { createMrgnlendStore, createPersistentMrgnlendStore };
export type { MrgnlendState };
