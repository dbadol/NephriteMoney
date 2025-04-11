import { Surplus, Trove, UserTrove } from '@app/library/nephrite';
import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { Decimal } from '@app/library/base/Decimal';

type Action = ActionType<typeof actions>;

type TroveStateType = any;

const troveInitialParams = ['', 'nonExistent', Decimal.ZERO, Decimal.ZERO, '0'] as const;
const surplusInitialParams: Array<Decimal> = Array(3).fill(Decimal.ZERO);

const initialState: TroveStateType = {
  instance: new UserTrove(...troveInitialParams),
  surplus: new Surplus(...surplusInitialParams),
  changePending: false,
};

const reducer = createReducer<TroveStateType, Action>(initialState)
  .handleAction([actions.revertUserTroveToInitial], (state, action) =>
    produce(state, nextState => {
      nextState.instance = new UserTrove(...troveInitialParams);
      nextState.changePending = false;
    }),
  )
  .handleAction([actions.revertUserSurplusToInitial], (state, action) =>
    produce(state, nextState => {
      nextState.surplus = new Surplus(...surplusInitialParams);
      nextState.changePending = false;
    }),
  )
  .handleAction(
    [actions.loadUserTrove.success, actions.setUserTrove],
    (state, action) =>
      produce(state, nextState => {
        let userTrove: null | UserTrove = initialState.instance;

        if (action.payload && action.payload instanceof Object) {
          userTrove = action.payload;
        }

        nextState.instance = userTrove;
      }),
  )
  .handleAction(
    [actions.loadUserSurplus.success],
    (state, action) =>
      produce(state, nextState => {
        let userTrove: null | UserTrove = initialState.surplus;

        if (action.payload && action.payload instanceof Object) {
          userTrove = action.payload;
        }

        nextState.surplus = userTrove;
      }),
  )
  .handleAction(
    [actions.setStatusUserTrove], (state, action) => produce(state, nextState => {
      nextState = { ...state, instance: state.instance.setStatus(action.payload) };
    })
  )
  .handleAction(
    [actions.startChangeUserTrove], (state, action) => produce(state, nextState => {
      nextState = { ...state, changePending: true };
    })
  )
  .handleAction(
    [actions.finishChangeUserTrove], (state, action) => produce(state, nextState => {
      nextState = { ...state, changePending: false };
    })
  )
  .handleAction(
    [actions.setCollateralUsertrove], (state, action) => produce(state, nextState => {
      nextState = { ...state, changePending: false };
    })
  );

export { reducer as TroveReducer };
