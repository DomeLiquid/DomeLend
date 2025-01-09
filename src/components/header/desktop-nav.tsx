'use client';

import { navConfig } from '@/config/config';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';

interface DesktopNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DesktopNav({ className, ...props }: DesktopNavProps) {
  const pathname = usePathname();
  const t = useTranslations('Header');
  return (
    <div className={className} {...props}>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {navConfig.map((navItem, index) => {
          return (
            <Link
              key={navItem.name}
              href={navItem.link}
              prefetch={false}
              className={cn(
                'relative transition-colors hover:text-foreground/80 ',
                pathname === navItem.link ||
                  (pathname === '/' && navItem.name === 'Lend')
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-purple-500'
                  : 'text-foreground',
                'hover:after:duration-2000 hover:after:absolute hover:after:bottom-0 hover:after:left-1/2 hover:hover:after:left-0 hover:after:h-[2px] hover:after:w-0 hover:hover:after:w-full hover:after:bg-purple-500 hover:after:transition-all hover:after:ease-in-out',
              )}
            >
              {t(`${navItem.name}`)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
