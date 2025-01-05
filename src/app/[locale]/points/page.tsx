'use client';

import {
  useMrgnlendStore,
  useUiStore,
  useUserProfileStore,
} from '@/app/stores';
import { PointsConnectWallet, PointsOverview } from '@/components/points';
import { PointsTable } from '@/components/points/Points';
import { Loader } from '@/components/ui/loader';
import { IconInfiniteLoader } from '@/lib';
import { Link } from '@/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function PointsPage() {
  //   const { connected } = useWallet();

  const [connected] = useUiStore((state) => [state.connected]);
  const [initialized] = useMrgnlendStore((state) => [state.initialized]);

  const [userPointsData, pointsInfos, fetchPoints, fetchPointsInfos] =
    useUserProfileStore((state) => [
      state.userPointsData,
      state.pointsInfos,
      state.fetchPoints,
      state.fetchPointsInfos,
    ]);

  useMemo(() => {
    fetchPointsInfos();
    fetchPoints();
  }, []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {!initialized && isClient && (
        <div className="flex flex-col items-center justify-center">
          {<IconInfiniteLoader className="mt-16" />}
          <span className="text-sm text-gray-500">Loading points...</span>
        </div>
      )}

      {initialized && isClient && (
        <>
          <div className="flex w-full max-w-8xl flex-col items-center gap-5 px-4 pb-[64px] sm:pb-[32px] md:px-10">
            {!connected ? (
              <PointsConnectWallet />
            ) : (
              <PointsOverview userPointsData={userPointsData} />
            )}

            <div className="text-xs text-muted-foreground">
              <p>
                We reserve the right to update point calculations at any time.{' '}
                {/* <Link
                  href="/terms/points"
                  className="border-b border-muted-foreground/40 transition-colors hover:border-transparent"
                >
                  Terms.
                </Link> */}
              </p>
            </div>
            <PointsTable
              userPointsData={userPointsData}
              pointsInfos={pointsInfos}
            />
          </div>
        </>
      )}
    </>
  );
}
