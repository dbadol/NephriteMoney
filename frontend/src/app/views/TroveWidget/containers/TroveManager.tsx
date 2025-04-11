import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, Flex } from 'theme-ui';
import Button from '@app/components/Button';

import { Decimal, Decimalish, Difference } from '@app/library/base/Decimal';
import {
  Trove,
  NEPHRITE_MINIMUM_DEBT,
  MINIMUM_COLLATERAL_RATIO,
  NEPHRITE_MINIMUM_NET_DEBT,
} from '@app/library/nephrite';

import { ActionDescription } from '@app/components/ActionDescription';

import { TroveEditor } from './TroveEditor';
import { TroveAction } from '@app/views/Actions/TroveAction';
import { useTroveView } from '@app/contexts/Trove/TroveViewContext';

import {
  selectForTroveChangeValidation,
  validateTroveChange,
} from '@app/views/validators/validateTroveChange';
import { useCurrentTransactionState } from '@app/library/transaction-react/useCurrentTransactionState';
import { IsTransactionStatus } from '@app/library/transaction-react/IsTransactionStatus';
import { useSelector } from 'react-redux';
import { selectForTroveManager } from '@app/store/TroveStore/selector';
import store from 'index';
import { useNephriteSelector } from '@app/hooks/useNephriteSelector';
import { ShaderTransactionComments } from '@app/library/nephrite/types';
import { ClosingTrove } from './ClosingTrove';
import { useTitle } from '@app/contexts/Nephrite/TitleContext';
import {loadUserView, setUserView} from '@app/store/NephriteStore/actions';
import useCollateralAmountAllowToWithdraw from '@app/hooks/useCollateralAmountAllowToWithdraw';
import useTokAmountAllowToBorrow from '@app/hooks/useTokAmountAllowToBorrow';
import { selectNephriteAppParams } from "@app/store/NephriteStore/selectors";

type TroveManagerAction =
  | {
    type:
    | 'startChange'
    | 'finishChange'
    | 'revert'
    | 'addMinimumDebt'
    | 'removeMinimumDebt';
  }
  | { type: 'setCollateral' | 'setDebt'; newValue: Decimalish };

const feeFrom = (
  original: Trove,
  edited: Trove,
  borrowingRate: Decimal,
): Decimal => {
  const change = original.whatChanged(edited, borrowingRate);

  if (
    change &&
    change.type !== 'invalidCreation' &&
    change.params.borrowNephrite
  ) {
    return change.params.borrowNephrite.mul(borrowingRate);
  } else {
    return Decimal.ZERO;
  }
};

const selector = (state /* : LiquityStoreState */) => {
  const { appParams, fees, assetPrice, accountBalance } = state;
  return {
    appParams,
    fees,
    assetPrice,
    validationContext: selectForTroveChangeValidation(state),
  };
};

type TroveManagerProps = {
  collateral?: Decimalish;
  debt?: Decimalish;
};

