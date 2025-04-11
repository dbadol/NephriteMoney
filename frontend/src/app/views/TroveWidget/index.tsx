import React from 'react';
import { ReadOnlyTrove } from './containers/ReadOnlyTrove';
import { OpeningTrove } from './containers/OpeningTrove';
import { useTroveView } from '@app/contexts/Trove/TroveViewContext';
import { AdjustingTrove } from './containers/AdjustingTrove';
import { ClosingTrove } from './containers/ClosingTrove';
import { NoTrove } from './containers/NoTrove';
import { TroveManager } from './containers/TroveManager';
import { useSelector } from 'react-redux';
import { selectForTroveManager } from '@app/store/TroveStore/selector';
import { ShaderTransactionComments } from '@app/library/nephrite/types';
import { ReadOnlyTakeFunds } from './containers/ReadOnlyTakeFunds';
import { TakeFunds } from './containers/TakeFunds';

export const TroveWidget: React.FC<any> = props => {
  const { view } = props.view ? props : useTroveView();
  const { originalTrove: original } = useSelector(selectForTroveManager());
  if(view === undefined || null)
  {
    return <NoTrove {...props} />;
  } else {
    switch (view) {
      case 'ACTIVE': {
        return <ReadOnlyTrove {...props} />;
      }
      case 'SURPLUS_ACTIVE': {
        return <ReadOnlyTakeFunds {...props} />;
      }
      case 'SURPLUS_WITHDRAW': {
        return (
            <TakeFunds
                {...{
                  ...props,
                  title: 'TAKE FUNDS',
                }}
            />
        );
      }
      case 'ADJUSTING': {
        return (
            <AdjustingTrove
                {...{
                  ...props,
                  title: 'ADJUST TROVE',
                }}
            />
        );
      }
      case 'CLOSING': {
        return <ClosingTrove {...{}} />;
      }
      case 'OPENING': {
        return (
            <OpeningTrove
                {...{
                  ...props,
                  title: 'OPEN TROVE',
                }}
            />
        );
      }
      case 'WITHDRAWING': {
        return (
            <TroveManager
                {...{
                  ...props,
                  from: original,
                  TRANSACTION_ID: `${ShaderTransactionComments.setTroveModify}: withdraw`,
                  view: view.toLowerCase(),
                  title: ' WITHDRAW FROM TROVE',
                  maxAmountRequired: true,
                }}
            />
        );
      }
      case 'DEPOSITING': {
        return (
            <TroveManager
                {...{
                  ...props,
                  from: original,
                  TRANSACTION_ID: `${ShaderTransactionComments.setTroveModify}: deposit`,
                  view: view.toLowerCase(),
                  title: 'DEPOSIT TO TROVE',
                }}
            />
        );
      }
      case 'BORROWING': {
        return (
            <TroveManager
                {...{
                  ...props,
                  from: original,
                  TRANSACTION_ID: `${ShaderTransactionComments.setTroveModify}: borrow`,
                  view: view.toLowerCase(),
                  title: 'BORROW NPH',
                  maxAmountRequired: true,
                }}
            />
        );
      }
      case 'REPAYING': {
        return (
            <TroveManager
                {...{
                  ...props,
                  from: original,
                  TRANSACTION_ID: `${ShaderTransactionComments.setTroveModify}: repay`,
                  view: view.toLowerCase(),
                  title: 'REPAY DEBT',
                  maxAmountRequired: true,
                }}
            />
        );
      }
      case 'NONE': {
        return <NoTrove {...props} />;
      }
    }
  }

};
