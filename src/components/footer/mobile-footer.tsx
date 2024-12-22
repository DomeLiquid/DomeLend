'use client';

import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, usePathname } from '@/navigation';
import { navConfig } from '@/config/config';

const MobileFooter = ({
  className,
  user,
}: {
  className: string;
  user: any | null;
}) => {
  const pathname = usePathname();

  return (
    <div className={cn('fixed bottom-0 w-full md:hidden', className)}>
      <div className="flex h-16 items-center justify-between bg-gray-50 px-2 dark:bg-[#111111]">
        {navConfig.map((item) => {
          const isActive =
            pathname === item.link ||
            (pathname === '/' && item.name === 'Lend');
          return (
            <div key={item.link} className="flex flex-1 justify-center p-2">
              <Link
                href={item.link}
                className={cn(
                  'group flex flex-col items-center gap-2',
                  isActive && 'text-purple-500',
                )}
              >
                <item.icon className={cn('h-6 w-6 font-bold')} />
                <span className={cn('text-sm font-bold')}>{item.name}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileFooter;
