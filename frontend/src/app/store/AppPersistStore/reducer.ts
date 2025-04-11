import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from './actions';

type Action = ActionType<typeof actions>;

type AppPersistStateType = any;

const initialState: AppPersistStateType = {
  startAlertWindowAlreadyUsed: false,
};

const reducer = createReducer<AppPersistStateType, Action>(initialState)
  .handleAction([actions.startAlertWindowAlreadyUsed], (state, action) =>
    produce(state, nextState => {
      nextState.startAlertWindowAlreadyUsed = action.payload;
    }),
  );

export { reducer as AppPersistReducer };
