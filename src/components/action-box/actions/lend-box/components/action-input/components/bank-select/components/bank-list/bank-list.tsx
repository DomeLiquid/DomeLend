import { computeBankRate } from '@/components/action-box/actions/lend-box/utils/mrgnUtils';
import {
  BankItem,
  BankListCommand,
} from '@/components/action-box/components/action-input';
import { Button } from '@/components/ui/button';
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { ActionType, ExtendedBankInfo } from '@/lib/mrgnlend';
import { cn, decimalStrToNumber } from '@/lib/utils';
import { LendingModes } from '@/types/type';
import React from 'react';

type BankListProps = {
  selectedBank: ExtendedBankInfo | null;
  banks: ExtendedBankInfo[];
  isOpen: boolean;
  lendMode: ActionType;
  connected: boolean;

  onSetSelectedBank: (selectedTokenBank: ExtendedBankInfo | null) => void;
  onClose: () => void;
};

export const BankList = ({
  selectedBank,
  banks,
  lendMode,
  connected,
  onSetSelectedBank,
  isOpen,
  onClose,
}: BankListProps) => {
  const lendingMode = React.useMemo(
    () =>
      lendMode === ActionType.Deposit || lendMode === ActionType.Withdraw
        ? LendingModes.LEND
        : LendingModes.BORROW,
    [lendMode],
  );

  const [searchQuery, setSearchQuery] = React.useState('');

  const calculateRate = React.useCallback(
    (bank: ExtendedBankInfo) => {
      return computeBankRate(bank, lendingMode);
    },
    [lendingMode],
  );

  const hasTokens = false;

  /////// FILTERS

  // filter on balance
  // const balanceFilter = React.useCallback(
  //   (bankInfo: ExtendedBankInfo) => {
  //     const isWSOL = bankInfo.info.state.mint?.equals
  //       ? bankInfo.info.state.mint.equals(WSOL_MINT)
  //       : false;
  //     const balance = isWSOL
  //       ? bankInfo.userInfo.tokenAccount.balance + nativeSolBalance
  //       : bankInfo.userInfo.tokenAccount.balance;
  //     return balance > 0;
  //   },
  //   [nativeSolBalance],
  // );

  // filter on search
  const searchFilter = React.useCallback(
    (bankInfo: ExtendedBankInfo) => {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      return bankInfo.token.symbol.toLowerCase().includes(lowerCaseSearchQuery);
    },
    [searchQuery],
  );

  // filter on positions
  const positionFilter = React.useCallback(
    (bankInfo: ExtendedBankInfo, filterActive?: boolean) =>
      bankInfo.isActive
        ? lendingMode === LendingModes.LEND &&
          bankInfo.balanceWithLendingPosition.lendingPosition?.isLending &&
          bankInfo.balanceWithLendingPosition.lendingPosition.amount > 0
        : filterActive,
    [lendingMode],
  );

  /////// BANKS

  // wallet banks
  const filteredBanksUserOwns = React.useMemo(() => {
    return (
      banks
        // .filter(balanceFilter)
        .filter(searchFilter)
        .filter((bank) => positionFilter(bank, true))
        .sort((a, b) => {
          return (
            a.info.state.availableLiquidity - b.info.state.availableLiquidity
          );
        })
    );
  }, [banks, searchFilter]);

  // active position banks
  const filteredBanksActive = React.useMemo(() => {
    return banks
      .filter(searchFilter)
      .filter((bankInfo) => positionFilter(bankInfo, false))
      .sort(
        (a, b) =>
          (b.isActive
            ? b?.balanceWithLendingPosition?.lendingPosition?.amount ?? 0
            : 0) -
          (a.isActive
            ? a?.balanceWithLendingPosition?.lendingPosition?.amount ?? 0
            : 0),
      );
  }, [banks, searchFilter, positionFilter]);

  // other banks without positions
  const filteredBanks = React.useMemo(() => {
    return banks.filter(searchFilter);
  }, [banks, searchFilter]);

  const globalBanks = React.useMemo(
    () => filteredBanks.filter((bank) => !bank.info.state.isIsolated),
    [filteredBanks],
  );
  const isolatedBanks = React.useMemo(
    () => filteredBanks.filter((bank) => bank.info.state.isIsolated),
    [filteredBanks],
  );

  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  return (
    <>
      <BankListCommand
        selectedBank={selectedBank}
        onClose={onClose}
        onSetSearchQuery={setSearchQuery}
      >
        {/* {!hasTokens && (
          <div className="p-3 text-sm font-normal text-[#C0BFBF]">
            You don&apos;t own any supported tokens in DomeFi. Check out what
            DomeFi supports.
          </div>
        )} */}
        <CommandEmpty>No tokens found.</CommandEmpty>

        {/* LENDING */}
        {/* {lendingMode === LendingModes.LEND &&
          connected &&
          filteredBanksUserOwns.length > 0 &&
          onSetSelectedBank && (
            <CommandGroup heading="Available in your wallet">
              {filteredBanksUserOwns
                .slice(
                  0,
                  searchQuery.length === 0 ? filteredBanksUserOwns.length : 3,
                )
                .map((bank, index) => {
                  return (
                    <CommandItem
                      key={index}
                      value={bank?.bankId?.toString().toLowerCase()}
                      onSelect={(currentValue: string) => {
                        onSetSelectedBank(
                          banks.find(
                            (bankInfo) =>
                              bankInfo.bankId.toString().toLowerCase() ===
                              currentValue,
                          ) ?? null,
                        );
                        onClose();
                      }}
                      className="data-[selected=true]:bg-background-gray-light flex h-[55px] cursor-pointer items-center justify-between gap-2 px-3 font-medium data-[selected=true]:text-white"
                    >
                      <BankItem
                        rate={calculateRate(bank)}
                        lendingMode={lendingMode}
                        bank={bank}
                        showBalanceOverride={true}
                      />
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          )} */}

        {lendingMode === LendingModes.LEND &&
          filteredBanksActive.length > 0 &&
          onSetSelectedBank && (
            <CommandGroup heading="Currently supplying">
              {filteredBanksActive.map((bank, index) => (
                <CommandItem
                  key={index}
                  value={bank.bankId?.toString().toLowerCase()}
                  onSelect={(currentValue: string) => {
                    onSetSelectedBank(
                      filteredBanksActive.find(
                        (bankInfo) =>
                          bankInfo.bankId.toString().toLowerCase() ===
                          currentValue,
                      ) ?? null,
                    );
                    onClose();
                  }}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 py-2 font-medium hover:bg-background-gray-light data-[selected=true]:bg-background-gray-light data-[selected=true]:text-white data-[disabled=true]:opacity-50',
                  )}
                >
                  <BankItem
                    rate={calculateRate(bank)}
                    lendingMode={lendingMode}
                    bank={bank}
                    showBalanceOverride={true}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

        {/* BORROWING */}
        {lendingMode === LendingModes.BORROW &&
          filteredBanksActive.length > 0 &&
          onSetSelectedBank && (
            <CommandGroup heading="Currently borrowing">
              {filteredBanksActive.map((bank, index) => (
                <CommandItem
                  key={index}
                  value={bank.bankId?.toString().toLowerCase()}
                  onSelect={(currentValue: string) => {
                    onSetSelectedBank(
                      banks.find(
                        (bankInfo) =>
                          bankInfo.bankId.toString().toLowerCase() ===
                          currentValue,
                      ) ?? null,
                    );
                    onClose();
                  }}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 font-medium data-[selected=true]:bg-background-gray-light data-[selected=true]:text-white',
                  )}
                >
                  <BankItem
                    rate={calculateRate(bank)}
                    lendingMode={lendingMode}
                    bank={bank}
                    showBalanceOverride={false}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

        {/* GLOBAL & ISOLATED */}
        {globalBanks.length > 0 && onSetSelectedBank && (
          <CommandGroup heading="Global pools">
            {globalBanks.map((bank, index) => {
              return (
                <CommandItem
                  key={index}
                  value={bank.bankId?.toString().toLowerCase()}
                  onSelect={(currentValue: string) => {
                    onSetSelectedBank(
                      banks.find(
                        (bankInfo) =>
                          bankInfo.bankId.toString().toLowerCase() ===
                          currentValue,
                      ) ?? null,
                    );
                    onClose();
                  }}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 font-medium data-[selected=true]:bg-background-gray-light data-[selected=true]:text-white',
                    lendingMode === LendingModes.LEND && 'py-2',
                    lendingMode === LendingModes.BORROW && 'h-[60px]',
                  )}
                >
                  <BankItem
                    rate={calculateRate(bank)}
                    lendingMode={lendingMode}
                    bank={bank}
                    showBalanceOverride={false}
                  />
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
        {isolatedBanks.length > 0 && onSetSelectedBank && (
          <CommandGroup heading="Isolated pools">
            {isolatedBanks.map((bank, index) => {
              return (
                <CommandItem
                  key={index}
                  value={bank.bankId?.toString().toLowerCase()}
                  onSelect={(currentValue: string) => {
                    onSetSelectedBank(
                      banks.find(
                        (bankInfo) =>
                          bankInfo.bankId.toString().toLowerCase() ===
                          currentValue,
                      ) ?? null,
                    );
                    onClose();
                  }}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 font-medium data-[selected=true]:bg-background-gray-light data-[selected=true]:text-white',
                    lendingMode === LendingModes.LEND && 'py-2',
                    lendingMode === LendingModes.BORROW && 'h-[60px]',
                  )}
                >
                  <BankItem
                    rate={calculateRate(bank)}
                    lendingMode={lendingMode}
                    bank={bank}
                    showBalanceOverride={false}
                  />
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </BankListCommand>
    </>
  );
};
