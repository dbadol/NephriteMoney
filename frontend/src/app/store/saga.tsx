import { all, fork } from 'redux-saga/effects';
import mainSaga from '@app/store/NephriteStore/saga';
import sharedSaga from '@app/store/SharedStore/saga';

const allSagas = [sharedSaga, mainSaga];

export default function* appSagas() {
  yield all(allSagas.map(fork));
}
