// import { TokenSymbol } from '@/components/token-item';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   TooltipContent,
//   Tooltip,
//   TooltipProvider,
//   TooltipTrigger,
// } from '@/components/ui/tooltip';
// import {
//   clampedNumeralFormatter,
//   percentFormatter,
//   percentFormatterDyn,
//   tokenPriceFormatter,
//   usdFormatter,
//   usdFormatterDyn,
// } from '@/lib';
// import { ListBanksResponseItem } from '@/types/account';
// import { Info } from 'lucide-react';
// import Image from 'next/image';

// interface GlobalPoolTableProps {
//   banks: ListBanksResponseItem[];
//   activeTab: string;
// }

// export const GlobalPoolTable: React.FC<GlobalPoolTableProps> = ({
//   banks,
//   activeTab,
// }) => {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="font-roboto text-lg">Global pool</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table className="font-lato text-sm">
//           <TableHeader>
//             <TableRow>
//               <TableHead className="pl-8 text-right text-xs md:pl-0">
//                 Asset
//               </TableHead>
//               <TableHead className="text-right text-xs">
//                 Price{' '}
//                 <CustomTooltip>
//                   <p className="text-sm">Realtime Price</p>
//                   <p>Powered by Mixin</p>
//                 </CustomTooltip>
//               </TableHead>
//               <TableHead className="text-right text-xs">
//                 <div className="flex items-center justify-end">
//                   APY
//                   {activeTab === 'lend' ? (
//                     <CustomTooltip>
//                       <p className="text-sm">APY</p>

//                       <p>
//                         What you&apos;ll earn on deposits over a year. This
//                         includes compounding.
//                       </p>
//                     </CustomTooltip>
//                   ) : (
//                     <CustomTooltip>
//                       <p className="text-sm">APY</p>

