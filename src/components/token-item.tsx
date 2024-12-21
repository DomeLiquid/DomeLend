import { cn } from '@/lib/utils';
import { Asset } from '@/types/account';
import Image from 'next/image';

// token 展示图片组件
export const TokenSymbol = ({
  asset,
  className,
  coinIconClassName,
  chainIconClassName,
}: {
  asset: Asset;
  className?: string;
  coinIconClassName?: string;
  chainIconClassName?: string;
}) => {
  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <Image
        src={asset.iconUrl}
        alt={asset.symbol}
        width={32}
        height={32}
        className={cn('h-6 w-6 rounded-full', coinIconClassName)}
      />
      <Image
        src={asset.chain.iconUrl}
        alt={asset.chain.name}
        width={16}
        height={16}
        className={cn(
          'absolute bottom-0 right-0 h-3 w-3 rounded-full',
          chainIconClassName,
        )}
      />
    </div>
  );
};
