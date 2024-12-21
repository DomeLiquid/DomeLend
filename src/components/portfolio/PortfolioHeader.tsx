import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Particles from "../magicui/particles";

export function PortfolioHeader() {
  const { theme } = useTheme();
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    setColor(theme === 'dark' ? '#ffffff' : '#000000');
  }, [theme]);

  return (
    <div className="relative flex h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background">
      <div className="flex flex-col items-center justify-center text-center">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-8xl font-bold leading-tight text-transparent dark:from-white dark:to-slate-900/10">
          Portfolio
        </span>
        <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage your positions
        </span>
      </div>
      <Particles
        className="absolute inset-0 h-full w-full"
        quantity={200}
        ease={40}
        color={color}
        refresh
      />
    </div>
  );
}
