import React from 'react';
import {
  LendBox,
  LendBoxProps,
  RepayCollatBox,
  RepayCollatBoxProps,
} from './actions';
import {
  ActionBoxWrapper,
  ActionDialogWrapper,
  ActionBoxNavigator,
} from './components/action-wrappers';
import { useActionBoxContext } from './context';
import {
  ActionBoxProps,
  isDialogWrapperProps,
  RepayBoxProps,
  RequiredLendBoxProps,
  RequiredRepayBoxProps,
} from './types';
import { ActionBoxComponent } from './types';
import { ActionType } from '@/lib/mrgnlend';
import Meteors from '../magicui/meteors';

const ActionBox: ActionBoxComponent = (props) => {
  if (isDialogWrapperProps(props)) {
    const dialogProps = props.dialogProps;

    return (
      <>
        <ActionDialogWrapper
          title={dialogProps.title}
          trigger={dialogProps.trigger}
          isTriggered={dialogProps.isTriggered}
        >
          {props.children}
        </ActionDialogWrapper>
      </>
    );
  }

  return <>{props.children}</>;
};

const Lend = (
  props: ActionBoxProps & {
    lendProps: RequiredLendBoxProps | LendBoxProps;
    useProvider?: boolean;
  },
) => {
  const contextProps = useActionBoxContext();
  const { lendProps, useProvider, ...actionBoxProps } = props;

  let combinedProps: LendBoxProps;

  if (useProvider && contextProps) {
    combinedProps = {
      ...contextProps,
      ...(lendProps as RequiredLendBoxProps),
    };
  } else {
    combinedProps = lendProps as LendBoxProps;
  }

  return (
    <ActionBox {...actionBoxProps}>
      <ActionBoxWrapper
        showSettings={false}
        isDialog={props.isDialog}
        actionMode={props.lendProps.requestedLendType}
      >
        <ActionBoxNavigator selectedAction={props.lendProps.requestedLendType}>
          <LendBox {...combinedProps} isDialog={props.isDialog} />
        </ActionBoxNavigator>
      </ActionBoxWrapper>
    </ActionBox>
  );
};
ActionBox.Lend = Lend;

const BorrowLend = (
  props: ActionBoxProps & {
    lendProps: RequiredLendBoxProps | LendBoxProps;
    useProvider?: boolean;
  },
) => {
  const contextProps = useActionBoxContext();
  const [selectedAction, setSelectedAction] = React.useState(
    ActionType.Deposit,
  );
  const { lendProps, useProvider, ...actionBoxProps } = props;

  React.useEffect(() => {
    setSelectedAction(lendProps.requestedLendType);
  }, [lendProps.requestedLendType]);

  let combinedProps: LendBoxProps;

  if (useProvider && contextProps) {
    combinedProps = {
      ...contextProps,
      ...(lendProps as RequiredLendBoxProps),
    };
  } else {
    combinedProps = lendProps as LendBoxProps;
  }

  return (
    <ActionBox {...actionBoxProps}>
      <ActionBoxWrapper
        showSettings={false}
        isDialog={actionBoxProps.isDialog}
        actionMode={ActionType.Deposit}
      >
        <ActionBoxNavigator
          selectedAction={selectedAction}
          onSelectAction={setSelectedAction}
          actionTypes={[ActionType.Deposit, ActionType.Borrow]}
        >
          <LendBox {...combinedProps} requestedLendType={ActionType.Deposit} />
          <LendBox {...combinedProps} requestedLendType={ActionType.Borrow} />
        </ActionBoxNavigator>
      </ActionBoxWrapper>
    </ActionBox>
  );
};
ActionBox.BorrowLend = BorrowLend;

const Repay = (
  props: ActionBoxProps & {
    repayProps: RequiredRepayBoxProps | RepayBoxProps;
    useProvider?: boolean;
  },
) => {
  const contextProps = useActionBoxContext();
  const [selectedAction, setSelectedAction] = React.useState(ActionType.Repay);
  const { repayProps, useProvider, ...actionBoxProps } = props;

  let combinedProps: RepayBoxProps;

  if (useProvider && contextProps) {
    combinedProps = {
      ...contextProps,
      ...(repayProps as RequiredRepayBoxProps),
    };
  } else {
    combinedProps = repayProps as RepayBoxProps;
  }

  return (
    <ActionBox {...actionBoxProps}>
      <ActionBoxWrapper
        showSettings={true}
        isDialog={actionBoxProps.isDialog}
        actionMode={ActionType.Repay}
      >
        <ActionBoxNavigator
          selectedAction={selectedAction}
          onSelectAction={setSelectedAction}
          actionTypes={[ActionType.Repay]}
          //   actionTypes={[ActionType.Repay, ActionType.RepayCollat]}
        >
          <LendBox
            {...combinedProps}
            requestedLendType={ActionType.Repay}
            isDialog={actionBoxProps.isDialog}
          />
          <RepayCollatBox {...combinedProps} />
        </ActionBoxNavigator>
      </ActionBoxWrapper>
    </ActionBox>
  );
};
ActionBox.Repay = Repay;
ActionBox.displayName = 'ActionBox';

export { ActionBox };
