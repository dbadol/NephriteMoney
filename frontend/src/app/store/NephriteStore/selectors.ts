import { createSelector } from 'reselect';
import { AppState } from '@app/types/interface/State';
import { Decimal, Percent } from '@app/library/base/Decimal';

const selectMain = (state: AppState) => state.nephrite;

export const selectNephriteAppParams = () => createSelector(selectMain, (state) => state);

export const selectContractHeight = () => createSelector(selectMain, (state) => state.contractHeight);
export const selectUserView = () => createSelector(selectMain, (state) => state.userView);
export const selectTotal = () => createSelector(selectMain, (state) => state.total);
export const selectAllSystemTroves = () => createSelector(selectMain, (state) => state.troves);

export const selectRate = () => createSelector(selectMain, (state) => state.assetPrice);
export const selectRawIssueRate = () => createSelector(selectMain, (state) => state.appParams.issue_rate);
export const selectIssueRate = () => createSelector(selectMain, (state) => new Percent(Decimal.from(state.appParams.issue_rate).toString(1)));
export const selectRawRedeemRate = () => createSelector(selectMain, (state) => state.appParams.redeem_rate);
export const selectRedeemRate = () => createSelector(selectMain, (state) => new Percent(Decimal.from(state.appParams.redeem_rate).toString(1)));
export const selectPopupsState = () => createSelector(selectMain,
    (state) => state.popupsState);


