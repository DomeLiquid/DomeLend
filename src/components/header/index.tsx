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
import { useHeaderState } from '@/hooks/useHeaderState';
import { MobileHeader } from './components/MobileHeader';
import { DesktopHeader } from './components/DesktopHeader';

const Header = () => {
  const {
    session,
    isOpen,
    isMobile,
    selectedAccount,
    accounts,
    isLoading,
    handleNewAccount,
    setIsOpen,
    setSelectedAccount,
  } = useHeaderState();

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {isMobile ? (
          <MobileHeader
            session={session}
            isOpen={isOpen}
            selectedAccount={selectedAccount}
            accounts={accounts}
            isLoading={isLoading}
            onNewAccount={handleNewAccount}
            onOpenChange={setIsOpen}
            onSelectAccount={setSelectedAccount}
          />
        ) : (
          <DesktopHeader
            session={session}
            isOpen={isOpen}
            selectedAccount={selectedAccount}
            accounts={accounts}
            isLoading={isLoading}
            onNewAccount={handleNewAccount}
            onOpenChange={setIsOpen}
            onSelectAccount={setSelectedAccount}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
