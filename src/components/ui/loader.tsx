import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

type LoaderProps = {
  label?: string;
  className?: string;
  iconSize?: number;
};

export const Loader = ({
  label = 'Loading...',
  className,
  iconSize,
}: LoaderProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-muted-foreground',
        className,
      )}
    >
      <Loader2Icon className="animate-pulsate" size={iconSize} />
      <p>{label}</p>
    </div>
  );
};
