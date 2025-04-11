import { AnyAction, combineReducers } from 'redux';
import { AppState } from '@app/types/interface';
import { SharedReducer } from '@app/store/SharedStore/reducer';
import { TroveReducer } from '@app/store/TroveStore/reducer';
import { NephriteReducer } from '@app/store/NephriteStore/reducer';
import { StabilityDepositReducer } from '@app/store/StabilityDepositStore/reducer';
import { AppPersistReducer } from './AppPersistStore/reducer';

export default () => {
  const appReducer = combineReducers({
    shared: SharedReducer,
    trove: TroveReducer,
    stabilityDeposit: StabilityDepositReducer,
    nephrite: NephriteReducer,
    appPersist: AppPersistReducer
  });

  return (state: AppState | undefined, action: AnyAction) => appReducer(state, action);
};
