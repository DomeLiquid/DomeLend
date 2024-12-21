import React from 'react';

import { ActionType, ActiveBankInfo, ExtendedBankInfo } from '@/lib/mrgnlend';
import { useAssetItemData } from '@/hooks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { TokenSymbol } from '../token-item';
import { cn } from '@/lib/utils';
import { clampedNumeralFormatter, numeralFormatter, usdFormatter } from '@/lib';
import { AlertTriangle } from 'lucide-react';
import { useMrgnlendStore, useUiStore } from '@/app/stores';
import { Button } from '../ui/button';
import { ActionBox } from '../action-box/action-box';
import { Skeleton } from '../ui/skeleton';
import { Account } from '@/types/account';

interface PortfolioAssetCardProps {
  selectedAccount: Account | null;
  bank: ActiveBankInfo;
  isInLendingMode: boolean;
  isBorrower?: boolean;
}

export const PortfolioAssetCard = ({
  selectedAccount,
  bank,
  isInLendingMode,
  isBorrower = true,
}: PortfolioAssetCardProps) => {
  const { rateAP } = useAssetItemData({ bank, isInLendingMode });

  const isIsolated = React.useMemo(() => bank.info.state.isIsolated, [bank]);

  const isUserPositionPoorHealth = React.useMemo(() => {
    if (
      !bank ||
      !bank?.balanceWithLendingPosition?.lendingPosition?.liquidationPrice
    ) {
      return false;
    }

    if (
      bank?.balanceWithLendingPosition?.lendingPosition?.liquidationPrice <= 0
    ) {
      return false;
    }

    const alertRange = 0.05;

    if (bank.balanceWithLendingPosition.lendingPosition.isLending) {
      return (
        bank.token.price <
        bank.balanceWithLendingPosition.lendingPosition.liquidationPrice +
          bank.balanceWithLendingPosition.lendingPosition.liquidationPrice *
            alertRange
      );
    } else {
      return (
        bank.token.price >
        bank.balanceWithLendingPosition.lendingPosition.liquidationPrice -
          bank.balanceWithLendingPosition.lendingPosition.liquidationPrice *
            alertRange
      );
    }
  }, [bank]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="key-1"
        className="rounded-xl bg-background-gray px-3 transition data-[state=closed]:hover:bg-background-gray-light"
      >
        <AccordionTrigger className="py-3 outline-none hover:no-underline [&[data-state=open]>div>div>#health-label]:mb-[-24px] [&[data-state=open]>div>div>#health-label]:opacity-0">
          <div className="w-full space-y-1 ">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex gap-3 text-left">
                <div className="flex items-center">
                  <TokenSymbol asset={bank.token} />
                </div>
                <dl>
                  <dt className="text-lg font-medium">{bank.token.symbol}</dt>
                  <dd
                    className={cn(
                      'text-sm font-normal',
                      isInLendingMode ? 'text-success' : 'text-warning',
                    )}
                  >
                    {rateAP.concat(...[' ', 'APY'])}
                  </dd>
                </dl>
              </div>
              <div className="mr-2 text-lg font-medium">
                {bank.balanceWithLendingPosition.lendingPosition?.amount !==
                  undefined &&
                bank.balanceWithLendingPosition.lendingPosition.amount >
                  0.00000001
                  ? `${clampedNumeralFormatter(
                      bank.balanceWithLendingPosition.lendingPosition.amount,
                    )} ${bank.token.symbol}`
                  : '-'}
              </div>
            </div>
            <div className="flex w-full flex-row gap-2">
              {isIsolated && (
                <div className="mt-4 flex w-fit items-center rounded-3xl bg-muted px-3 py-1 text-xs text-muted-foreground">
                  <span>Isolated pool</span>
                </div>
              )}
              {isUserPositionPoorHealth && isBorrower && (
                <div
                  id="health-label"
                  className={cn(
                    'mt-4 flex w-fit items-center rounded-3xl bg-destructive px-3 py-1 text-xs text-destructive-foreground',
                    'gap-1.5 transition-all duration-500 ease-in-out',
                  )}
                >
                  <AlertTriangle />
                  <span>Liquidation risk</span>
                </div>
              )}
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent
          className="flex flex-col"
          //   contentClassName="[&[data-state=open]>div>#health-label]:opacity-100"
        >
          {isUserPositionPoorHealth && isBorrower && (
            <div
              id="health-label"
              className="flex w-full flex-row gap-2 rounded-xl bg-destructive p-2.5 text-sm text-destructive-foreground"
            >
              <AlertTriangle width={'16px'} height={'16px'} />
              <div className="flex flex-col">
                <span>Liquidation risk</span>
                <p>
                  You need to add more collateral in order to sustain this
                  position
                </p>
              </div>
            </div>
          )}
          <div className="rounded-lg bg-background/60 px-4 py-3">
            <dl className="grid grid-cols-2 gap-y-0.5">
              <dt className="text-muted-foreground">USD value</dt>
              <dd className="text-right text-white">
                {bank.balanceWithLendingPosition.lendingPosition?.usdValue !==
                undefined
                  ? usdFormatter.format(
                      bank.balanceWithLendingPosition.lendingPosition.usdValue,
                    )
                  : '-'}
              </dd>
              <dt className="text-muted-foreground">Current price</dt>
              <dd className="text-right text-white">
                {usdFormatter.format(bank.token.price)}
              </dd>
              {bank.balanceWithLendingPosition.lendingPosition
                ?.liquidationPrice &&
                bank.balanceWithLendingPosition.lendingPosition
                  .liquidationPrice > 0 && (
                  <>
                    <dt className="text-muted-foreground">Liquidation price</dt>
                    <dd
                      className={cn(
                        'flex items-center justify-end gap-1',
                        isUserPositionPoorHealth ? 'text-error' : 'text-white',
                      )}
                    >
                      {isUserPositionPoorHealth && (
                        <AlertTriangle width={'16px'} height={'16px'} />
                      )}
                      {usdFormatter.format(
                        bank.balanceWithLendingPosition.lendingPosition
                          .liquidationPrice,
                      )}
                    </dd>
                  </>
                )}
            </dl>
          </div>
          <div className="flex w-full gap-3">
            <PortfolioAction
              selectedAccount={selectedAccount}
              requestedBank={bank}
              buttonVariant="outline-dark"
              requestedAction={
                isInLendingMode ? ActionType.Withdraw : ActionType.Repay
              }
            />
            <PortfolioAction
              selectedAccount={selectedAccount}
              requestedBank={bank}
              requestedAction={
                isInLendingMode ? ActionType.Deposit : ActionType.Borrow
              }
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const PortfolioAction = ({
  selectedAccount,
  requestedBank,
  requestedAction,
  buttonVariant = 'outline',
}: {
  selectedAccount: Account | null;
  requestedBank: ExtendedBankInfo | null;
  requestedAction: ActionType;
  buttonVariant?: 'outline' | 'outline-dark';
}) => {
  //   const { walletContextState, connected } = useWallet();
  const [connected] = useUiStore((state) => [state.connected]);
  //   const [setIsWalletAuthDialogOpen] = useUiStore((state) => [
  //     state.setIsWalletAuthDialogOpen,
  //   ]);
  const [fetchMrgnlendState] = useMrgnlendStore((state) => [
    state.fetchMrgnlendState,
  ]);
  //   const isDust = React.useMemo(
  //     () => requestedBank?.isActive && requestedBank?.position.isDust,
  //     [requestedBank],
  //   );

  const buttonText = React.useMemo(() => {
    switch (requestedAction) {
      case ActionType.Deposit:
        return 'Supply more';
      case ActionType.Borrow:
        return 'Borrow more';
      case ActionType.Repay:
        return 'Repay';
      case ActionType.Withdraw:
        return 'Withdraw';
      default:
        return '';
    }
  }, [requestedAction]);

  if (requestedAction !== ActionType.Repay) {
    return (
      <ActionBox.Lend
        useProvider={true}
        lendProps={{
          requestedLendType: requestedAction,
          requestedBank: requestedBank ?? undefined,
          selectedAccount: selectedAccount,
          //   walletContextState: walletContextState,
          connected: connected,

          //   captureEvent: (event, properties) => {
          //     capture(event, properties);
          //   },
          onComplete: () => {
            fetchMrgnlendState();
          },
          //   onConnect: () => setIsWalletAuthDialogOpen(true),
        }}
        isDialog={true}
        dialogProps={{
          trigger: (
            <Button
              className="h-12 flex-1"
              variant={
                buttonVariant === 'outline-dark' ? 'outline' : buttonVariant
              }
            >
              {buttonText}
            </Button>
          ),
          title: `${requestedAction} ${requestedBank?.token.symbol}`,
        }}
      />
    );
  } else {
    return (
      <ActionBox.Repay
        useProvider={true}
        repayProps={{
          requestedBank: requestedBank,
          selectedAccount: selectedAccount,
          //   walletContextState: walletContextState,
          connected: connected,
          //   captureEvent: (event, properties) => {
          //     capture(event, properties);
          //   },
          onComplete: () => {
            fetchMrgnlendState();
          },
          //   onConnect: () => setIsWalletAuthDialogOpen(true),
        }}
        isDialog={true}
        dialogProps={{
          trigger: (
            <Button
              className="h-12 flex-1"
              variant={
                buttonVariant === 'outline-dark' ? 'outline' : buttonVariant
              }
            >
              {buttonText}
            </Button>
          ),
          title: `${requestedAction} ${requestedBank?.token.symbol}`,
        }}
      />
    );
  }
};

export const PortfolioAssetCardSkeleton = () => {
  return (
    <div className="flex w-full items-center justify-between gap-2 p-3">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[50px]" />
          <Skeleton className="h-4 w-[65px]" />
        </div>
      </div>
      <Skeleton className="h-6 w-[80px] " />
    </div>
  );
};
