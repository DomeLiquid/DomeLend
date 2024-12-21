import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks';
import { ExtendedBankInfo } from '@/lib/mrgnlend';
import { Command, CommandInput, CommandList } from '@/components/ui/command';
import { X } from 'lucide-react';

type BankListCommandProps = {
  selectedBank: ExtendedBankInfo | null;
  onSetSearchQuery: (search: string) => void;
  onClose: () => void;
  children: React.ReactNode;
};

export const BankListCommand = ({
  selectedBank,
  onSetSearchQuery,
  onClose,
  children,
}: BankListCommandProps) => {
  const isMobile = useIsMobile();
  return (
    <>
      <Command
        className="bg-background-gray relative"
        shouldFilter={false}
        value={selectedBank?.bankId?.toString().toLowerCase() ?? ''}
      >
        <CommandInput
          placeholder="Search token..."
          wrapperClassName="fixed mx-2 lg:mx-0 bg-background-gray w-[calc(100%-30px)] px-4 lg:pl-3 border rounded-lg border-background-gray-light z-40 flex justify-between"
          className="h-12"
          autoFocus={true}
          onValueChange={(value: string) => onSetSearchQuery(value)}
        />
        <button
          onClick={() => onClose()}
          className={cn(
            'fixed z-50',
            isMobile ? 'right-4 top-9' : 'right-6 top-8',
          )}
        >
          <X size={18} className="text-white/50" />
        </button>
        <CommandList className="mt-[60px] overflow-auto">
          {children}
        </CommandList>
      </Command>
    </>
  );
};
