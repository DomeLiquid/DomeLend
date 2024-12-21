import { HeaderContext } from '@tanstack/react-table';
import Image from 'next/image';

// import { AssetListModel } from '../utils';
import { cn } from '@/lib/utils';
import { AssetListModel } from '../utils/tableHelperUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Info } from 'lucide-react';

interface HeaderWrapperProps {
  header: HeaderContext<AssetListModel, any>;
  infoTooltip?: React.ReactNode;
  align?: 'left' | 'right';
  children: React.ReactNode;
}

export const HeaderWrapper = ({
  header,
  infoTooltip,
  align = 'right',
  children,
}: HeaderWrapperProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 border-none text-sm font-light text-[#A1A1A1]',
        align === 'left' && 'justify-start',
        align === 'right' && 'justify-end',
        header.column.getCanSort() ? 'cursor-pointer select-none' : '',
      )}
      onClick={header.column.getToggleSortingHandler()}
    >
      {children}

      {header.column.getCanSort() ? (
        header.column.getNextSortingOrder() === 'asc' ? (
          <ArrowDownWideNarrow size={18} />
        ) : header.column.getNextSortingOrder() === 'desc' ? undefined : (
          <ArrowUpWideNarrow size={18} />
        )
      ) : undefined}

      <div>
        {infoTooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="inline h-3 w-3" />
                {/* <Image src="/info_icon.png" alt="info" height={16} width={16} /> */}
              </TooltipTrigger>
              <TooltipContent>{infoTooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}{' '}
      </div>
    </div>
  );
};
