import { Emissions } from '@/lib/mrgnlend';
import { ExtendedBankInfo } from '@/lib/mrgnlend';

export enum sortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const sortApRate = (
  banks: ExtendedBankInfo[],
  isInLendingMode: boolean,
  direction: sortDirection,
) => {
  return banks.sort((a, b) => {
    const apRateA =
      (isInLendingMode
        ? a.info.state.lendingRate
        : a.info.state.borrowingRate) +
      (isInLendingMode && a.info.state.emissions == Emissions.Lending
        ? a.info.state.emissionsRate
        : 0) +
      (!isInLendingMode && a.info.state.emissions == Emissions.Borrowing
        ? a.info.state.emissionsRate
        : 0);

    const apRateB =
      (isInLendingMode
        ? b.info.state.lendingRate
        : b.info.state.borrowingRate) +
      (isInLendingMode && b.info.state.emissions == Emissions.Lending
        ? b.info.state.emissionsRate
        : 0) +
      (!isInLendingMode && b.info.state.emissions == Emissions.Borrowing
        ? b.info.state.emissionsRate
        : 0);

    if (direction === 'ASC') {
      return apRateA > apRateB ? 1 : -1;
    } else {
      return apRateA > apRateB ? -1 : 1;
    }
  });
};

export const sortTvl = (
  banks: ExtendedBankInfo[],
  direction: sortDirection,
) => {
  return banks.sort((a, b) => {
    const tvlA = a.token.price * parseFloat(a.info.liquidityVault);
    const tvlB = b.token.price * parseFloat(b.info.liquidityVault);

    if (direction === 'ASC') {
      return tvlA > tvlB ? 1 : -1;
    } else {
      return tvlA > tvlB ? -1 : 1;
    }
  });
};
