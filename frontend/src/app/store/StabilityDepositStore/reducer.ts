import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { Decimal } from '@app/library/base/Decimal';
import { StabilityDeposit } from '@app/library/nephrite';

type Action = ActionType<typeof actions>;

type StabilityDepositStateType = any;

const stableDepositInitialParams: Array<Decimal> = Array(4).fill(Decimal.ZERO);

const initialState: StabilityDepositStateType = {
  instance: new StabilityDeposit(...stableDepositInitialParams),
};

const reducer = createReducer<StabilityDepositStateType, Action>(initialState)
  .handleAction(
    actions.revertUserStabilityDepositToInitial,
    (state, action) =>
      produce(state, nextState => {
        nextState.instance = new StabilityDeposit(...stableDepositInitialParams);
      }),
  )
  .handleAction(
    [actions.loadUserStabilityDeposit.success, actions.updateStabilityDeposit],
    (state, action) =>
      produce(state, nextState => {
        let stabilityDeposit: null | StabilityDeposit = initialState.instance;

        if (action.payload && action.payload instanceof Object) {
          stabilityDeposit = action.payload;
        }

        nextState.instance = stabilityDeposit;
      }),
  );

 export { reducer as StabilityDepositReducer };
