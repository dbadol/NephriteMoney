import { createAction, createAsyncAction } from 'typesafe-actions';

const enum TroveActionType {
    SET_USER_TROVE = '@@USER_TROVES/SET_USER_TROVE',
    SET_USER_TROVE_STATUS = '@@USER_TROVES/SET_USER_TROVE_STATUS',

    START_CHANGE_USER_TROVE = '@@USER_TROVES/START_CHANGE_USER_TROVE',
    FINISH_CHANGE_USER_TROVE = '@@USER_TROVES/FINISH_CHANGE_USER_TROVE',
    SET_COLLATERAL_CHANGE_USER_TROVE = '@@USER_TROVES/SET_COLLATERAL_CHANGE_USER_TROVE',
    SET_DEBT_CHANGE_USER_TROVE = '@@USER_TROVES/SET_DEBT_CHANGE_USER_TROVE',
    ADD_MINIMUM_DEBT_CHANGE_USER_TROVE = '@@USER_TROVES/ADD_MINIMUM_DEBT_CHANGE_USER_TROVE',
    REMOVE_MINIMUM_DEBT_CHANGE_USER_TROVE = '@@USER_TROVES/REMOVE_MINIMUM_DEBT_CHANGE_USER_TROVE',
    REVERT_USER_TROVE_TO_INITIAL = '@@USER_TROVES/REVERT_USER_TROVE_TO_INITIAL',
    REVERT_USER_SURPLUS_TO_INITIAL = '@@USER_TROVES/REVERT_USER_SURPLUS_TO_INITIAL',
    UPDATE_USER_TROVE = '@@USER_TROVES/UPDATE_USER_TROVE',
    SET_STATUS_USER_TROVE = '@@USER_TROVES/SET_STATUS_USER_TROVE',
}

export const setUserTroveStatus = createAction(TroveActionType.SET_USER_TROVE_STATUS)<string>();
export const setUserTrove = createAction(TroveActionType.SET_USER_TROVE)<any>();

export const loadUserTrove = createAsyncAction(
    '@@USER_TROVES/LOAD_USER_TROVE',
    '@@USER_TROVES/LOAD_USER_TROVE_SUCCESS',
    '@@USER_TROVES/LOAD_USER_TROVE_FAILURE',
)<ArrayBuffer, any, any>();

export const loadUserSurplus = createAsyncAction(
    '@@USER_TROVES/LOAD_USER_SURPLUS',
    '@@USER_TROVES/LOAD_USER_SURPLUS_SUCCESS',
    '@@USER_TROVES/LOAD_USER_SURPLUS_FAILURE',
)<ArrayBuffer, any, any>();


export const setStatusUserTrove = createAction(TroveActionType.SET_STATUS_USER_TROVE)<string>();

export const startChangeUserTrove = createAction(TroveActionType.START_CHANGE_USER_TROVE)();
export const finishChangeUserTrove = createAction(TroveActionType.FINISH_CHANGE_USER_TROVE)();
export const setCollateralUsertrove = createAction(TroveActionType.SET_COLLATERAL_CHANGE_USER_TROVE)();
export const setDebtUsertrove = createAction(TroveActionType.SET_DEBT_CHANGE_USER_TROVE)();
export const addMinimumDebtUsertrove = createAction(TroveActionType.ADD_MINIMUM_DEBT_CHANGE_USER_TROVE)();
export const removeMinimumDebtUsertrove = createAction(TroveActionType.REMOVE_MINIMUM_DEBT_CHANGE_USER_TROVE)();
export const revertUserTroveToInitial = createAction(TroveActionType.REVERT_USER_TROVE_TO_INITIAL)();
export const revertUserSurplusToInitial = createAction(TroveActionType.REVERT_USER_SURPLUS_TO_INITIAL)();
export const updateUserTroveToInitial = createAction(TroveActionType.UPDATE_USER_TROVE)();
