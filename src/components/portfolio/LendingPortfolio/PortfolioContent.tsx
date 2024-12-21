import React from 'react';
import { Link } from '@/navigation';
import { PortfolioUserStats } from '../PortfolioUserStats';
import { ActiveBankInfo } from '@/lib/mrgnlend';
import {
  PortfolioAssetCard,
  PortfolioAssetCardSkeleton,
} from '../PortfolioAssetCard';
import { LendingModes } from '@/types/type';
import { numeralFormatter } from '@/lib';

interface PortfolioContentProps {
  isStoreInitialized: boolean;
  connected: boolean;
  accountNetValue: string;
  accountSummary: any;
  lendingAmountWithBiasAndWeighted: string;
  borrowingAmountWithBiasAndWeighted: string;
  accountSupplied: string;
  accountBorrowed: string;
  lendingBanks: ActiveBankInfo[];
  borrowingBanks: ActiveBankInfo[];
  selectedAccount: any;
  setLendingMode: (mode: LendingModes) => void;
  onNavigate: (path: string) => void;
}

export const PortfolioContent: React.FC<PortfolioContentProps> = ({
  isStoreInitialized,
  connected,
  accountNetValue,
  accountSummary,
  lendingAmountWithBiasAndWeighted,
  borrowingAmountWithBiasAndWeighted,
  accountSupplied,
  accountBorrowed,
  lendingBanks,
  borrowingBanks,
  selectedAccount,
  setLendingMode,
  onNavigate,
}) => {
  // if (isStoreInitialized && !connected) {
  //   return <div>Wallet button</div>;
  // }

  // if (isStoreInitialized && connected && !lendingBanks.length && !borrowingBanks.length) {
  //   return (
  //     <p className="mt-4 text-center text-muted-foreground">
  //       You do not have any open positions.
  //       <br className="md:hidden" />{' '}
  //       <Link
  //         href="/"
  //         className="border-b border-muted-foreground transition-colors hover:border-transparent"
  //       >
  //         Explore the pools
  //       </Link>{' '}
  //       and make your first deposit!
  //     </p>
  //   );
  // }

  return (
    isStoreInitialized && (
      <div className="mb-10 w-full space-y-3 rounded-xl bg-background-gray-dark p-4 md:p-6">
        <div className="text-muted-foreground">
          <PortfolioUserStats
            netValue={accountNetValue}
            points={numeralFormatter(accountSummary.healthFactor)}
            weightedLend={lendingAmountWithBiasAndWeighted}
            weightedBorrow={borrowingAmountWithBiasAndWeighted}
            accountSummary={accountSummary}
          />
        </div>
        <div className="flex flex-col flex-wrap justify-between gap-8 md:flex-row md:gap-20">
          <div className="flex flex-1 flex-col gap-4 md:min-w-[340px]">
            <dl className="flex items-center justify-between gap-2">
              <dt className="text-xl font-medium">Supplied</dt>
              <dt className="text-muted-foreground">{accountSupplied}</dt>
            </dl>
            {isStoreInitialized ? (
              lendingBanks.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {lendingBanks.map(
                    (bank) =>
                      bank.balanceWithLendingPosition.lendingPosition?.amount &&
                      bank.balanceWithLendingPosition.lendingPosition.amount >
                        0.00000001 && (
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
              ) : (
                <div
                  color="#868E95"
                  className="font-aeonik flex gap-1 text-sm font-[300]"
                >
                  No lending positions found.
                </div>
              )
            ) : (
              <PortfolioAssetCardSkeleton />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-4 md:min-w-[340px]">
            <dl className="flex items-center justify-between gap-2">
              <dt className="text-xl font-medium">Borrowed</dt>
              <dt className="text-muted-foreground">{accountBorrowed}</dt>
            </dl>
            {isStoreInitialized ? (
              borrowingBanks.length > 0 ? (
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
              ) : (
                <div
                  color="#868E95"
                  className="font-aeonik flex gap-1 text-sm font-[300]"
                >
                  No borrow positions found.{' '}
                  <button
                    className="border-b border-primary/50 transition-colors hover:border-primary"
                    onClick={() => {
                      setLendingMode(LendingModes.BORROW);
                      onNavigate('/');
                    }}
                  >
                    Search the pools
                  </button>{' '}
                  and open a new borrow.
                </div>
              )
            ) : (
              <PortfolioAssetCardSkeleton />
            )}
          </div>
        </div>
      </div>
    )
  );
};
