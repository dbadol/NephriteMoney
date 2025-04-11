import { createAction, createAsyncAction } from 'typesafe-actions';

const enum StabilityDepositActionType {
    UPDATE_STABILITY_DEPOSIT = '@@STABILITY_DEPOSIT/UPDATE_STABILITY_DEPOSIT',
    REVERT_USER_STABILITY_DEPOSIT_TO_INITIAL = '@@STABILITY_DEPOSIT/REVERT_USER_STABILITY_DEPOSIT_TO_INITIAL',

    START_CHANGE_USER_TROVE = '@@USER_TROVES/START_CHANGE_STABILITY_DEPOSIT',
    FINISH_CHANGE_USER_TROVE = '@@USER_TROVES/FINISH_CHANGE_STABILITY_DEPOSIT',
}



export const updateStabilityDeposit = createAction(StabilityDepositActionType.UPDATE_STABILITY_DEPOSIT)<string>();


export const revertUserStabilityDepositToInitial = createAction(StabilityDepositActionType.REVERT_USER_STABILITY_DEPOSIT_TO_INITIAL)();

export const startChangeUserStabilityDeposit = createAction(StabilityDepositActionType.START_CHANGE_USER_TROVE)();
export const finishChangeUserStabilityDeposit = createAction(StabilityDepositActionType.FINISH_CHANGE_USER_TROVE)();

export const loadUserStabilityDeposit = createAsyncAction(
    '@@MAIN/LOAD_USER_STABILITY_DEPOSIT',
    '@@MAIN/LOAD_USER_STABILITY_DEPOSIT_SUCCESS',
    '@@MAIN/LOAD_USER_STABILITY_DEPOSIT_FAILURE',
)<ArrayBuffer, any, any>();
