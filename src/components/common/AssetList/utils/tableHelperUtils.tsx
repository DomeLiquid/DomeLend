import {
  HeaderWrapper,
  getAssetCell,
  getAssetPriceCell,
  getAssetWeightCell,
  getBankCapCell,
  getDepositsCell,
  getRateCell,
  getUtilizationCell,
} from '../components';
import * as assetUtils from '.';
import { AccountSummary, ExtendedBankInfo } from '@/lib/mrgnlend';
import { Account } from '@/types/account';
import { createColumnHelper } from '@tanstack/react-table';

export interface AssetListModel {
  asset: assetUtils.AssetData;
  price: assetUtils.AssetPriceData;
  rate: assetUtils.RateData;
  weight: assetUtils.AssetWeightData;
  deposits: assetUtils.DepositsData;
  bankCap: assetUtils.BankCapData;
  utilization: assetUtils.UtilizationData;
  position: assetUtils.PositionData;
  action: React.JSX.Element;
}

export const makeData = (
  data: ExtendedBankInfo[],
  isInLendingMode: boolean,
  denominationUSD: boolean,
  Account: Account | null,
  accountSummary: AccountSummary,
  connected: boolean,
  fetchMrgnlendState: () => void,
) => {
  return data.map(
    (bank) =>
      ({
        asset: assetUtils.getAssetData(bank),
        price: assetUtils.getAssetPriceData(bank),
        rate: assetUtils.getRateData(bank, isInLendingMode),
        weight: assetUtils.getAssetWeightData(bank, isInLendingMode),
        deposits: assetUtils.getDepositsData(
          bank,
          isInLendingMode,
          denominationUSD,
        ),
        bankCap: assetUtils.getBankCapData(
          bank,
          isInLendingMode,
          denominationUSD,
        ),
        utilization: assetUtils.getUtilizationData(bank),
        position: assetUtils.getPositionData(
          bank,
          denominationUSD,
          isInLendingMode,
        ),
        action: assetUtils.getAction(
          Account!,
          accountSummary,
          bank,
          isInLendingMode,
          Account,
          connected,
          fetchMrgnlendState,
        ),
      }) as AssetListModel,
  );
};

