import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useMrgnlendStore } from '@/app/stores';
import { getAccounts } from '@/lib/actions';
import { showToast } from '@/lib/utils';
import { Account } from '@/types/account';

export const useHeaderState = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedAccount, accounts, setSelectedAccount] = useMrgnlendStore(
    (state) => [
      state.selectedAccount,
      state.Accounts,
      state.setSelectedAccount,
    ]
  );

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNewAccount = async () => {
    setIsOpen(false);
    try {
      const newAccounts = await getAccounts();
      if (newAccounts && newAccounts.length > 0) {
        setSelectedAccount(newAccounts[0]);
        showToast.success('Account created successfully');
      }
    } catch (error) {
      console.error('Error creating new account:', error);
      showToast.error('Failed to create new account');
    }
  };

  return {
    session,
    isOpen,
    isMobile,
    selectedAccount,
    accounts,
    isLoading,
    handleNewAccount,
    setIsOpen,
    setSelectedAccount,
  };
};
