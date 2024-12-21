import { useMemo } from 'react';

import { ActiveBankInfo, Emissions } from '@/lib/mrgnlend';
import { aprToApy, percentFormatter } from '@/lib';

export function useAssetItemData({
  bank,
  isInLendingMode,
}: {
  bank: ActiveBankInfo;
  isInLendingMode: boolean;
}) {
  const rateAPR = useMemo(() => {
    if (!bank?.info?.state) return 0;
    const { lendingRate, borrowingRate, emissions, emissionsRate } =
      bank.info.state;

    const interestRate = isInLendingMode ? lendingRate : borrowingRate;
    const emissionRate = isInLendingMode
      ? emissions == Emissions.Lending
        ? emissionsRate
        : 0
      : emissions == Emissions.Borrowing
        ? emissionsRate
        : 0;

    return interestRate + emissionRate;
  }, [isInLendingMode, bank?.info?.state]);

  const rateAPY = useMemo(() => {
    return aprToApy(rateAPR);
  }, [rateAPR]);

  const rateAP = useMemo(() => percentFormatter.format(rateAPY), [rateAPY]);

  const assetWeight = useMemo(() => {
    if (!bank?.info?.bankConfig) {
      return '-';
    }
    const assetWeightInit = parseFloat(
      bank.info.bankConfig.assetWeightInit.toString(),
    );

    if (assetWeightInit <= 0) {
      return '-';
    }
    return isInLendingMode
      ? (assetWeightInit * 100).toFixed(0) + '%'
      : (
          (1 /
            parseFloat(bank.info.bankConfig.liabilityWeightInit.toString())) *
          100
        ).toFixed(0) + '%';
  }, [bank?.info?.bankConfig, isInLendingMode]);

  const bankCap = useMemo(() => {
    if (!bank?.info?.bankConfig) return 0;
    return isInLendingMode
      ? parseFloat(bank.info.bankConfig.depositLimit.toString())
      : parseFloat(bank.info.bankConfig.liabilityLimit.toString());
  }, [isInLendingMode, bank?.info?.bankConfig]);

  const isBankFilled = useMemo(() => {
    if (!bank?.info?.state) return false;
    return (
      (isInLendingMode
        ? bank.info.state.totalDeposits
        : bank.info.state.totalBorrows) >=
      bankCap * 0.99999
    );
  }, [bankCap, isInLendingMode, bank?.info?.state]);
  const isBankHigh = useMemo(() => {
    if (!bank?.info?.state) return false;
    return (
      (isInLendingMode
        ? bank.info.state.totalDeposits
        : bank.info.state.totalBorrows) >=
      bankCap * 0.9
    );
  }, [bankCap, isInLendingMode, bank?.info?.state]);

  return { rateAP, rateAPY, assetWeight, bankCap, isBankFilled, isBankHigh };
}
