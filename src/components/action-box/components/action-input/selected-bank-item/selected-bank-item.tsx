import React from 'react';

import { cn } from '@/lib/utils';
import { ExtendedBankInfo } from '@/lib/mrgnlend';
import { LendingModes } from '@/types/type';
import { TokenSymbol } from '@/components/token-item';

type SelectedBankItemProps = {
  bank: ExtendedBankInfo;
  lendingMode?: LendingModes;
  rate?: string;
};

export const SelectedBankItem = ({
  rate,
  bank,
  lendingMode,
}: SelectedBankItemProps) => {
  return (
    <>
      <TokenSymbol
        asset={bank.token}
        coinIconClassName="w-8 h-8"
        chainIconClassName="w-4 h-4"
      />
      <div className="xs:mr-0 mr-auto flex min-w-14 flex-col gap-1">
        <p className="text-sm leading-none">{bank.token.symbol}</p>
        {lendingMode && rate && (
          <p
            className={cn(
              'text-xs font-normal leading-none',
              lendingMode === LendingModes.LEND && 'text-[#75BA80]',
              lendingMode === LendingModes.BORROW && 'text-[#B8B45F]',
            )}
          >
            {`${rate} APY`}
          </p>
        )}
      </div>
    </>
  );
};
