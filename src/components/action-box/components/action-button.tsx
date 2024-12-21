import { Button } from '@/components/ui/button';
import { ActionType } from '@/lib/mrgnlend';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

type ActionButtonProps = {
  isLoading: boolean;
  isEnabled: boolean;
  connected: boolean;
  buttonLabel: ActionType;
  errorMessage?: string;
  handleAction: () => void;
  handleConnect: () => void;
};

const getButtonText = (
  buttonLabel: ActionType,
  isLoading: boolean,
  connected: boolean,
) => {
  if (!connected) return 'Connect Wallet';
  if (isLoading) return 'Processing...';

  switch (buttonLabel) {
    case ActionType.Deposit:
      return 'Deposit';
    case ActionType.Withdraw:
      return 'Withdraw';
    case ActionType.Borrow:
      return 'Borrow';
    case ActionType.Repay:
      return 'Repay';
    default:
      return 'Submit';
  }
};

const getButtonVariant = (
  buttonLabel: ActionType,
  isEnabled: boolean,
  errorMessage?: string,
) => {
  if (errorMessage || !isEnabled) return 'secondary';

  switch (buttonLabel) {
    case ActionType.Deposit:
    case ActionType.Withdraw:
      return 'default';
    case ActionType.Borrow:
      return 'destructive';
    case ActionType.Repay:
      return 'outline';
    default:
      return 'default';
  }
};

export const ActionButton = ({
  isLoading,
  isEnabled,
  connected,
  buttonLabel,
  errorMessage,
  handleAction,
  handleConnect,
}: ActionButtonProps) => {
  const buttonText = React.useMemo(
    () => getButtonText(buttonLabel, isLoading, connected),
    [buttonLabel, isLoading, connected],
  );

  const buttonVariant = React.useMemo(
    () => getButtonVariant(buttonLabel, isEnabled, errorMessage),
    [buttonLabel, isEnabled, errorMessage],
  );

  return (
    <div className="flex flex-col items-center">
      <Button
        variant={buttonVariant}
        disabled={!isEnabled || isLoading || !!errorMessage}
        onClick={connected ? handleAction : handleConnect}
        className={cn(
          'relative w-full rounded-lg py-3 shadow-md',
          errorMessage && 'cursor-not-allowed opacity-50',
        )}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {buttonText}
      </Button>

      <div className="w-full text-center text-xs pt-2">
        {errorMessage && (
          <span className="mt-2 w-full rounded-md border border-red-300 bg-red-100 text-xs text-destructive">
            {errorMessage}
          </span>
        )}
      </div>
    </div>
  );
};
