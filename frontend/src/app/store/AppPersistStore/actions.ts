import { createAction, createAsyncAction } from 'typesafe-actions';

const enum AppPersistActionType {
    START_ALERT_WINDOW_ALREADY_USED = '@@APP_PERSIST/IS_START_ALERT_WINDOW_ALREADY_USED',
}

export const startAlertWindowAlreadyUsed = createAction(AppPersistActionType.START_ALERT_WINDOW_ALREADY_USED)<boolean>();