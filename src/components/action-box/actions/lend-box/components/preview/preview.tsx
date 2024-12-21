import React from 'react';
import { cn, decimalStrToNumber } from '@/lib/utils';
import {
  AccountSummary,
  ActiveBankInfo,
  ExtendedBankInfo,
} from '@/lib/mrgnlend';
import { ActionType } from '@/lib/mrgnlend';
import { ActionStatItem } from '@/components/action-box/components/action-stats';
import { SimulatedActionPreview } from '../../utils/lend-simulation.utils';
import {
  getAmountStat,
  getPoolSizeStat,
  getHealthStat,
  getBankTypeStat,
  getOracleStat,
  getLiquidationStat,
} from '@/lib/stats-preview.utils';

interface PreviewProps {
  accountSummary: AccountSummary | null;
  selectedBank: ActiveBankInfo | null;
  isLoading: boolean;
  lendMode: ActionType;
  actionSummary?: SimulatedActionPreview;
}

export const Preview = ({
  accountSummary,
  actionSummary,
  selectedBank,
  isLoading,
  lendMode,
}: PreviewProps) => {
  const isLending = React.useMemo(
    () => lendMode === ActionType.Deposit || lendMode === ActionType.Withdraw,
    [lendMode],
  );

  const stats = React.useMemo(
    () =>
      actionSummary && selectedBank
        ? generateLendingStats(
            accountSummary as AccountSummary,
            actionSummary,
            selectedBank,
            isLending,
            isLoading,
          )
        : null,
    [actionSummary, selectedBank, isLending, isLoading],
  );

  return (
    <>
      {stats && selectedBank && (
        <dl className={cn('grid grid-cols-2 gap-y-2 pt-6 text-xs text-white')}>
          {stats.map((stat, idx) => (
            <ActionStatItem
              key={idx}
              label={stat.label}
              classNames={cn(
                stat.color &&
                  (stat.color === 'SUCCESS'
                    ? 'text-[#75BA80]'
                    : stat.color === 'ALERT'
                      ? 'text-alert-foreground'
                      : 'text-destructive-foreground'),
              )}
            >
              <stat.value />
            </ActionStatItem>
          ))}
        </dl>
      )}
    </>
  );
};

function generateLendingStats(
  accountSummary: AccountSummary,
  summary: SimulatedActionPreview,
  bank: ActiveBankInfo,
  isLending: boolean,
  isLoading: boolean,
) {
  const stats = [];

  stats.push(
    getAmountStat(
      bank?.balanceWithLendingPosition?.lendingPosition?.amount ?? 0,
      bank.token.symbol,
      decimalStrToNumber(summary.positionAmount),
    ),
  );

  stats.push(
    getHealthStat(
      decimalStrToNumber(accountSummary.healthFactor?.toString() ?? 1),
      false,
      decimalStrToNumber(summary.health.toString()),
    ),
  );

  if (
    summary.liquidationPrice &&
    summary.liquidationPrice != '0' &&
    bank.isActive &&
    !isLending
  )
    stats.push(
      getLiquidationStat(
        bank,
        false,
        decimalStrToNumber(summary.liquidationPrice),
      ),
    );

  if (bank.info.state.depositCap)
    stats.push(
      getPoolSizeStat(
        decimalStrToNumber(bank.info.state.depositCap.toString()),
        bank,
        isLending,
      ),
    );
  stats.push(getBankTypeStat(bank));
  stats.push(getOracleStat(bank));

  return stats;
}