//                       <p>
//                         What you&apos;ll pay for your borrows over a year. This
//                         includes compounding.
//                       </p>
//                     </CustomTooltip>
//                   )}
//                 </div>
//               </TableHead>
//               <TableHead className="text-right text-xs">
//                 {activeTab === 'lend' ? (
//                   <div className="flex items-center justify-end">
//                     Weight
//                     <CustomTooltip>
//                       <p className="text-sm">Weight</p>
//                       <p>
//                         How much your assets count of collateral,relative to
//                         their USD value. The higher the weight, the more
//                         collateral your can borrow against it.
//                       </p>
//                     </CustomTooltip>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-end">
//                     TVL
//                     <CustomTooltip>
//                       <p className="text-sm">TVL</p>
//                       <p>
//                         How much your can borrow against your free collateral.
//                         The higher the LTV, the more you can borrow against your
//                         free collateral.
//                       </p>
//                     </CustomTooltip>
//                   </div>
//                 )}
//               </TableHead>
//               <TableHead className="text-right text-xs">
//                 {activeTab === 'lend' ? (
//                   <div className="flex items-center justify-end">
//                     Deposits
//                     <CustomTooltip>
//                       <p className="text-sm">Total deposits</p>
//                       <p>
//                         The domefi deposits for each asset. Everything is
//                         denominated in native tokens.
//                       </p>
//                     </CustomTooltip>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-end">
//                     Available
//                     <CustomTooltip>
//                       <p className="text-sm">Total available</p>
//                       <p>
//                         The amount of tokens available to borrow for each asset.
//                         Calculated as the minimum of the asset&apos;s borrow
//                         limit and available liquidity that has not yet been
//                         borrowed.
//                       </p>
//                     </CustomTooltip>
//                   </div>
//                 )}
//               </TableHead>
//               <TableHead className="text-right text-xs">
//                 {activeTab === 'lend' ? (
//                   <div className="flex items-center justify-end">
//                     Global limit
//                     <Info className="inline h-3 w-3" />
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-end">
//                     Total&nbsp;Borrow
//                     <Info className="inline h-3 w-3" />
//                   </div>
//                 )}
//               </TableHead>
//               <TableHead className="flex items-center justify-end text-right text-xs">
//                 Utilization <Info className="inline h-3 w-3" />
//               </TableHead>
//               <TableHead className="text-right"></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {banks &&
//               banks.map((bankAsset) => (
//                 <TableRow
//                   key={bankAsset.bank.id}
//                   className="transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
//                 >
//                   <TableCell className="text-right text-xs font-medium">
//                     <div className="flex items-center justify-end space-x-2">
//                       <TokenSymbol asset={bankAsset.asset} />
//                       <div className="flex flex-col items-end">
//                         <span>{bankAsset.asset.symbol}</span>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-right text-xs">
//                     <div className="flex items-center justify-end whitespace-nowrap">
//                       {tokenPriceFormatter(
//                         parseFloat(bankAsset.asset.price),
//                       )}
//                       <Image
//                         src={
//                           bankAsset.bank.oracleName === 'Mixin'
//                             ? '/mixin.png'
//                             : bankAsset.bank.oracleIconUrl
//                         }
//                         alt="Oracle Icon"
//                         width={16}
//                         height={16}
//                         className="ml-1 inline-block h-4 w-4"
//                       />
//                     </div>
//                   </TableCell>
//                   <TableCell
//                     className={`text-right text-xs ${activeTab === 'lend' ? 'text-green-400' : 'text-yellow-400'}`}
//                   >
//                     {activeTab === 'lend'
//                       ? `${percentFormatter.format(parseFloat(bankAsset.bank.leadingApr))}`
//                       : `${percentFormatter.format(parseFloat(bankAsset.bank.borrowingApr))}`}
//                   </TableCell>
//                   <TableCell className="text-right text-xs">
//                     {activeTab === 'lend'
//                       ? percentFormatterDyn.format(
//                           parseFloat(bankAsset.bank.bankConfig.assetWeightInit),
//                         )
//                       : percentFormatterDyn.format(
//                           1 /
//                             parseFloat(
//                               bankAsset.bank.bankConfig.liabilityWeightInit,
//                             ),
//                         )}
//                   </TableCell>
//                   <TableCell className="text-right text-xs">
//                     {activeTab === 'lend' ? (
//                       <>
//                         {clampedNumeralFormatter(
//                           parseFloat(bankAsset.bank.liquidityVault),
//                         )}
//                       </>
//                     ) : (
//                       <>
//                         {clampedNumeralFormatter(
//                           Math.min(
//                             parseFloat(bankAsset.bank.liquidityVault),
//                             parseFloat(
//                               bankAsset.bank.bankConfig.assetWeightInit,
//                             ) * parseFloat(bankAsset.bank.liquidityVault),
//                           ),
//                         )}
//                       </>
//                     )}
//                   </TableCell>
//                   <TableCell className="text-right text-xs">
//                     {activeTab === 'lend'
//                       ? clampedNumeralFormatter(
//                           parseFloat(bankAsset.bank.bankConfig.depositLimit),
//                         )
//                       : clampedNumeralFormatter(
//                           parseFloat(bankAsset.bank.bankConfig.liabilityLimit),
//                         )}
//                   </TableCell>
//                   <TableCell className="text-right text-xs">
//                     {percentFormatter.format(
//                       parseFloat(bankAsset.bank.utilizationRatio),
//                     )}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <Button variant="outline" className="text-xs">
//                       {activeTab === 'lend' ? 'Supply' : 'Borrow'}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// interface InfoTooltipProps {
//   className?: string;
//   children: React.ReactNode;
// }

// export const CustomTooltip: React.FC<InfoTooltipProps> = ({
//   className,
//   children,
// }) => {
//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <span className={`cursor-help ${className}`}>
//             <Info className="inline h-3 w-3" />
//           </span>
//         </TooltipTrigger>
//         <TooltipContent className="max-w-60 bg-neutral-50 text-left text-gray-800 dark:bg-neutral-800 dark:text-gray-200">
//           {children}
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );
// };
