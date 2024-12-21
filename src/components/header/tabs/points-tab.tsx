import { Button } from '@/components/ui/button';
import { Trophy, Copy } from 'lucide-react';

const PointsTab = () => {
  return (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-semibold text-purple-500">您的积分</h3>
        <p className="text-6xl font-bold">67</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-purple-500 ">您的排名</h3>
        <p className="text-4xl font-bold">#399,013</p>
      </div>
      <div className="space-y-2">
        <Button className="w-full" variant="outline">
          <Trophy className="mr-2 h-4 w-4" /> 积分排行榜
        </Button>
        <Button className="w-full" variant="outline">
          <Copy className="mr-2 h-4 w-4" /> 复制推荐码
        </Button>
      </div>
    </div>
  );
};

export default PointsTab;
