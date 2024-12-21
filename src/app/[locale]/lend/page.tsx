'use client';

import { useMrgnlendStore, useUiStore } from '@/app/stores';
import { ActionBox } from '@/components';
import Meteors from '@/components/magicui/meteors';
import { Loader } from '@/components/ui/loader';
import { OverlaySpinner } from '@/components/ui/overlay-spinner';
import { IconInfiniteLoader } from '@/lib';
import { Desktop } from '@/lib/mediaQueryUtils';
import { ActionType } from '@/lib/mrgnlend';
import { LendingModes } from '@/types/type';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const AssetsList = dynamic(
  async () => (await import('@/components/desktop/AssetList')).AssetList,
  {
    ssr: false,
  },
);

export default function LendPage() {
  const [
    isStoreInitialized,
    isRefreshingStore,
    selectedAccount,
    extendedBankInfos,
    accountSummary,
    fetchMrgnlendState,
  ] = useMrgnlendStore((state) => [
    state.initialized,
    state.isRefreshingStore,
    state.selectedAccount,
    state.extendedBankInfos,
    state.accountSummary,
    state.fetchMrgnlendState,
  ]);

  const uiState = useUiStore();

  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      uiState.setConnected(true);
    }
  }, [session]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* <Desktop> */}
      {!isStoreInitialized && isClient && (
        <div className="flex flex-col items-center justify-center">
          {isClient && <IconInfiniteLoader className="mt-16" />}
          <span className="text-sm text-gray-500">Loading lend...</span>
        </div>
      )}
      {isStoreInitialized && isClient && (
        <>
          <div className="w-full space-y-4 p-4">
            <ActionBox.BorrowLend
              useProvider={true}
              lendProps={{
                accountSummaryArg: accountSummary,
                banks: extendedBankInfos,
                selectedAccount: selectedAccount,
                requestedLendType:
                  uiState.lendingMode === LendingModes.LEND
                    ? ActionType.Deposit
                    : ActionType.Borrow,
                connected: uiState.connected,
                // walletContextState: walletContextState,
                captureEvent: (event, properties) => {
                  // capture(event, properties);
                },
                onComplete: () => {
                  fetchMrgnlendState();
                },
                // onConnect: () => uiState.setIsWalletAuthDialogOpen(true),
              }}
            />
          </div>
          <div className="xl:max-w-8xl mt-8 w-full gap-4 px-4 pb-[64px] pt-[16px]">
            {isClient && (
              <div className="xl:max-w-8xl mt-8 w-full gap-4 px-4 pb-[64px] pt-[16px]">
                <AssetsList />
              </div>
            )}
          </div>
        </>
      )}
      <OverlaySpinner fetching={!isStoreInitialized || isRefreshingStore} />
      {/* </Desktop> */}
    </>
  );
}
