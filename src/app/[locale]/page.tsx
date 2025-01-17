import Header from '@/components/header';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Header');

  return (
    <>
      <main className="mt-24 flex items-center justify-center">
        <div className="container flex max-w-[64rem] flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
            {/* {t('title')} */}
          </h1>

          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {/* {t('description')} */}
          </p>

          <div className="flex gap-2">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              className={cn(buttonVariants({ size: 'default' }))}
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
