import { cn } from '@/lib/utils';
import { MessageCircleQuestion } from 'lucide-react';

const DesktopFooter = ({
  className,
  user,
}: {
  className: string;
  user: any | null;
}) => {
  return (
    <div
      className={cn(
        'hidden md:block',
        'dark:bg-black-100 bg-gray-50 dark:bg-[#0F1111]',
        className,
        'border-t border-border/20',
        'fixed bottom-0 h-8 w-full', // 加宽footer的宽度
      )}
    >
      <div className="flex h-full items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-500">
            help & support
          </span>
        </div>

        <div className="text-gray-500">
          <MessageCircleQuestion className="h-4 w-4 font-bold" />
        </div>
      </div>
    </div>
  );
};

export default DesktopFooter;
