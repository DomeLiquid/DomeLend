import { PointsInfo, UserPointsData } from '@/lib/points';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconLoader,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconX,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@uidotdev/usehooks';

type PointsTableProps = {
  userPointsData: UserPointsData;
  pointsInfos: PointsInfo[];
};

type PointsTableHeaderButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  orderCol?: TableOrderCol;
  currentOrderCol: TableOrderCol;
  currentOrderDir: TableOrderDirection;
  noActiveState?: boolean;
  className?: string;
};

enum PointsTableState {
  Loading = 'loading',
  Working = 'working',
  Ready = 'ready',
}

enum TableOrderCol {
  FullName = 'owner',
  DepositPoints = 'depositPoints',
  BorrowPoints = 'borrowPoints',
  ReferralPoints = 'referralPoints',
  TotalPoints = 'totalPoints',
}

enum TableOrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

const PointsTableHeaderItems = [
  {
    label: 'Rank',
    orderCol: TableOrderCol.TotalPoints,
    noActiveState: true,
  },
  {
    label: 'Full Name',
    orderCol: TableOrderCol.FullName,
  },
  {
    label: 'Deposit Points',
    orderCol: TableOrderCol.DepositPoints,
  },
  {
    label: 'Borrow Points',
    orderCol: TableOrderCol.BorrowPoints,
  },
  {
    label: 'Referral Points',
    orderCol: TableOrderCol.ReferralPoints,
  },
  {
    label: 'Total Points',
    orderCol: TableOrderCol.TotalPoints,
  },
];

