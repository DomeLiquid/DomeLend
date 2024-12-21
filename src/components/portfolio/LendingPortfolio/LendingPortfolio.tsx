import { useUiStore, useMrgnlendStore } from '@/app/stores';
import { Link, useRouter } from '@/navigation';
import React from 'react';
import { PortfolioUserStats } from '../PortfolioUserStats';
import { ActiveBankInfo } from '@/lib/mrgnlend';
import { numeralFormatter, usdFormatter, usdFormatterDyn } from '@/lib';
import { Loader } from '@/components/ui/loader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  PortfolioAssetCard,
  PortfolioAssetCardSkeleton,
} from '../PortfolioAssetCard';
import { LendingModes } from '@/types/type';

export const LendingPortfolio = () => {
  const router = useRouter();
  const [connected] = useUiStore((state) => [state.connected]);
  const [walletConnectionDelay, setWalletConnectionDelay] =
    React.useState(false);

  const [
    selectedAccount,
    isStoreInitialized,
    sortedBanks,
    accountSummary,
    isRefreshingStore,
  ] = useMrgnlendStore((state) => [
    state.selectedAccount,
    state.initialized,
    state.extendedBankInfos,
    state.accountSummary,
    state.isRefreshingStore,
  ]);

  const [setLendingMode] = useUiStore((state) => [state.setLendingMode]);

  const lendingBanks = React.useMemo(
    () =>
      sortedBanks && isStoreInitialized
        ? (
            sortedBanks.filter(
              (b) =>
                b.isActive &&
                'balanceWithLendingPosition' in b &&
                b.balanceWithLendingPosition.lendingPosition?.isLending,
            ) as ActiveBankInfo[]
          ).sort((a, b) => {
            const bValue =
              b.balanceWithLendingPosition.lendingPosition?.usdValue ?? 0;
            const aValue =
              a.balanceWithLendingPosition.lendingPosition?.usdValue ?? 0;
            return bValue - aValue;
          })
        : [],
    [sortedBanks, isStoreInitialized],
  ) as ActiveBankInfo[];

  const borrowingBanks = React.useMemo(
    () =>
      sortedBanks && isStoreInitialized
        ? (
            sortedBanks.filter(
              (b) =>
                b.isActive &&
                'balanceWithLendingPosition' in b &&
                !b.balanceWithLendingPosition.lendingPosition?.isLending,
            ) as ActiveBankInfo[]
          ).sort((a, b) => {
            const bValue =
              b.balanceWithLendingPosition.lendingPosition?.usdValue ?? 0;
            const aValue =
              a.balanceWithLendingPosition.lendingPosition?.usdValue ?? 0;
            return bValue - aValue;
          })
        : [],
    [sortedBanks, isStoreInitialized],
  ) as ActiveBankInfo[];

  const accountSupplied = React.useMemo(
    () =>
      accountSummary
        ? accountSummary.lendingAmount > 10000
          ? usdFormatterDyn.format(Math.round(accountSummary.lendingAmount))
          : usdFormatter.format(accountSummary.lendingAmount)
        : '-',
    [accountSummary],
  );
  const accountBorrowed = React.useMemo(
    () =>
      accountSummary
        ? accountSummary.borrowingAmount > 10000
          ? usdFormatterDyn.format(accountSummary.borrowingAmount)
          : usdFormatter.format(accountSummary.borrowingAmount)
        : '-',
    [accountSummary],
  );
  const accountNetValue = React.useMemo(
    () =>
      accountSummary
        ? accountSummary.balanceUnbiased > 10000
          ? usdFormatterDyn.format(accountSummary.balanceUnbiased)
          : usdFormatter.format(accountSummary.balanceUnbiased)
        : '-',
    [accountSummary],
  );

  const lendingAmountWithBiasAndWeighted = React.useMemo(
    () =>
      accountSummary?.lendingAmountWithBiasAndWeighted
        ? accountSummary.lendingAmountWithBiasAndWeighted > 10000
          ? usdFormatterDyn.format(
              Math.round(accountSummary.lendingAmountWithBiasAndWeighted),
            )
          : usdFormatter.format(accountSummary.lendingAmountWithBiasAndWeighted)
        : '-',
    [accountSummary],
  );

  const borrowingAmountWithBiasAndWeighted = React.useMemo(
    () =>
      accountSummary?.borrowingAmountWithBiasAndWeighted
        ? accountSummary.borrowingAmountWithBiasAndWeighted > 10000
          ? usdFormatterDyn.format(
              Math.round(accountSummary.borrowingAmountWithBiasAndWeighted),
            )
          : usdFormatter.format(
              accountSummary.borrowingAmountWithBiasAndWeighted,
            )
        : '-',
    [accountSummary],
  );

  const isLoading = React.useMemo(
    () =>
      (!isStoreInitialized ||
        walletConnectionDelay ||
        isRefreshingStore ||
        (!isStoreInitialized && accountSummary.balance === 0)) &&
      !lendingBanks.length &&
      !borrowingBanks.length,
    [
      isStoreInitialized,
      walletConnectionDelay,
      isRefreshingStore,
      accountSummary.balance,
      lendingBanks,
      borrowingBanks,
    ],
  );

  React.useEffect(() => {
    if (connected) {
      setWalletConnectionDelay(true);
      const timer = setTimeout(() => {
        setWalletConnectionDelay(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [connected]);

  if (!isStoreInitialized || isLoading) {
    return (
      <Card className="mb-10 w-full bg-background-gray-dark p-4 shadow-lg md:p-6">
        <CardContent className="space-y-6">
          {/* Stats Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-1/3 animate-pulse rounded-md bg-muted" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
                  <div className="h-6 animate-pulse rounded-md bg-muted" />
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {/* Supplied Section Skeleton */}
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader className="flex-row items-center justify-between space-y-0 px-0 pb-4">
                <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-32 animate-pulse rounded-full bg-muted" />
              </CardHeader>
              <CardContent className="px-0">
                <PortfolioAssetCardSkeleton />
              </CardContent>
            </Card>

            {/* Borrowed Section Skeleton */}
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader className="flex-row items-center justify-between space-y-0 px-0 pb-4">
                <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-32 animate-pulse rounded-full bg-muted" />
              </CardHeader>
              <CardContent className="px-0">
                <PortfolioAssetCardSkeleton />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-10 w-full bg-background-gray-dark shadow-lg transition-all duration-200">
      <CardContent className="space-y-6 p-4 md:p-6">
        <div className="text-muted-foreground">
          <PortfolioUserStats
            netValue={accountNetValue}
            points={numeralFormatter(accountSummary.healthFactor)}
            weightedLend={lendingAmountWithBiasAndWeighted}
            weightedBorrow={borrowingAmountWithBiasAndWeighted}
            accountSummary={accountSummary}
          />
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {/* Supplied Section */}
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="flex-row items-center justify-between space-y-0 px-0 pb-4">
              <CardTitle className="text-xl font-medium">Supplied</CardTitle>
              <Badge
                variant={
                  accountSummary.lendingAmount > 0 ? 'default' : 'secondary'
                }
                className="h-8 px-3"
              >
                {accountSupplied}
              </Badge>
            </CardHeader>
            <CardContent className="px-0">
              {isStoreInitialized ? (
                lendingBanks.length > 0 ? (
                  <ScrollArea className="pr-4">
                    <div className="flex flex-col gap-4">
                      {lendingBanks.map(
                        (bank) =>
                          bank.balanceWithLendingPosition.lendingPosition
                            ?.amount &&
                          bank.balanceWithLendingPosition.lendingPosition
                            .amount > 0.00000001 && (
                            <PortfolioAssetCard
                              key={bank.token.symbol}
                              bank={bank}
                              isInLendingMode={true}
                              isBorrower={borrowingBanks.length > 0}
                              selectedAccount={selectedAccount}
                            />
                          ),
                      )}
                    </div>
                  </ScrollArea>
                ) : (
                  <CardDescription className="text-sm">
                    No lending positions found.
                  </CardDescription>
                )
              ) : (
                <PortfolioAssetCardSkeleton />
              )}
            </CardContent>
          </Card>

          {/* Borrowed Section */}
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="flex-row items-center justify-between space-y-0 px-0 pb-4">
              <CardTitle className="text-xl font-medium">Borrowed</CardTitle>
              <Badge
                variant={
                  accountSummary.borrowingAmount > 0
                    ? 'destructive'
                    : 'secondary'
                }
                className="h-8 px-3"
              >
                {accountBorrowed}
              </Badge>
            </CardHeader>
            <CardContent className="px-0">
              {isStoreInitialized ? (
                borrowingBanks.length > 0 ? (
                  <ScrollArea className="pr-4">
                    <div className="flex flex-col gap-4">
                      {borrowingBanks.map((bank) => (
                        <PortfolioAssetCard
                          key={bank.token.symbol}
                          bank={bank}
                          isInLendingMode={false}
                          isBorrower={borrowingBanks.length > 0}
                          selectedAccount={selectedAccount}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <Card className="border-border/40 bg-background-gray-light/30">
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                      <CardDescription>
                        No borrow positions found.
                      </CardDescription>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="link"
                          className="h-auto p-0 text-primary"
                          onClick={() => {
                            setLendingMode(LendingModes.BORROW);
                            router.push('/');
                          }}
                        >
                          Search the pools
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          and open a new borrow.
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              ) : (
                <PortfolioAssetCardSkeleton />
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
