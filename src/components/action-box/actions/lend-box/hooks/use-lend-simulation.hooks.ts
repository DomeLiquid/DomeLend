import React from 'react';

import { Account } from '@/types/account';
import {
  AccountSummary,
  ActionMethod,
  ActionType,
  ExtendedBankInfo,
} from '@/lib/mrgnlend';
import { usePrevious } from '@/hooks';
import {
  calculateActionPreview,
  SimulatedActionPreview,
} from '../utils/lend-simulation.utils';
// import { calculateLendingTransaction, calculateSummary, getSimulationResult } from "../utils";

/*
How lending action simulation works:
1) If the debounced amount differs from the previous amount, generate an action transaction (actionTxn).
2) If an actionTxn is generated, simulate that transaction.
3) Set the simulation result.
*/

type LendSimulationProps = {
  debouncedAmount: number;
  selectedAccount: Account | null;
  accountSummary?: AccountSummary;
  selectedBank: ExtendedBankInfo | null;
  lendMode: ActionType;
  simulationResult: SimulatedActionPreview | null;

  setSimulationResult: (result: SimulatedActionPreview | null) => void;
  setErrorMessage: (error: ActionMethod | null) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export function useLendSimulation({
  debouncedAmount,
  selectedAccount,
  accountSummary,
  selectedBank,
  lendMode,
  simulationResult,
  setSimulationResult,
  setErrorMessage,
  setIsLoading,
}: LendSimulationProps) {
  const [actionSummary, setActionSummary] =
    React.useState<SimulatedActionPreview | null>(null);

  const calculateSummary = React.useCallback(async () => {
    if (selectedAccount && selectedBank) {
      try {
        setIsLoading(true);
        const result = await calculateActionPreview({
          selectedAccount,
          bank: selectedBank,
          actionMode: lendMode,
          amount: debouncedAmount.toString(),
        });
        setActionSummary(result ?? null);
        setSimulationResult(result);
        setErrorMessage(null);
      } catch (error) {
        console.error('Error calculating action preview:', error);
        setActionSummary(null);
        setSimulationResult(null);
        setErrorMessage(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setActionSummary(null);
      setSimulationResult(null);
    }
  }, [
    selectedAccount,
    selectedBank,
    lendMode,
    debouncedAmount,
    setSimulationResult,
    setErrorMessage,
    setIsLoading,
  ]);

  // 初始化时调用一次
  React.useEffect(() => {
    calculateSummary();
  }, []); // 空依赖数组确保只在组件挂载时调用一次

  // 当相关依赖项变化时重新计算
  React.useEffect(() => {
    calculateSummary();
  }, [calculateSummary]);

  return {
    actionSummary,
    calculateSummary, // 返回这个函数，以便外部可以手动触发重新计算
  };
}

// export function useLendSimulation({
//   debouncedAmount,
//   selectedAccount,
//   accountSummary,
//   selectedBank,
//   lendMode,
//   simulationResult,
//   setSimulationResult,
//   setErrorMessage,
//   setIsLoading,
// }: LendSimulationProps) {
//   const [actionSummary, setActionSummary] =
//     React.useState<SimulatedActionPreview | null>(null);

//   React.useEffect(() => {
//     let isMounted = true;

//     const calculateSummary = async () => {
//       if (selectedAccount && selectedBank) {
//         try {
//           setIsLoading(true);
//           const result = await calculateActionPreview({
//             selectedAccount,
//             bank: selectedBank,
//             actionMode: lendMode,
//             amount: debouncedAmount.toString(),
//           });
//           if (isMounted) {
//             setActionSummary(result);
//             setSimulationResult(result);
//             setErrorMessage(null);
//           }
//         } catch (error) {
//           if (isMounted) {
//             console.error('Error calculating action preview:', error);
//             setActionSummary(null);
//             setSimulationResult(null);
//             setErrorMessage(null);
//           }
//         } finally {
//           if (isMounted) {
//             setIsLoading(false);
//           }
//         }
//       } else {
//         if (isMounted) {
//           setActionSummary(null);
//           setSimulationResult(null);
//         }
//       }
//     };

//     calculateSummary();

//     return () => {
//       isMounted = false;
//     };
//   }, [
//     selectedAccount,
//     selectedBank,
//     lendMode,
//     debouncedAmount,
//     setSimulationResult,
//     setErrorMessage,
//     setIsLoading,
//   ]);

//   return {
//     actionSummary,
//   };
// }
