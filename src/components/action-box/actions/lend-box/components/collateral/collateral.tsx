import { Account } from '@/types/account';
import React from 'react';
import { SimulatedActionPreview } from '../../utils/lend-simulation.utils';
import { ActionProgressBar } from '@/components/action-box/components/action-stats';
import { AccountSummary } from '@/lib/mrgnlend';

type CollateralProps = {
  selectedAccount: Account | null;
  actionSummary?: SimulatedActionPreview | null;
  accountSummaryArg?: AccountSummary | null;
};

export const Collateral = ({
  selectedAccount,
  actionSummary,
  accountSummaryArg,
}: CollateralProps) => {
  const availableCollateral = React.useMemo(() => {
    if (!selectedAccount) return null;
    return actionSummary?.availableCollateral;
  }, [actionSummary, selectedAccount]);

  return (
    <>
      {availableCollateral ? (
        <ActionProgressBar
          amount={availableCollateral.amount}
          ratio={availableCollateral.ratio}
          label={'Available collateral'}
          TooltipValue={
            <div className="space-y-2">
              <p>
                Available collateral is the USD value of your collateral not
                actively backing a loan.
              </p>
              <p>
                It can be used to open additional borrows or withdraw part of
                your collateral.
              </p>
            </div>
          }
        />
      ) : (
        accountSummaryArg && (
          <ActionProgressBar
            amount={accountSummaryArg.signedFreeCollateral.toString()}
            ratio={accountSummaryArg.healthFactor.toString()}
            label={'Available collateral'}
            TooltipValue={
              <div className="space-y-2">
                <p>
                  Available collateral is the USD value of your collateral not
                  actively backing a loan.
                </p>
                <p>
                  It can be used to open additional borrows or withdraw part of
                  your collateral.
                </p>
              </div>
            }
          />
        )
      )}
    </>
  );
};
