import { cn } from '@/lib/utils';

interface ActionStatItemProps {
  label: string;
  classNames?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const ActionStatItem = ({
  label,
  classNames,
  children,
  style,
}: ActionStatItemProps) => {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          'flex items-center justify-end gap-2 text-right',
          classNames,
        )}
        style={style}
      >
        {children}
      </dd>
    </>
  );
};