export const generateColumns = (isInLendingMode: boolean) => {
  const columnHelper = createColumnHelper<AssetListModel>();

  const columns = [
    columnHelper.accessor('asset', {
      id: 'asset',
      enableResizing: false,
      size: 170,
      cell: (props) => getAssetCell(props.getValue()),
      header: (header) => (
        <HeaderWrapper header={header} align="left">
          Asset
        </HeaderWrapper>
      ),
      enableSorting: false,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('price', {
      id: 'price',
      enableResizing: false,
      size: 170,
      cell: (props) =>
        getAssetPriceCell({
          ...props.getValue(),
          isInLendingMode,
        }),
      header: (header) => (
        <HeaderWrapper
          header={header}
          infoTooltip={
            <div className="flex flex-col items-start gap-1 text-left">
              <h4 className="text-base">Realtime prices</h4>
              <span className="font-normal">Powered by Mixin.</span>
            </div>
          }
        >
          Price
        </HeaderWrapper>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        return rowA.original.price.assetPrice - rowB.original.price.assetPrice;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('rate', {
      id: 'rate',
      enableResizing: true,
      maxSize: 120,
      cell: (props) => getRateCell(props.getValue()),
      header: (header) => (
        <HeaderWrapper
          header={header}
          infoTooltip={
            <div className="flex flex-col items-start gap-1 text-left">
              <h4 className="text-base">APY</h4>
              <span>
                {isInLendingMode
                  ? "What you'll earn on deposits over a year. This includes compounding."
                  : "What you'll pay for your borrows over a year. This includes compounding."}
              </span>
            </div>
          }
        >
          APY
        </HeaderWrapper>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        return rowA.original.rate.rateAPY - rowB.original.rate.rateAPY;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('weight', {
      id: 'weight',
      cell: (props) => getAssetWeightCell(props.getValue()),
      header: (header) => (
        <HeaderWrapper
          header={header}
          infoTooltip={
            <div className="flex flex-col items-start gap-1 text-left">
              <h4 className="text-base">
                {isInLendingMode ? 'Weight' : 'LTV'}
              </h4>
              <span>
                {isInLendingMode
                  ? 'How much your assets count for collateral, relative to their USD value. The higher the weight, the more collateral you can borrow against it.'
                  : 'How much you can borrow against your free collateral. The higher the LTV, the more you can borrow against your free collateral.'}
              </span>
            </div>
          }
        >
          {isInLendingMode ? 'Weight' : 'LTV'}
        </HeaderWrapper>
      ),
      sortingFn: (rowA, rowB) => {
        return (
          rowA.original.weight.assetWeight - rowB.original.weight.assetWeight
        );
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('deposits', {
      id: 'deposits',
      cell: (props) => getDepositsCell(props.getValue()),
      header: (header) => (
        <HeaderWrapper
          header={header}
          infoTooltip={
            <div className="flex flex-col items-start gap-1 text-left">
              <h4 className="whitespace-nowrap text-base">
                {isInLendingMode ? 'Total deposits' : 'Total available'}
              </h4>
              <span>
                {isInLendingMode
                  ? 'Total DomeFi deposits for each asset. Everything is denominated in native tokens.'
                  : "The amount of tokens available to borrow for each asset. Calculated as the minimum of the asset's borrow limit and available liquidity that has not yet been borrowed."}
              </span>
            </div>
          }
        >
          {isInLendingMode ? 'Deposits' : 'Available'}
        </HeaderWrapper>
      ),
      sortingFn: (rowA, rowB) => {
        const bankAInfo = rowA.original.bankCap.bank;
        const bankBInfo = rowB.original.bankCap.bank;
        const tvlA =
          bankAInfo.info.state.availableLiquidity * bankAInfo.token.price;
        const tvlB =
          bankBInfo.info.state.availableLiquidity * bankBInfo.token.price;

        return tvlA - tvlB;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('bankCap', {
      id: 'bankCap',
      cell: (props) => getBankCapCell(props.getValue()),
      header: (header) => (
        <HeaderWrapper
          header={header}
          infoTooltip={
            isInLendingMode ? (
              <div className="flex flex-col items-start gap-1 text-left">
                <h4 className="text-base">Global deposit cap</h4>
                Each DomeFi pool has global deposit and borrow limits, also
                known as caps. This is the total amount that all users combined
                can deposit or borrow of a given token.
              </div>
            ) : undefined
          }
        >
          <span className="whitespace-nowrap">
            {isInLendingMode ? 'Global limit' : 'Total Borrows'}
          </span>
        </HeaderWrapper>
      ),
      sortingFn: (rowA, rowB) => {
        return rowA.original.bankCap.bankCap - rowB.original.bankCap.bankCap;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('utilization', {
      id: 'utilization',
      cell: (props) => getUtilizationCell(props.getValue()),
      header: (header) => (
        <HeaderWrapper
          header={header}
          infoTooltip={
            <div className="flex flex-col items-start gap-1 text-left">
              <h4 className="text-base">Pool utilization</h4>
              What percentage of supplied tokens have been borrowed. This helps
              determine interest rates. This is not based on the global pool
              limits, which can limit utilization.
            </div>
          }
        >
          Utilization
        </HeaderWrapper>
      ),
      sortingFn: (rowA, rowB) => {
        return (
          rowA.original.utilization.utilization -
          rowB.original.utilization.utilization
        );
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('action', {
      id: 'action',
      header: () => <></>,
      cell: (props) => props.getValue(),
      footer: (props) => props.column.id,
    }),
  ];

  return columns;
};
