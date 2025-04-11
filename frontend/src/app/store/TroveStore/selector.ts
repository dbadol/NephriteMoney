import { createSelector } from 'reselect';
import { AppState } from '@app/types/interface';

const selectTrove = (state: AppState) => state.trove;

export const selectUserTroveStatus = () => createSelector(selectTrove, (state) => {
    return state.instance?.status ?? "nonExistent"
});

export const selectUserTrove = () => createSelector(selectTrove, (state) => state.instance);
export const selectUserSurplus = () => createSelector(selectTrove, (state) => state.surplus);
export const selectForTroveManager = () => createSelector(selectTrove, (state) => ({
    originalTrove: state.instance
}))

