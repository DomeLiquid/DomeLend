import React from 'react';
import { AnimatedCircularProgressBar } from '../magicui/animated-circular-progress-bar';
import { getInitHealthColor } from '@/lib/utils';
import { percentFormatterDyn, usdFormatter } from '@/lib';
import { AccountSummary } from '@/lib/mrgnlend';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';

interface PortfolioUserStatsProps {
  weightedLend: string;
  weightedBorrow: string;
  netValue: string;
  points: string;
  accountSummary: AccountSummary;
}

export const PortfolioUserStats = ({
  weightedLend,
  weightedBorrow,
  netValue,
  points,
  accountSummary,
}: PortfolioUserStatsProps) => {
  return (
    <div className="mx-auto flex max-w-2xl">
      <div className="flex flex-1 flex-col justify-center p-4 px-8">
        <div>
          <span className="text-2xl font-bold">Lend/Borrow</span>
        </div>
        <div className="space-y-1 pt-4">
          {/* <div className="text-sm text-gray-500">Lend/borrow health factor</div> */}
          <dt className="flex items-center gap-1.5 text-sm">
            Lend/borrow health factor
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="size-4" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="flex flex-col gap-2 pb-2">
                    <p>
                      Health factor is based off <b>price biased</b> and{' '}
                      <b>weighted</b> asset and liability values.
                    </p>
                    <div className="font-medium">
                      When your account health reaches 0% or below, you are
                      exposed to liquidation.
                    </div>
                    <p>The formula is:</p>
                    <p className="text-center text-sm italic">
                      {'(assets - liabilities) / (assets)'}
                    </p>
                    <p>Your math is:</p>
                    <p className="text-center text-sm italic">{`(${usdFormatter.format(
                      accountSummary.lendingAmountWithBiasAndWeighted,
                    )} - ${usdFormatter.format(
                      accountSummary.borrowingAmountWithBiasAndWeighted,
                    )}) / (${usdFormatter.format(
                      accountSummary.lendingAmountWithBiasAndWeighted,
                    )})`}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </dt>
          <div className="text-sm text-gray-500">
            Weighted lend: <span className="font-bold">{weightedLend}</span>
          </div>
          <div className="text-sm text-gray-500">
            Weighted borrow: <span className="font-bold">{weightedBorrow}</span>
          </div>
          <div className="text-sm text-gray-500">
            Net value: <span className="font-bold">{netValue}</span>
          </div>
          <div className="text-sm text-gray-500">
            Interest earned : Coming soon...
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <HealthProgressBar
          className="h-24 w-24"
          // health={'0.82'}
          health={percentFormatterDyn.format(parseFloat(points ?? '0') / 100)}
        />
      </div>
    </div>
  );
};

function HealthProgressBar({
  className,
  health,
}: {
  className?: string;
  health?: string;
}) {
  const [value, setValue] = React.useState(0);
  const [color, setColor] = React.useState('#75BA80'); // 默认绿色

  React.useEffect(() => {
    if (health) {
      const healthValue = parseFloat(health);
      if (healthValue >= 0 && healthValue <= 1) {
        setValue(healthValue * 100);
        if (healthValue < 0.2) {
          /*
          export function getInitHealthColor(health: number): string {
  if (health >= 0.5) {
    return '#75BA80'; // green color " : "#",
  } else if (health >= 0.25) {
    return '#b8b45f'; // yellow color
  } else {
    return '#CF6F6F'; // red color
  }
}
          */
          setColor(getInitHealthColor(healthValue));
        } else if (healthValue < 0.5) {
          setColor(getInitHealthColor(healthValue));
        } else {
          setColor(getInitHealthColor(healthValue));
        }
      }
    }
  }, [health]);

  return (
    <AnimatedCircularProgressBar
      max={100}
      min={0}
      value={value}
      gaugePrimaryColor={color}
      gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      className={className}
    />
  );
}
