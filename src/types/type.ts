export enum LendingModes {
  LEND = 'lend',
  BORROW = 'borrow',
}

export enum PoolTypes {
  ALL = 'all',
  ISOLATED = 'isolated',
  STABLE = 'stable',
}

export type SortAssetOption = {
  label: string;
  borrowLabel?: string;
  value: SortType;
  field: 'APY' | 'TVL';
  direction: sortDirection;
};

export enum sortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum SortType {
  APY_ASC = 'APY_ASC',
  APY_DESC = 'APY_DESC',
  TVL_ASC = 'TVL_ASC',
  TVL_DESC = 'TVL_DESC',
}
