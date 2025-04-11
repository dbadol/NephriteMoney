import { createSelector } from "reselect";

const selectTrove = (state) => state.appPersist;

export const selectStartAlertWindowAlreadyUsed = () => createSelector(selectTrove, (state) => {
    return state.startAlertWindowAlreadyUsed;
});