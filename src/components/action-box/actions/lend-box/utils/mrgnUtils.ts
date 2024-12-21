import { aprToApy, percentFormatter } from '@/lib';
import { Emissions, ExtendedBankInfo } from '@/lib/mrgnlend';
import { LendingModes } from '@/types/type';

export function computeBankRateRaw(
  bank: ExtendedBankInfo,
  lendingMode: LendingModes,
) {
  const isInLendingMode = lendingMode === LendingModes.LEND;

  const interestRate = isInLendingMode
    ? bank.info.state.lendingRate
    : bank.info.state.borrowingRate;
  const emissionRate = isInLendingMode
    ? bank.info.state.emissions == Emissions.Lending
      ? bank.info.state.emissionsRate
      : 0
    : bank.info.state.emissions == Emissions.Borrowing
      ? bank.info.state.emissionsRate
      : 0;

  const aprRate = interestRate + emissionRate;
  const apyRate = aprToApy(aprRate);

  return apyRate;
}

export function computeBankRate(
  bank: ExtendedBankInfo,
  lendingMode: LendingModes,
) {
  const apyRate = computeBankRateRaw(bank, lendingMode);
  return percentFormatter.format(apyRate);
}

export const formatAmount = (
  newAmount: string,
  maxAmount: number,
  bank: ExtendedBankInfo | null,
  numberFormater: Intl.NumberFormat,
) => {
  let formattedAmount: string, amount: number;
  // Remove commas from the formatted string
  const newAmountWithoutCommas = newAmount.replace(/,/g, '');
  let decimalPart = newAmountWithoutCommas.split('.')[1];

  if (
    (newAmount.endsWith(',') || newAmount.endsWith('.')) &&
    !newAmount.substring(0, newAmount.length - 1).includes('.')
  ) {
    amount = isNaN(Number.parseFloat(newAmountWithoutCommas))
      ? 0
      : Number.parseFloat(newAmountWithoutCommas);
    formattedAmount = numberFormater.format(amount).concat('.');
  } else {
    const isDecimalPartInvalid = isNaN(Number.parseFloat(decimalPart));
    if (!isDecimalPartInvalid) decimalPart = decimalPart.substring(0, 9);
    decimalPart = isDecimalPartInvalid
      ? ''
      : '.'.concat(
          Number.parseFloat('1'.concat(decimalPart)).toString().substring(1),
        );
    amount = isNaN(Number.parseFloat(newAmountWithoutCommas))
      ? 0
      : Number.parseFloat(newAmountWithoutCommas);
    formattedAmount = numberFormater
      .format(amount)
      .split('.')[0]
      .concat(decimalPart);
  }

  if (amount > maxAmount) {
    return numberFormater.format(maxAmount);
  } else {
    return formattedAmount;
  }
};
