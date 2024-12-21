import { Button } from '@/components/ui/button';
import { Loader2, LoaderCircle } from 'lucide-react';
import React from 'react';

type ActionButtonProps = {
  isLoading: boolean;
  isEnabled: boolean;
  buttonLabel: string;
  loaderType?: 'INFINITE' | 'DEFAULT';
  connected?: boolean;
  errorMessage?: string;
  handleAction: () => void;
  handleConnect: () => void;
};

export const ActionButton = ({
  isLoading,
  isEnabled,
  buttonLabel,
  loaderType = 'DEFAULT',
  connected = false,
  errorMessage,
  handleAction,
  handleConnect,
}: ActionButtonProps) => {
  const Loader = React.useMemo(() => {
    switch (loaderType) {
      case 'DEFAULT':
        return Loader2;
      case 'INFINITE':
        return LoaderCircle;
      default:
        return Loader2;
    }
  }, [loaderType]);

  if (!connected) {
    return (
      <Button className="w-full py-5" onClick={() => handleConnect()}>
        Sign in
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        disabled={isLoading || !isEnabled || !!errorMessage}
        className="w-full py-5"
        variant={errorMessage ? "secondary" : "default"}
        onClick={handleAction}
      >
        {isLoading ? <Loader className="animate-spin" /> : buttonLabel}
      </Button>
      {errorMessage && (
        <span className="absolute bottom-[-24px] left-0 text-xs text-destructive">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