const PointsTableHeaderButton = ({
  children,
  onClick,
  orderCol,
  currentOrderCol,
  currentOrderDir,
  noActiveState = false,
  className,
}: PointsTableHeaderButtonProps) => {
  return (
    <button
      className={cn(
        'flex items-center gap-0.5',
        currentOrderCol !== orderCol && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {currentOrderCol === orderCol &&
        currentOrderDir === TableOrderDirection.Desc &&
        !noActiveState && <IconSortDescending className="mr-1" size={15} />}
      {currentOrderCol === orderCol &&
        currentOrderDir === TableOrderDirection.Asc &&
        !noActiveState && <IconSortAscending className="mr-1" size={15} />}
      {children}
    </button>
  );
};

interface LeaderboardRow extends UserPointsData {
  rank: number;
}

interface LeaderboardSettings {
  pageSize: number;
  currentPage: number;
  orderCol: TableOrderCol;
  orderDir: TableOrderDirection;
  search: string;
}

export const PointsTable = ({
  userPointsData,
  pointsInfos,
}: PointsTableProps) => {
  const [pointsTableState, setPointsTableState] =
    React.useState<PointsTableState>(PointsTableState.Ready);
  const [leaderboardData, setLeaderboardData] = React.useState<
    LeaderboardRow[]
  >([]);
  const [leaderboardSettings, setLeaderboardSettings] =
    React.useState<LeaderboardSettings>({
      pageSize: 100,
      currentPage: 1,
      orderCol: TableOrderCol.TotalPoints,
      orderDir: TableOrderDirection.Desc,
      search: '',
    });
  const leaderboardSearchRef = React.useRef<HTMLInputElement>(null);
  const debouncedLeaderboardSettings = useDebounce(leaderboardSettings, 500);

  // Process and sort pointInfos data based on settings
  React.useEffect(() => {
    const processLeaderboardData = () => {
      setPointsTableState(PointsTableState.Working);

      let processedData = pointsInfos.map((info, index) => ({
        owner: info.full_name,
        depositPoints: info.depositPoints,
        borrowPoints: info.borrowPoints,
        referralPoints: info.referralPoints,
        totalPoints:
          parseFloat(info.depositPoints as unknown as string) +
          parseFloat(info.borrowPoints as unknown as string) +
          parseFloat(info.referralPoints as unknown as string),
        userRank: null,
        rank: index + 1,
      }));

      // Filter by search
      if (debouncedLeaderboardSettings.search) {
        const searchLower = debouncedLeaderboardSettings.search.toLowerCase();
        processedData = processedData.filter(
          (row) =>
            row.owner.toLowerCase().includes(searchLower) ||
            row.rank.toString() === debouncedLeaderboardSettings.search,
        );
      }

      // Sort data
      processedData.sort((a, b) => {
        const col = debouncedLeaderboardSettings.orderCol;
        const multiplier =
          debouncedLeaderboardSettings.orderDir === TableOrderDirection.Desc
            ? -1
            : 1;

        if (typeof a[col] === 'string' && typeof b[col] === 'string') {
          return (
            multiplier * (a[col] as string).localeCompare(b[col] as string)
          );
        }
        return multiplier * ((a[col] as number) - (b[col] as number));
      });

      // Paginate data
      const startIndex =
        (debouncedLeaderboardSettings.currentPage - 1) *
        debouncedLeaderboardSettings.pageSize;
      const paginatedData = processedData.slice(
        startIndex,
        startIndex + debouncedLeaderboardSettings.pageSize,
      );

      setLeaderboardData(paginatedData);
      setPointsTableState(PointsTableState.Ready);
    };

    processLeaderboardData();
  }, [debouncedLeaderboardSettings, pointsInfos]);

  const totalPages = Math.ceil(
    pointsInfos.length / leaderboardSettings.pageSize,
  );

  return (
    <div className="mt-10 w-full space-y-3 pb-16">
      <div className="flex items-center justify-between gap-2">
        <div className="relative w-full max-w-xl">
          <IconSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={15}
          />
          <Input
            ref={leaderboardSearchRef}
            type="text"
            placeholder="Search by name or rank..."
            className="w-full rounded-full pl-9"
            onChange={(e) =>
              setLeaderboardSettings({
                ...leaderboardSettings,
                search: e.target.value,
                currentPage: 1,
              })
            }
            value={leaderboardSettings.search}
          />
          {leaderboardSettings.search && (
            <button
              onClick={() => {
                setLeaderboardSettings({
                  ...leaderboardSettings,
                  search: '',
                  currentPage: 1,
                });
              }}
              className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-white"
            >
              <IconX size={14} className="translate-y-[1px]" /> clear search
            </button>
          )}
        </div>
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {PointsTableHeaderItems.map((item) => (
              <TableHead
                key={item.label}
                className={cn(
                  'w-[100px] text-left',
                  leaderboardSettings.orderCol === item.orderCol &&
                    !leaderboardSettings.search &&
                    item.label !== 'Rank' &&
                    'text-white',
                  item.orderCol === TableOrderCol.TotalPoints &&
                    item.label !== 'Rank' &&
                    'text-right',
                )}
              >
                <PointsTableHeaderButton
                  orderCol={item.orderCol}
                  currentOrderCol={leaderboardSettings.orderCol}
                  currentOrderDir={leaderboardSettings.orderDir}
                  className={cn(
                    item.orderCol === TableOrderCol.TotalPoints &&
                      item.label !== 'Rank' &&
                      'ml-auto text-right',
                  )}
                  noActiveState={item.noActiveState}
                  onClick={
                    item.orderCol && !item.noActiveState
                      ? () => {
                          if (pointsTableState !== PointsTableState.Ready)
                            return;
                          setPointsTableState(PointsTableState.Working);

                          let orderDir = leaderboardSettings.orderDir;

                          if (leaderboardSettings.orderCol !== item.orderCol) {
                            orderDir = TableOrderDirection.Desc;
                          } else {
                            orderDir =
                              leaderboardSettings.orderDir ===
                              TableOrderDirection.Asc
                                ? TableOrderDirection.Desc
                                : TableOrderDirection.Asc;
                          }
                          setLeaderboardSettings({
                            ...leaderboardSettings,
                            orderCol: item.orderCol,
                            orderDir,
                            currentPage: 1,
                          });
                        }
                      : undefined
                  }
                >
                  {item.label}
                </PointsTableHeaderButton>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {pointsTableState === PointsTableState.Loading && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <div className="flex items-center justify-center gap-1.5 py-4 text-muted-foreground">
                  <IconLoader className="animate-spin" size={20} /> Loading
                  leaderboard...
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
        {pointsTableState !== PointsTableState.Loading && (
          <TableBody
            className={cn(
              pointsTableState === PointsTableState.Working && 'opacity-25',
            )}
          >
            {leaderboardData.map((row) => (
              <TableRow
                key={row.owner}
                className={cn(
                  row.owner === userPointsData.owner &&
                    'bg-chartreuse/20 hover:bg-chartreuse/30',
                )}
              >
                <TableCell className="text-left font-mono font-medium">
                  {row.rank === 1 && <span className="-ml-1 text-xl">🥇</span>}
                  {row.rank === 2 && <span className="-ml-1 text-xl">🥈</span>}
                  {row.rank === 3 && <span className="-ml-1 text-xl">🥉</span>}
                  {row.rank > 3 && <span>{row.rank}</span>}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'font-medium',
                      row.owner === userPointsData.owner
                        ? 'text-purple'
                        : 'text-white',
                    )}
                  >
                    {row.owner}
                  </span>
                </TableCell>
                <TableCell
                  className={cn(
                    'font-mono text-muted-foreground',
                    leaderboardSettings.orderCol ===
                      TableOrderCol.DepositPoints && 'text-white',
                  )}
                >
                  {row.depositPoints.toLocaleString()}
                </TableCell>
                <TableCell
                  className={cn(
                    'font-mono text-muted-foreground',
                    leaderboardSettings.orderCol ===
                      TableOrderCol.BorrowPoints && 'text-white',
                  )}
                >
                  {row.borrowPoints.toLocaleString()}
                </TableCell>
                <TableCell
                  className={cn(
                    'font-mono text-muted-foreground',
                    leaderboardSettings.orderCol ===
                      TableOrderCol.ReferralPoints && 'text-white',
                  )}
                >
                  {row.referralPoints.toLocaleString()}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right font-mono text-muted-foreground',
                    leaderboardSettings.orderCol ===
                      TableOrderCol.TotalPoints && 'text-white',
                  )}
                >
                  {row.totalPoints.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {(!leaderboardSettings.search || leaderboardData.length === 0) && (
        <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
          <p className="ml-2.5 mr-auto">
            Showing page {leaderboardSettings.currentPage} of {totalPages}
          </p>
          <Button
            variant="outline-dark"
            size="sm"
            className="ml-auto"
            disabled={
              leaderboardSettings.currentPage === 1 ||
              pointsTableState !== PointsTableState.Ready
            }
            onClick={() => {
              if (pointsTableState !== PointsTableState.Ready) return;
              setLeaderboardSettings({
                ...leaderboardSettings,
                currentPage: 1,
              });
            }}
          >
            <span className="-translate-y-[1px]">&laquo;</span>
          </Button>
          <Button
            variant="outline-dark"
            size="sm"
            disabled={
              leaderboardSettings.currentPage === 1 ||
              pointsTableState !== PointsTableState.Ready
            }
            onClick={() => {
              if (pointsTableState !== PointsTableState.Ready) return;
              setLeaderboardSettings({
                ...leaderboardSettings,
                currentPage: leaderboardSettings.currentPage - 1,
              });
            }}
          >
            Previous
          </Button>
          <Button
            variant="outline-dark"
            size="sm"
            disabled={
              leaderboardSettings.currentPage === totalPages ||
              pointsTableState !== PointsTableState.Ready
            }
            onClick={() => {
              if (pointsTableState !== PointsTableState.Ready) return;
              setLeaderboardSettings({
                ...leaderboardSettings,
                currentPage: leaderboardSettings.currentPage + 1,
              });
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
