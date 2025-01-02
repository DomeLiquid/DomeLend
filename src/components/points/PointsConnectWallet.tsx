import React from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export const PointsConnectWallet = () => {
  return (
    <div className="mx-auto mt-8 w-full max-w-[800px] rounded-xl bg-background-gray-dark p-4 md:mt-0">
      <div className="flex w-full flex-col items-center justify-evenly gap-4 rounded-xl p-2 text-center font-aeonik text-base font-[400] text-white">
        <h2 className="text-2xl font-medium">Connect to access your points</h2>
        <Button variant="outline" onClick={() => signIn()}>
          Connect
        </Button>
      </div>
    </div>
  );
};
