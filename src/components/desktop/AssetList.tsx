'use client';

import {
  useActionBoxStore,
  useMrgnlendStore,
  useUiStore,
  useUserProfileStore,
} from '@/app/stores';
import React from 'react';
import { LendingModes } from '@/types/type';
import { ActiveBankInfo, ExtendedBankInfo } from '@/lib/mrgnlend';
import { sortTvl } from '../common/AssetList/AssetListFilters.utils';
import { sortApRate } from '../common/AssetList/AssetListFilters.utils';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  AssetListModel,
  generateColumns,
  makeData,
} from '../common/AssetList/utils/tableHelperUtils';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AssetListFilters } from '../common/AssetList';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { TooltipProvider } from '../ui/tooltip';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { AssetRow } from '../common/AssetList/components/AssetRow';
import { AlertTriangle, Info } from 'lucide-react';

export const AssetList = () => {
  const [
    isStoreInitialized,
    extendedBankInfos,
    accountSummary,
    selectedAccount,
    fetchMrgnlendState,
  ] = useMrgnlendStore((state) => [
    state.initialized,
    state.extendedBankInfos,
    state.accountSummary,
    state.selectedAccount,
    state.fetchMrgnlendState,
  ]);
  const [denominationUSD, setShowBadges] = useUserProfileStore((state) => [
    state.denominationUSD,
    state.setShowBadges,
  ]);
  const [
    connected,
    poolFilter,
    isFilteredUserPositions,
    sortOption,
    lendingMode,
    setLendingMode,
  ] = useUiStore((state) => [
    state.connected,
    state.poolFilter,
    state.isFilteredUserPositions,
    state.sortOption,
    state.lendingMode,
    state.setLendingMode,
  ]);
  const [actionMode, setActionMode] = useActionBoxStore()((state) => [
    state.actionMode,
    state.setActionMode,
  ]);
  const [isHotkeyMode, setIsHotkeyMode] = React.useState(false);
  const isInLendingMode = React.useMemo(
    () => lendingMode === LendingModes.LEND,
    [lendingMode],
  );

  const sortBanks = React.useCallback(
    (banks: ExtendedBankInfo[]) => {
      if (sortOption.field === 'APY') {
        return sortApRate(banks, isInLendingMode, sortOption.direction);
      } else if (sortOption.field === 'TVL') {
        return sortTvl(banks, sortOption.direction);
      } else {
        return banks;
      }
    },
    [isInLendingMode, sortOption],
  );

  const sortedBanks = React.useMemo(() => {
    let filteredBanks = extendedBankInfos;

    if (poolFilter === 'isolated') {
      filteredBanks = filteredBanks.filter((b) => b.info.state.isIsolated);
    }

    if (isStoreInitialized && sortOption) {
      return sortBanks(filteredBanks);
    } else {
      return filteredBanks;
    }
  }, [
    isStoreInitialized,
    poolFilter,
    extendedBankInfos,
    sortOption,
    sortBanks,
  ]);

  const globalBanks = React.useMemo(() => {
    return (
      sortedBanks &&
      sortedBanks
        .filter((b) => !b.info.state.isIsolated)
        .filter((b) => (isFilteredUserPositions ? b.isActive : true))
    );
  }, [isFilteredUserPositions, sortedBanks]);

  const isolatedBanks = React.useMemo(() => {
    return (
      sortedBanks &&
      sortedBanks
        .filter((b) => b.info.state.isIsolated)
        .filter((b) => (isFilteredUserPositions ? b.isActive : true))
    );
  }, [isFilteredUserPositions, sortedBanks]);

  const activeBankInfos = React.useMemo(
    () => extendedBankInfos.filter((balance) => balance.isActive),
    [extendedBankInfos],
  ) as ActiveBankInfo[];

  // Enter hotkey mode
  useHotkeys(
    'meta + k',
    () => {
      setIsHotkeyMode(true);
      setShowBadges(true);

      setTimeout(() => {
        setIsHotkeyMode(false);
        setShowBadges(false);
      }, 5000);
    },
    { preventDefault: true, enableOnFormTags: true },
  );

  const [sorting, setSorting] = React.useState([]);

  const globalPoolTableData = React.useMemo(() => {
    return makeData(
      globalBanks,
      isInLendingMode,
      denominationUSD,
      selectedAccount,
      accountSummary,
      connected,
      fetchMrgnlendState,
    );
  }, [
    lendingMode,
    connected,
    globalBanks,
    isInLendingMode,
    denominationUSD,
    selectedAccount,
    connected,
    fetchMrgnlendState,
  ]);

  const isolatedPoolTableData = React.useMemo(() => {
    return makeData(
      isolatedBanks,
      isInLendingMode,
      denominationUSD,
      selectedAccount,
      accountSummary,
      connected,
      fetchMrgnlendState,
    );
  }, [
    connected,
    isolatedBanks,
    isInLendingMode,
    denominationUSD,
    selectedAccount,
    connected,
    fetchMrgnlendState,
  ]);

  const tableColumns = React.useMemo(() => {
    return generateColumns(isInLendingMode);
  }, [isInLendingMode]);

  const globalTable = useReactTable<AssetListModel>({
    data: globalPoolTableData,
    columns: tableColumns,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting as any,
  });

  const isolatedTable = useReactTable<AssetListModel>({
    data: isolatedPoolTableData,
    columns: tableColumns,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting as any,
  });

  return (
    <>
      <AssetListFilters connected={connected} />

      <div className="col-span-full">
        {globalPoolTableData.length ? (
          <>
            <div>
              <div className="mt-4 gap-1 pb-2 pt-4 text-2xl font-normal text-white ">
                Global pool
              </div>
            </div>
            <Table>
              <TableHeader>
                {globalTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.column.getSize(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {globalTable.getRowModel().rows.map((row) => {
                  return <AssetRow key={row.id} {...row} />;
                })}
              </TableBody>
            </Table>
          </>
        ) : (
          <></>
        )}
        {isolatedPoolTableData.length ? (
          <>
            <div className="flex h-full w-full items-center gap-2 pb-2 pt-4 font-aeonik text-2xl font-normal text-white">
              <span className="flex gap-1">
                Isolated <span className="hidden lg:block">pools</span>
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* <Image
                      src="/info_icon.png"
                      alt="info"
                      height={16}
                      width={16}
                    /> */}
                    <Info size={16} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-4 text-left leading-relaxed">
                      <h4 className="flex items-center gap-1.5 text-base">
                        <AlertTriangle size={18} /> Isolated pools are risky
                      </h4>
                      <p>
                        Assets in isolated pools cannot be used as collateral.
                        When you borrow an isolated asset, you cannot borrow
                        other assets. Isolated pools should be considered
                        particularly risky.
                      </p>
                      <p>
                        As always, remember that DomeFi is a decentralized
                        protocol and all deposited funds are at risk.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Table>
              <TableHeader>
                {isolatedTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.column.getSize(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isolatedTable.getRowModel().rows.map((row) => (
                  <AssetRow key={row.id} {...row} />
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
