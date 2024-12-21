import React from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import { IconSparkles } from '@tabler/icons-react';
import { ActionType } from '@/lib/mrgnlend';
import { Sparkles } from 'lucide-react';
import Meteors from '@/components/magicui/meteors';

interface ActionBoxNavigatorProps {
  selectedAction: ActionType;
  actionTypes?: ActionType[];
  onSelectAction?: (action: ActionType) => void;
  children: React.ReactNode;
}

const actionTitles: { [key in ActionType]?: string } = {
  [ActionType.Borrow]: 'You borrow',
  [ActionType.Deposit]: 'You supply',
  [ActionType.Withdraw]: 'You withdraw',
  [ActionType.Repay]: 'You repay',
  // [ActionType.RepayCollat]: "You repay with collateral",
  // [ActionType.MintLST]: "You stake",
  // [ActionType.UnstakeLST]: "You unstake",
  // [ActionType.Loop]: "You deposit",
};

const toggleTitles: { [key in ActionType]?: string } = {
  [ActionType.Borrow]: 'Borrow',
  [ActionType.Deposit]: 'Lend',
  [ActionType.Withdraw]: 'Withdraw',
  [ActionType.Repay]: 'Repay',
  // [ActionType.RepayCollat]: "Collateral Repay",
  // [ActionType.MintLST]: "You stake",
  // [ActionType.UnstakeLST]: "You unstake",
  // [ActionType.Loop]: "You deposit",
};

const newFeatures = [ActionType.Repay];

export const ActionBoxNavigator = ({
  actionTypes,
  selectedAction,
  onSelectAction,
  children,
}: ActionBoxNavigatorProps) => {
  const childrenArray = React.Children.toArray(children);
  const isNavigator = React.useMemo(
    () => actionTypes && actionTypes.length > 1,
    [actionTypes],
  );
  const currentIndex = React.useMemo(() => {
    if (!isNavigator || !actionTypes) return 0;

    return actionTypes.findIndex((actionType) => actionType === selectedAction);
  }, [isNavigator, actionTypes, selectedAction]);

  const navigatorToggles = React.useMemo(() => {
    if (!isNavigator || !actionTypes) return [];

    return actionTypes.map((actionType) => ({
      value: actionType,
      text: toggleTitles[actionType] || '',
    }));
  }, [actionTypes, isNavigator]);

  return (
    <>
      <div className="mb-2 flex flex-row items-center justify-between">
        <div className="flex items-center text-lg font-normal">
          {isNavigator ? (
            <div>
              <ToggleGroup
                variant="actionBox"
                type="single"
                className="bg-gray-100 dark:bg-neutral-800"
                value={selectedAction}
                onValueChange={(value) => {
                  if (value !== '') {
                    onSelectAction && onSelectAction(value as ActionType);
                  }
                }}
              >
                {navigatorToggles.map((toggle, idx) => (
                  <ToggleGroupItem
                    key={idx}
                    value={toggle.value}
                    aria-label={toggle.value}
                    className="h-[1.65rem] capitalize hover:bg-gray-200 data-[state=on]:bg-gray-900 dark:hover:bg-neutral-900 dark:data-[state=on]:bg-neutral-900"
                  >
                    {newFeatures.includes(toggle.value) ? (
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} /> {toggle.text}
                      </div>
                    ) : (
                      toggle.text
                    )}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          ) : (
            <span className="text-sm font-normal text-muted-foreground">
              {actionTitles[selectedAction]}
            </span>
          )}
        </div>
      </div>
      {childrenArray[currentIndex]}
    </>
  );
};
