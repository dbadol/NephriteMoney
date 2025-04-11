import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import { NEPHRITE_CID } from '@app/constants';
import {
  LoadViewParams,
  LoadOpenTroves,
  LoadManagerView,
  LoadUserView,
  LoadModeratorsView,
} from '@core/api';

import { actions } from '.';
import store from '../../../index';
import {
  NephriteAppParams,
  ManagerViewData,
  UserViewParams,
  Moderator,
} from '@app/core/types';

import { SharedStateType } from '@app/types/interface';
import {
  setIsLoaded,
  navigate,
  setError,
  loadAdminKey,
} from '@app/store/SharedStore/actions';
import { Base64DecodeUrl, fromGroths } from '@app/library/base/appUtils';
import * as troveActions from '../TroveStore/actions';
import * as stabilityDepositActions from '../StabilityDepositStore/actions';
import { Decimal } from '@app/library/base/Decimal';
import { Surplus, UserTrove, UserTroveStatus } from '../../library/nephrite/Trove';
import { StabilityDeposit } from '@app/library/nephrite';
import { getApi } from '@app/utils/getApi';
import _ from "lodash";
import { END, eventChannel } from 'redux-saga';

const FETCH_INTERVAL = 310000;
const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const RATE_PARAMS = 'ids=beam&vs_currencies=usd';

export function* handleParams(payload: NephriteAppParams) {
  yield put(actions.setAppParams(payload));
}

export function* loadParamsSaga(
  action: ReturnType<typeof actions.loadAppParams.request>,
): Generator {
  try {
    const nephriteApiMethods: any/* ShaderActions */ = getApi();

    const state = (yield select()) as { nephrite; shared };

    if (!state.shared.isLoaded && _.isEmpty(nephriteApiMethods)) {
      yield null;
    }

    const result = yield call(nephriteApiMethods.managerViewParams);
    const { params: payload } = result;
    const { params: { price: price } } = result;

    if (!price) {
      throw new Error("Oracle doesn't have a setted price");
    }


    if (!state.shared.isLoaded) {
      store.dispatch(actions.loadContractInfo.request());
    }

    if (price)
      yield put(actions.loadRate.success(price));

    yield put(actions.loadAppParams.success(payload));

    yield call(loadUserViewSaga);
    yield call(loadTrovesSaga);

    if (state.shared.isLoaded && !state.shared.adminKey) {
      store.dispatch(loadAdminKey.request());
    }

  } catch (e) {
    yield put(actions.loadAppParams.failure(e));
    yield put(actions.loadRate.failure(e));
  }
}

export function* loadTrovesSaga(
  action?: ReturnType<typeof actions.loadOpenTroves.request>,
): Generator {
  try {
    const nephriteApiMethods: any/* ShaderActions */ = getApi();
    const result: any = yield call(nephriteApiMethods.managerViewAll);

    const state = (yield select()) as { nephrite; shared };

    if (!state.shared.isLoaded) {
      store.dispatch(setIsLoaded(true));
    }

    let openTroves = [];

    if ('troves' in result)
      openTroves = result.troves.map(rawTrove => {
        const { address, status, collateral, deposit, cr } = prepareTroveData(
          rawTrove,
        );

        return new UserTrove(address, status, collateral, deposit, cr);
      });

    yield put(actions.loadOpenTroves.success(openTroves));
  } catch (e) {
    yield put(actions.loadOpenTroves.failure(e));
  }
}

export function* loadContractInfoSaga(
  action: ReturnType<typeof actions.loadContractInfo.request>,
): Generator {
  try {
    const managerViewData = (yield call(
      LoadManagerView,
    )) as any;

    const contract = managerViewData.contracts.find(item => item.cid === NEPHRITE_CID);
    if (contract) {
      yield put(actions.loadContractInfo.success(contract /* .Height */));
    }
  } catch (e) {
    yield put(actions.loadContractInfo.failure(e));
  }
}

function* loadUserViewSaga(
  action?: ReturnType<typeof actions.loadUserView.request>,
) {
  const nephriteApiMethods: any/* ShaderActions */ = getApi();
  const userView: any = yield call(nephriteApiMethods.userView);

  yield put(actions.setUserView(userView));

  yield call(updateUserTroveSaga, userView);
  yield call(updateUserStabilityDepositSaga, userView);
}

