import { createSelector } from 'reselect';
import { AppState } from '@app/types/interface';

const selectStabilityDepositStore = (state: AppState) => state.stabilityDeposit;

export const selectStabilityDeposit = () => createSelector(selectStabilityDepositStore, (state) => state.instance);
export const selectForStabilityDepositManager = () => createSelector(selectStabilityDepositStore, (state) => ({
    originalDeposit: state.instance, editedNephrite: state.instance.currentNephrite, changePending: state.changePending
}))
