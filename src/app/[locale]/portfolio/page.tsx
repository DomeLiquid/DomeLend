'use client';

import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar';
import Particles from '@/components/magicui/particles';
import { PortfolioHeader, PortfolioUserStats } from '@/components/portfolio';
import { LendingPortfolio } from '@/components/portfolio/LendingPortfolio';
import { percentFormatterDyn, usdFormatter } from '@/lib';
import { getInitHealthColor } from '@/lib/utils';
import { Clock4Icon } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';

const Page = () => {
  return (
    <div className="w-full">
      <PortfolioHeader />

      {/* <PortfolioUserStats netValue={'100'} /> */}
      <LendingPortfolio />
    </div>
  );
};

export default Page;

// function Portfolio() {
//   const { theme } = useTheme();
//   const [color, setColor] = React.useState('#ffffff');

//   React.useEffect(() => {
//     setColor(theme === 'dark' ? '#ffffff' : '#000000');
//   }, [theme]);

//   return (
//     <div className="relative flex h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background">
//       <div className="flex flex-col items-center justify-center text-center">
//         <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text px-2 text-8xl font-bold leading-tight text-transparent dark:from-white dark:to-slate-900/10">
//           Portfolio
//         </span>
//         <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//           Manage your positions
//         </span>
//       </div>
//       <Particles
//         className="absolute inset-0 h-full w-full"
//         quantity={200}
//         ease={40}
//         color={color}
//         refresh
//       />
//     </div>
//   );
// }

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
