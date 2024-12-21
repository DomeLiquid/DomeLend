import { AccountSummary } from '@/lib/mrgnlend';
import { ExtendedBankInfo } from '@/lib/mrgnlend';
import { Account } from '@/types/account';

// error handling
export type RepayCollatBoxProps = {
  //   nativeSolBalance: number;
  // tokenAccountMap: TokenAccountMap;
  connected: boolean;

  //   DomeFiClient: DomeFiClient | null;
  selectedAccount: Account | null;
  banks: ExtendedBankInfo[];
  requestedBank?: ExtendedBankInfo | null;
  accountSummaryArg?: AccountSummary;

  isDialog?: boolean;

  onConnect?: () => void;
  onComplete?: () => void;
  captureEvent?: (event: string, properties?: Record<string, any>) => void;
};

export const RepayCollatBox = ({
  //   nativeSolBalance,
  connected,
  selectedAccount,
  banks,
  requestedBank,
  accountSummaryArg,
  isDialog,
  onConnect,
  onComplete,
  captureEvent,
}: RepayCollatBoxProps) => {
  return <div>RepayCollatBox</div>;
};
