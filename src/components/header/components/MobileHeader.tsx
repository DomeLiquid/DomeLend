import { Session } from 'next-auth';
import { Account } from '@/types/account';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, CircleUser, CircleX, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signIn, signOut } from 'next-auth/react';
import HeaderTabs from '../HeaderTabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import TabbedInterface from '../tabs';
import { useState } from 'react';
import { LangSwitcher } from '../lang-switcher';
import { ModeToggle } from '@/components/themed-button';

interface MobileHeaderProps {
  session: Session | null;
  isOpen: boolean;
  selectedAccount: Account | null;
  accounts: Account[];
  isLoading: boolean;
  onNewAccount: () => Promise<void>;
  onOpenChange: (open: boolean) => void;
  onSelectAccount: (account: Account) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  session,
  isOpen,
  selectedAccount,
  accounts,
  isLoading,
  onNewAccount,
  onOpenChange,
  onSelectAccount,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <div className="relative flex w-full items-center md:hidden">
          <div>
            {session?.user ? (
              <SheetTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage
                    src={session?.user?.image || ''}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full"
                  />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </SheetTrigger>
            ) : (
              <div className="mr-2">
                <CircleUser
                  className="h-6 w-6 cursor-pointer text-gray-500"
                  onClick={() => signIn()}
                />
              </div>
            )}
          </div>

          <div className="flex w-full flex-1 justify-center pr-10">
            <HeaderTabs />
          </div>
        </div>

        <SheetContent side="left" className="w-full">
          <SheetHeader className="flex items-center justify-between pt-4">
            <div className="flex w-full items-center justify-between px-2">
              {/* Avatar in Header */}
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session?.user?.image || ''}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full"
                  />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </div>
              {/* Logout and Close Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                  className="aspect-square rounded-full p-2"
                >
                  <LogOut className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  className="aspect-square rounded-full p-2"
                  onClick={() => setSheetOpen(false)}
                >
                  <CircleX className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Account Selection */}
          <div className="mt-6 px-4">
            <Popover open={isOpen} onOpenChange={onOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full bg-gray-100 text-lg font-semibold dark:bg-neutral-800"
                >
                  {selectedAccount
                    ? `Account ${selectedAccount.index + 1}`
                    : 'Select your DomeFi account'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-popover p-0">
                <div className="p-4">
                  <h2 className="mb-2 text-xl font-bold">Your accounts</h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Please select your DomeFi account below.
                  </p>
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    accounts?.map((account, index) => (
                      <div
                        key={account.id}
                        className={`mb-2 flex cursor-pointer items-center justify-between rounded-md p-2 ${
                          account.id === selectedAccount?.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => onSelectAccount(account)}
                      >
                        <span className="text-sm font-medium">
                          Account {index + 1}
                        </span>
                        <span className="mx-2 text-xs text-muted-foreground">
                          {account.id.slice(0, 8)}...
                          {account.id.slice(-4)}
                        </span>
                        <Badge
                          variant={
                            account.accountFlags === 1
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          <span className="text-xs">
                            {account.accountFlags === 1 ? 'Disabled' : 'Active'}
                          </span>
                        </Badge>
                      </div>
                    ))
                  )}
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={onNewAccount}
                    disabled
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Account
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Tabbed Interface */}
          <div className="mt-6">
            <TabbedInterface setSheetOpen={setSheetOpen} />
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <LangSwitcher />
            {/* <ModeToggle /> */}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