export const TroveManager: React.FC<any> = ({
  from,
  TRANSACTION_ID,
  maxAmountRequired = false,
  view,
  title,
}) => {
  const { setCurrentTitle } = useTitle();
  const { dispatchEvent } = useTroveView();

  const { originalTrove: original } = useSelector(selectForTroveManager());
  const { liqReserve } = useSelector(selectNephriteAppParams())

  const [editedTrove, _setEditedTrove] = useState<Trove>(from);
  const [changePending, setChangePending] = useState<boolean>(false);
  const setEditedTrove = (collateral, debt) => {
      _setEditedTrove(new Trove(collateral, debt));
  };

  const {
    appParams,
    fees,
    assetPrice,
    validationContext,
  } = useNephriteSelector(selector);

  const [value, _setValue] = useState<Decimal>(Decimal.ZERO);

  const [
    collateralAmountAllowToWithdraw,
    setcollateralAmountAllowToWithdraw,
  ] = useState<Decimalish>();

  const [tokAmountAllowToWithdraw, setTokAmountAllowToWithdraw] = useState<
    Decimalish
  >();

  const setValue = useCallback(
    value => {
      setChangePending(true);
      value = value.lte(Decimal.ZERO) ? Decimal.ZERO : value;

      if (view === 'repaying') {
        return _setValue(value.gt(original.netDebt) ? original.netDebt : value);
      }
      return _setValue(value);
    },
    [view],
  );

  const transactionState = useCurrentTransactionState(
    new RegExp(`${ShaderTransactionComments.setTroveModify}`, 'g'),
  );
  const [
    isTransactionPending,
    isTransactionFailed,
    isTransactionSuccess,
  ] = IsTransactionStatus({
    transactionIdPrefix: ShaderTransactionComments.setTroveModify,
  });

  const borrowingRate = Decimal.from(appParams.baserate);
  const maxBorrowingRate = borrowingRate.add(0.005);
  const editingState = useState<string>();
  const previousTrove = useRef<Trove>(original);

  useEffect(() => {
    setCurrentTitle(title);
  }, []);
  useEffect(() => {
 if (isTransactionSuccess){
      setValue(Decimal.ZERO);
      store.dispatch(loadUserView.request());
      editedTrove.isEmpty || original.isEmpty
        ? dispatchEvent('TROVE_CLOSED')
        : dispatchEvent('BACK');
    }
  }, [transactionState.type, dispatchEvent]);

  useEffect(() => {
    if (previousTrove.current instanceof Trove && 'repaying' === view) {
        if(from.status === "nonExistent" ||original.status === "nonExistent"){
            setEditedTrove(Decimal.ZERO, Decimal.ZERO);
        }else if (
        value.lte(
          original.netDebt,
        )
      ) {
        if (
          value.lt(original.netDebt )
        ) {
          setEditedTrove(original.collateral, original.debt.sub(value));
        } else if (!value.isZero && value.eq(original.netDebt)) {
          setEditedTrove(Decimal.ZERO, Decimal.ZERO);
        }
      }
    }



    if (
      previousTrove.current instanceof Trove &&
      !previousTrove.current.isEmpty &&
      !original.isEmpty
    ) {
      if (
        'withdrawing' === view &&
        value.lt(original.collateral) &&
        !previousTrove.current.collateral.eq(value)
      ) {
        setEditedTrove(original.collateral.sub(value), original.debt);
      }

      if (
        'depositing' === view &&
        !previousTrove.current.collateral.eq(value)
      ) {
        setEditedTrove(original.collateral.add(value), original.debt);
      }

      if ('borrowing' === view /* && !previousTrove.current.netDebt.eq(value) */) {
        setEditedTrove(original.collateral, original.debt.add(value));
      }
    }

    previousTrove.current = editedTrove;
    setChangePending(false);
  }, [original, value]);

  useEffect(() => {
    if (view == 'withdrawing') {
      (async () => {
        const collateralAmountAllowToWithdraw = await useCollateralAmountAllowToWithdraw(
          {
            desiredCr: MINIMUM_COLLATERAL_RATIO.add(0.1).mul(100000),
            tok: original.debt,
            col: original.collateral,
          },
        );

        setcollateralAmountAllowToWithdraw(
          Decimal.from(collateralAmountAllowToWithdraw),
        );
      })();
    }

    if (view == 'borrowing') {
      (async () => {
        const {b, c} = await useTokAmountAllowToBorrow({
          desiredCr: MINIMUM_COLLATERAL_RATIO.add(0.1).mul(100000),
          tok: original.debt,
          col: original.collateral,
          liqReserve: liqReserve
        });
        setTokAmountAllowToWithdraw(Decimal.from(b));
      })();
    }

    return () => { };
  }, [value]);

  const [validChange, description] = validateTroveChange(
    original,
    editedTrove,
    borrowingRate,
    validationContext,
    view,
  );

  const handleCancel = useCallback(() => {
    setChangePending(false), setValue(Decimal.ZERO), _setEditedTrove(from);
  }, [dispatchEvent]);

  return (
    <>
      <TroveEditor
        original={original}
        edited={editedTrove}
        fee={feeFrom(original, editedTrove, borrowingRate)}
        borrowingRate={borrowingRate}
        changePending={changePending}
        editingState={editingState}
        maxAmountRequired={maxAmountRequired}
        viewAction={view}
        setValue={setValue}
        value={value}
        collateralAmountAllowToWithdraw={collateralAmountAllowToWithdraw}
        tokAmountAllowToWithdraw={tokAmountAllowToWithdraw}
      >
        {description ?? <></>}

        <Flex variant="layout.actions">
          <Button
            variant="ghost"
            onClick={handleCancel}
            style={{
              marginRight: '10px',
              width: '140px',
              height: '37px',
              letterSpacing: '0.1em',
            }}
          >
            CANCEL
          </Button>

          {validChange &&
            !isTransactionPending &&
            !value.isZero &&
            !changePending ? (
            <TroveAction
              transactionId={`${TRANSACTION_ID} ${value} ${['withdrawing', 'depositing'].includes(view) ? 'BEAM' : 'NPH'
                }`}
              change={validChange}
              maxBorrowingRate={maxBorrowingRate}
              trove={original}
            >
              CONFIRM
            </TroveAction>
          ) : (
            <Button
              pallete="gradient"
              style={{
                marginLeft: 0,
                width: '140px',
                height: '37px',
                letterSpacing: '0.1em',
              }}
              disabled
            >
              CONFIRM
            </Button>
          )}
        </Flex>
      </TroveEditor>
    </>
  );
};
