import { actionPreview } from '@/lib/actions';
import { AccountSummary, ExtendedBankInfo, ActionType } from '@/lib/mrgnlend';
import { Account } from '@/types/account';

export interface SimulatedActionPreview {
  health: string;
  liquidationPrice?: string | null;
  depositRate: string;
  borrowRate: string;
  positionAmount: string;
  availableCollateral: {
    ratio: string;
    amount: string;
  };
  // accountSummary?: AccountSummary;
}

// export interface ActionPreviewSimulation {
//   health: number;
//   liquidationPrice: number | null;
//   depositRate: number;
//   borrowRate: number;
//   positionAmount: number;
//   availableCollateral: {
//     ratio: number;
//     amount: number;
//   };
// }

export interface ActionPreview {
  simulationPreview: SimulatedActionPreview;
  currentPositionAmount: number;
  healthFactor: number;
  liquidationPrice?: number;
  poolSize: number;
  bankCap: number;
  //   priceImpactPct?: number;
  //   slippageBps?: number;
  //   platformFeeBps?: number;
}

export async function calculateActionPreview({
  selectedAccount,
  bank,
  actionMode,
  amount,
}: {
  selectedAccount: Account;
  bank: ExtendedBankInfo;
  actionMode: ActionType;
  amount: string;
}): Promise<SimulatedActionPreview | null> {
  try {
    const result = await actionPreview(
      selectedAccount.id,
      bank.bankId,
      amount,
      actionMode,
    );
    return result?.simulationPreview ?? null;
  } catch (error) {
    return null;
  }
}
