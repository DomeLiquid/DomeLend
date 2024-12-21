import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PointsTab from './points-tab';
import ActivityTab from './activity-tab';

export default function TabbedInterface() {
  const [activeTab, setActiveTab] = useState('points');

  const tabContent: { [key: string]: React.ReactNode } = {
    points: <PointsTab />,
    activity: <ActivityTab />,
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-lg">
      <div className="mb-6 flex justify-around">
        {['Points', 'Activity'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab.toLowerCase() ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className="mx-2"
            disabled={tab === 'Activity'}
          >
            {tab}
          </Button>
        ))}
      </div>
      {tabContent[activeTab]}
    </div>
  );
}
