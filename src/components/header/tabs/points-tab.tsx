import { useUserProfileStore } from '@/app/stores';
import { Button } from '@/components/ui/button';
import { numeralFormatter } from '@/lib';
import { useRouter } from '@/navigation';
import { Trophy, Copy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const PointsTab = ({ setSheetOpen }: { setSheetOpen: any }) => {
  const router = useRouter();

  const [userPointsData, pointsInfos, fetchPoints, fetchPointsInfos] =
    useUserProfileStore((state) => [
      state.userPointsData,
      state.pointsInfos,
      state.fetchPoints,
      state.fetchPointsInfos,
    ]);

  useMemo(() => {
    fetchPointsInfos();
    fetchPoints();
  }, []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-semibold text-purple-500">Your Points</h3>
        <p className="text-xl font-bold">
          {userPointsData?.totalPoints
            ? numeralFormatter(userPointsData.totalPoints)
            : 'N/A'}
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-purple-500 ">Your Rank</h3>
        <p className="text-4xl font-bold">
          #{userPointsData?.userRank ? userPointsData?.userRank : 'N/A'}
        </p>
      </div>
      <div className="space-y-2">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            setSheetOpen(false);
            router.push('/points');
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Point Leaderboard
        </Button>
        <Button className="w-full" variant="outline" disabled>
          <Copy className="mr-2 h-4 w-4" /> Copy Referral Code
        </Button>
      </div>
    </div>
  );
};

export default PointsTab;