function* updateUserTroveSaga(userView) {
  try {
    if (userView && 'my_trove' in userView) {
      const userTroveData = userView.my_trove;

      const { address, status, collateral, deposit, cr } = prepareTroveData(
        userTroveData,
      );

      yield put(
        troveActions.loadUserTrove.success(
          new UserTrove(address, status, collateral, deposit, cr),
        ),
      );
    } else {
      yield put(troveActions.revertUserTroveToInitial());
    }

    if(userView && 'surplus-t' in userView) {
      const userSurplusData = userView['surplus-t'];

      const { collateral, deposit, gov } = prepareSurplusData(
        userSurplusData,
      );

      yield put(
        troveActions.loadUserSurplus.success(
          new Surplus(collateral, deposit, gov),
        ),
      );

      yield put(
        troveActions.setStatusUserTrove("closedByRedemption"),
      );

    } else {
      yield put(troveActions.revertUserSurplusToInitial());
    }

  } catch (e) {
    yield put(troveActions.loadUserTrove.failure(e));
  }
}

function* updateUserStabilityDepositSaga(userView) {
  if (userView && 'stab' in userView) {
    const userStabilityDepositeData = userView.stab;
    const { initialNephrite, currentNephrite, collateralGain, beamXReward } = {
      initialNephrite: Decimal.from(
        fromGroths(userStabilityDepositeData.tok),
      ),
      currentNephrite: Decimal.from(
        fromGroths(userStabilityDepositeData.tok),
      ),
      collateralGain: Decimal.from(fromGroths(userStabilityDepositeData?.col ?? Decimal.ZERO)),
      beamXReward: Decimal.from(fromGroths(userStabilityDepositeData?.gov ?? Decimal.ZERO)),
    };

    yield put(
      stabilityDepositActions.loadUserStabilityDeposit.success(
        new StabilityDeposit(initialNephrite, currentNephrite, collateralGain, beamXReward),
      )
    );
  } else {
    yield put(stabilityDepositActions.revertUserStabilityDepositToInitial());
  }
}

export function* loadRate() {
  const FETCH_INTERVAL = 5000;

  try {
    const nephriteApiMethods: any/* ShaderActions */ = getApi();

    const result = yield call(nephriteApiMethods.managerViewParams);
    const { params: { price: price } } = result;

    if (price)
      yield put(actions.loadRate.success(price));

    setTimeout(
      () => store.dispatch(actions.loadRate.request()),
      FETCH_INTERVAL,
    );
  } catch (e) {
    yield put(actions.loadRate.failure(e));
  }
}

function prepareTroveData(
  rawTrove,
): {
  address: string;
  status: UserTroveStatus;
  collateral: Decimal;
  deposit: Decimal;
  cr: string;
} {
  return {
    address: '',
    status: 'open',
    collateral: Decimal.from(fromGroths(rawTrove.amounts.col)),
    deposit: Decimal.from(fromGroths(rawTrove.amounts.tok)),
    cr: rawTrove.cr,
  };
}

function prepareSurplusData(
  rawTrove,
): {
  collateral: Decimal;
  deposit: Decimal;
  gov: Decimal;
} {
  return {
    collateral: Decimal.from(fromGroths(rawTrove.col)),
    deposit: Decimal.from(fromGroths(rawTrove.tok)),
    gov: Decimal.from(fromGroths(rawTrove.gov)),
  };
}


function loadViewInterval(delay) {
  return eventChannel(emitter => {
    const interval = setInterval(() => {
      if (!delay) {
        emitter(END)
      }

      emitter(true)
    }, delay);

    return () => {
      clearInterval(interval)
    }
  }
  )
}

function* reloadLoadAppParams() {
  try {
    const nephriteApiMethods: any/* ShaderActions */ = getApi();

    const state = (yield select()) as { nephrite; shared };

    if (!state.shared.isLoaded && _.isEmpty(nephriteApiMethods)) {
      yield null;
    }

    const result = yield call(nephriteApiMethods.managerViewParams);

    const { params: payload } = result;
    const { params: { price: price } } = result;

    if (!price) {
      throw new Error("Oracle doesn't have a setted price");
    }

    if (price)
      yield put(actions.loadRate.success(price));

    yield put(actions.loadAppParams.success(payload));
    yield call(loadUserViewSaga);
    yield call(loadTrovesSaga);

  } catch (e) {
  }

}

function* mainSaga() {
  yield takeEvery(actions.loadAppParams.request, loadParamsSaga);
  yield takeLatest(actions.loadContractInfo.request, loadContractInfoSaga);
  yield takeLatest(actions.loadOpenTroves.request, loadTrovesSaga);
  yield takeEvery(
    yield call(loadViewInterval, 5000),
    reloadLoadAppParams
  );
  yield takeLatest(actions.loadUserView.request, loadUserViewSaga);
}

export default mainSaga;
