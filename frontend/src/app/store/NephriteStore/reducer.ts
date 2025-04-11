import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { Decimal } from '@app/library/base/Decimal';
import { Trove } from '@app/library/nephrite';
import {fromGroths} from "@library/base/appUtils";

type Action = ActionType<typeof actions>;

const initialState = {
  assetPrice: (Decimal.ZERO),
  nephritePrice: Decimal.from(1),
  numberOfTroves: 0,
  fees: (Decimal.from(0.05)),
    liqReserve: 0,

  appParams: {
    tcr: Decimal.ZERO,
    tvl: Decimal.ZERO,
  },
  contract: {

  },
  baserate: 0,
  troves: [],
  total: Decimal.ZERO,

  public_key: '',
  contractHeight: 0,
  userView: false,
};

const reducer = createReducer<any, Action>(
  initialState,
)
  .handleAction(actions.setUserView, (state, action) =>
    produce(state, nextState => {
      nextState.userView = action.payload ? action.payload.my_trove : false;
    }),
  )
  .handleAction(actions.setIsModerator, (state, action) =>
    produce(state, nextState => {
      nextState.is_moderator = action.payload;
    }),
  )
  .handleAction(actions.setPublicKey, (state, action) =>
    produce(state, nextState => {
      nextState.public_key = action.payload;
    }),
  )
  .handleAction(actions.loadAppParams.success, (state, action) =>
    produce(state, nextState => {
      const { totals: { tok: deposit, col: collateral } } = action.payload;

      nextState.total = new Trove(Decimal.from(collateral), Decimal.from(deposit));
      nextState.appParams = { ...action.payload, tcr: action.payload?.tcr ? Decimal.from(action.payload.tcr) : Decimal.from(0), assetPrice: Decimal.from(action.payload?.price) };
      nextState.liqReserve = action.payload?.liq_reserve;
    }),
  )
  .handleAction(actions.loadOpenTroves.success, (state, action) =>
    produce(state, nextState => {
      nextState.numberOfTroves = action.payload.length;
      nextState.troves = action.payload;
    }),
  )
  .handleAction(actions.loadRate.success, (state, action) =>
    produce(state, nextState => {
      nextState.assetPrice = Decimal.from(action.payload);
    }),
  )
  .handleAction(actions.loadContractInfo.success, (state, action) =>
    produce(state, nextState => {
      nextState.contract/* Height */ = action.payload;
      nextState.contractHeight/* Height */ = action.payload.Height;
    }),
  )
  .handleAction(actions.setPopupState, (state, action) =>
    produce(state, nextState => {
      nextState.popupsState[action.payload.type] =
        action.payload.state;
    }),
  );

export { reducer as NephriteReducer };
