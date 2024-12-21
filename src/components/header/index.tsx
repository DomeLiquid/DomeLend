'use client';

import { LangSwitcher } from '@/components/header/lang-switcher';
import { siteConfig } from '@/config/site';
import { ChevronDown, CircleUser, CircleX, LogOut, Plus } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Link } from '@/navigation';
import { ModeToggle } from '../themed-button';
import { DesktopNav } from './desktop-nav';
import { Button } from '@/components/ui/button';

import { signIn, signOut, useSession } from 'next-auth/react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '../ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
  getAccounts,
  listBalances,
  listBanks,
  newAccount,
} from '@/lib/actions';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Badge } from '../ui/badge';
import TabbedInterface from './tabs';
import { Account } from '@/types/account';
// import { useBanksStore } from '@/app/stores/BanksStore';
import { showToast } from '@/lib/utils';
import { useMrgnlendStore, useUiStore } from '@/app/stores';

const Header = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  // const accountStore = useAccountStore();
  // const bankStore = useBanksStore();
  const [selectedAccount, Accounts, setSelectedAccount, fetchMrgnlendState] =
    useMrgnlendStore((state) => [
      state.selectedAccount,
      state.Accounts,
      state.setSelectedAccount,
      state.fetchMrgnlendState,
    ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const setSelectedAccountFn = async (account: Account) => {
    // accountStore.setSelectedAccount(account);
    // const banks = await listBanks();
    // bankStore.setBanks(banks || []);

    // const balances = await listBalances(account.id);
    // bankStore.setBalances(balances || []);

    setIsOpen(false);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the 'md' breakpoint in Tailwind by default
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // useEffect(() => {
  //   const fetchAccounts = async () => {
  //     setIsLoading(true);
  //     try {
  //       const accounts = await getAccounts();
  //       accountStore.setAccounts(accounts || []);
  //       if (accounts && accounts.length > 0) {
  //         setSelectedAccount(accounts[0]);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching accounts:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchAccounts();
  // }, []);

  const handleNewAccount = async () => {
    setIsOpen(false); // 关闭 Popover
    try {
      await newAccount();
      showToast.success('Account created successfully');
      const accounts = await getAccounts();
      if (accounts && accounts.length > 0) {
        setSelectedAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Error creating new account:', error);
      showToast.error('Failed to create new account');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center ">
        <Sheet>
          <div className="flex items-center md:hidden">
            {session?.user ? (
              <SheetTrigger asChild>
                <Avatar className="h-10 w-10">
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
                  className="h-6 w-6 text-gray-500"
                  onClick={() => signIn()}
                />
              </div>
            )}
          </div>

          <Link
            href={'/lend'}
            aria-label={siteConfig.name}
            title={siteConfig.name}
            className="flex items-center gap-2 font-bold"
          >
            <Image
              alt={siteConfig.name}
              src="/logo.svg"
              className="hidden h-8 w-8 md:block"
              width={32}
              height={32}
            />
            <span className="">{siteConfig.name}</span>
          </Link>
          <DesktopNav className="hidden md:flex md:flex-1 md:justify-center" />

          <div className="mr-[60pt] flex flex-1 items-center justify-end space-x-4 md:mr-0">
            <div className="hidden md:block">
              {session?.user ? (
                <SheetTrigger asChild>
                  <Avatar className="h-10 w-10 bg-[#7e7b7d]">
                    <AvatarImage
                      src={session?.user?.image || ''}
                      alt="Avatar"
                      className="h-10 w-10 rounded-full"
                    />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                </SheetTrigger>
              ) : (
                <div>
                  <Button variant="outline" onClick={() => signIn()}>
                    Connect
                  </Button>
                </div>
              )}
            </div>
            {/* <ModeToggle /> */}
            {/* <LangSwitcher /> */}
          </div>

          <SheetContent side={isMobile ? 'left' : 'right'} className="w-full">
            <SheetHeader className="flex items-center justify-between pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session?.user.image || ''}
                      alt="Avatar"
                      className="h-10 w-10 rounded-full"
                    />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="bg-gray-100 text-lg font-semibold dark:bg-neutral-800"
                      >
                        {selectedAccount
                          ? `Account ${selectedAccount.index + 1}`
                          : 'Select your DomeFi account below.'}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[348px] bg-popover p-0">
                      <div className="p-4">
                        <h2 className="mb-2 text-xl font-bold">
                          Your accounts
                        </h2>
                        <p className="mb-4 text-sm text-muted-foreground">
                          Please select your DomeFi account below.
                        </p>
                        {isLoading ? (
                          <p>Loading...</p>
                        ) : (
                          Accounts &&
                          Accounts.map((account, index) => (
                            <PopoverClose asChild key={account.id}>
                              <div
                                className={`mb-2 flex items-center justify-between rounded-md p-2 ${
                                  account.id === selectedAccount?.id
                                    ? 'bg-accent'
                                    : ''
                                }`}
                                onClick={() => setSelectedAccount(account)}
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
                                    {account.accountFlags === 1
                                      ? 'Disabled'
                                      : 'Active'}
                                  </span>
                                </Badge>
                              </div>
                            </PopoverClose>
                          ))
                        )}
                        <Button
                          variant="outline"
                          className="mt-4 w-full"
                          onClick={handleNewAccount}
                        >
                          <Plus className="mr-2 h-4 w-4" /> New Account
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                  className="aspect-square rounded-full p-2"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="aspect-square rounded-full p-2"
                  >
                    <CircleX className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>

            <div className="p-4">
              <TabbedInterface />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* <MobileNav active={mobileNavActive} onActiveChange={setMobileNavActive} /> */}
    </header>
  );
};

export default Header;
