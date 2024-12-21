import { useUserProfileStore } from '@/app/stores';
import { useUiStore } from '@/app/stores';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { LendingModes, PoolTypes } from '@/types/type';
import { Filter, SearchIcon, X } from 'lucide-react';
import React from 'react';

export const AssetListFilters = ({
  connected = false,
}: {
  connected?: boolean;
}) => {
  const [
    poolFilter,
    setPoolFilter,
    isFilteredUserPositions,
    setIsFilteredUserPositions,
    assetListSearch,
    setAssetListSearch,
    lendingMode,
    setLendingMode,
  ] = useUiStore((state) => [
    state.poolFilter,
    state.setPoolFilter,
    state.isFilteredUserPositions,
    state.setIsFilteredUserPositions,
    state.assetListSearch,
    state.setAssetListSearch,
    state.lendingMode,
    state.setLendingMode,
  ]);

  const [denominationUSD, setDenominationUSD] = useUserProfileStore((state) => [
    state.denominationUSD,
    state.setDenominationUSD,
  ]);

  const searchRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="col-span-full w-full space-y-5">
      <div className="flex flex-col gap-2 pr-1 lg:flex-row lg:items-center lg:gap-8">
        <div className="mr-auto">
          <ToggleGroup
            type="single"
            variant={'default'}
            value={lendingMode}
            onValueChange={(value) => {
              if (value === LendingModes.LEND) {
                setLendingMode(LendingModes.LEND);
              } else if (value === LendingModes.BORROW) {
                setLendingMode(LendingModes.BORROW);
              }
            }}
            className="rounded-lg"
          >
            <ToggleGroupItem value="lend" aria-label="Lend">
              Lend
            </ToggleGroupItem>
            <ToggleGroupItem value="borrow" aria-label="Borrow">
              Borrow
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="relative w-full max-w-sm text-muted-foreground">
          <SearchIcon size={18} className="absolute left-3.5 top-3" />
          <Input
            ref={searchRef}
            placeholder="Search assets"
            className="w-full rounded-full border-background-gray-hover px-10 py-5 pr-12 transition-colors focus:text-primary/70"
            value={assetListSearch}
            onChange={(e) => {
              setAssetListSearch(e.target.value);
            }}
          />
          <X
            size={18}
            className={cn(
              'absolute right-3 top-3 cursor-pointer opacity-0 transition-opacity',
              assetListSearch.length && 'opacity-100',
            )}
            onClick={() => setAssetListSearch('')}
          />
        </div>
        <div
          className={cn(
            'flex shrink-0 items-center gap-2 text-sm',
            !connected && 'opacity-50',
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (connected) return;
            // setIsWalletAuthDialogOpen(true);
          }}
        >
          <Switch
            id="usd-denominated"
            checked={denominationUSD}
            onCheckedChange={() => {
              if (!connected) return;
              setDenominationUSD(!denominationUSD);
            }}
          />
          <Label
            htmlFor="usd-denominated"
            className={cn(
              'cursor-pointer text-muted-foreground transition-colors hover:text-white',
              isFilteredUserPositions && 'text-white',
            )}
          >
            USD Denominated
          </Label>
        </div>
        <div
          className={cn(
            'flex shrink-0 items-center gap-2 text-sm',
            !connected && 'opacity-50',
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (connected) return;
            // setIsWalletAuthDialogOpen(true);
          }}
        >
          {/* <Switch
            id="filter-positions"
            checked={isFilteredUserPositions}
            onCheckedChange={() => {
              if (!connected) return;
              setIsFilteredUserPositions(!isFilteredUserPositions);
              setPoolFilter(PoolTypes.ALL);
            }}
          />
          <Label
            htmlFor="filter-positions"
            className={cn(
              'cursor-pointer text-muted-foreground transition-colors hover:text-white',
              isFilteredUserPositions && 'text-white',
            )}
          >
            Filter my positions
          </Label> */}
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full space-y-2 md:w-auto">
            <Select
              value={poolFilter}
              disabled={isFilteredUserPositions}
              onValueChange={(value) => {
                setPoolFilter(value as PoolTypes);
              }}
            >
              <SelectTrigger className="md:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter size={18} />
                  <SelectValue
                    defaultValue="allpools"
                    placeholder="Select pools"
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pools</SelectItem>
                <SelectItem value="isolated">Isolated pools</SelectItem>
                {/* <SelectItem value="stable">Stablecoins</SelectItem> */}
                {/* <SelectItem value="lst">SOL / LST</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
