import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usdFormatterDyn } from '@/lib';
import { decimalStrToNumber, getMaintHealthColor } from '@/lib/utils';
import { Info } from 'lucide-react';
import React from 'react';

type ActionProgressBarProps = {
  amount: string;
  ratio: string;
  label: string;
  TooltipValue?: React.ReactNode;
  isLoading?: boolean;
};

export const ActionProgressBar = ({
  amount,
  ratio,
  label,
  TooltipValue,
  isLoading = false,
}: ActionProgressBarProps) => {
  const healthColor = React.useMemo(
    () => getMaintHealthColor(decimalStrToNumber(ratio)),
    [ratio],
  );

  return (
    <div>
      <dl className="flex items-center justify-between gap-2 text-muted-foreground">
        <dt className="flex items-center gap-1.5 pb-2 text-sm">
          {label}
          {TooltipValue && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} />
                </TooltipTrigger>
                <TooltipContent>{TooltipValue}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </dt>
        <dd className="text-sm font-medium text-white">
          {isLoading ? (
            <Skeleton className="h-4 w-[45px] bg-[#373F45]" />
          ) : (
            usdFormatterDyn.format(decimalStrToNumber(amount))
          )}
        </dd>
      </dl>
      <div className="bg-background-gray-dark mb-2 h-1.5 rounded-full">
        <div
          className="h-1.5 rounded-full"
          style={{
            backgroundColor: `${healthColor}`,
            width: `${decimalStrToNumber(ratio) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
