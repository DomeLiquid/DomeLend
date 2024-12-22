import { Button } from '@/components/ui/button';
import { Trophy, Copy } from 'lucide-react';

const PointsTab = () => {
  return (
    <div className="space-y-6 text-center">
      <div className="font-semibold text-yellow-500">Coming Soon</div>
      <div>
        <h3 className="text-lg font-semibold text-purple-500">Your Points</h3>
        <p className="text-6xl font-bold">0</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-purple-500 ">Your Rank</h3>
        <p className="text-4xl font-bold">#0</p>
      </div>
      <div className="space-y-2">
        <Button className="w-full" variant="outline" disabled>
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
