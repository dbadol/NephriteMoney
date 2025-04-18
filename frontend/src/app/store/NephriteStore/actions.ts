import { createAsyncAction, createAction } from 'typesafe-actions';

export const setAppParams = createAction('@@MAIN/SET_PARAMS')<any>();
export const setUserView = createAction('@@MAIN/SET_USER_VIEW')<any>();
export const setIsModerator = createAction('@@MAIN/SET_IS_MODERATOR')<boolean>();
export const setPublicKey = createAction('@@MAIN/SET_PUBLIC_KEY')<string>();
export const setProposalsState = createAction('@@MAIN/SET_PROPOSALS_STATE')<{is_active: boolean, type: string}>();
export const setPopupState = createAction('@@MAIN/SET_POPUP_STATE')<{type: string, state: boolean}>();
export const loadAppParams = createAsyncAction(
    '@@MAIN/LOAD_PARAMS',
    '@@MAIN/LOAD_PARAMS_SUCCESS',
    '@@MAIN/LOAD_PARAMS_FAILURE',
)<void, any/* NephriteAppParams */, any>();

export const loadUserView = createAsyncAction(
    '@@MAIN/LOAD_USER_VIEW',
    '@@MAIN/LOAD_USER_VIEW_SUCCESS',
    '@@MAIN/LOAD_USER_VIEW_FAILURE',
)<void, any/* NephriteAppParams */, any>();

export const loadContractInfo = createAsyncAction(
    '@@MAIN/LOAD_CONTRACT_INFO',
    '@@MAIN/LOAD_CONTRACT_INFO_SUCCESS',
    '@@MAIN/LOAD_CONTRACT_INFO_FAILURE',
)<void, number, any>();

export const loadOpenTroves = createAsyncAction(
    '@@MAIN/LOAD_OPEN_TROVES',
    '@@MAIN/LOAD_OPEN_TROVES_SUCCESS',
    '@@MAIN/LOAD_OPEN_TROVES_FAILURE',
)<void, any, any>();

export const loadRate = createAsyncAction(
    '@@MAIN/GET_RATE',
    '@@MAIN/GET_RATE_SUCCESS',
    '@@MAIN/GET_RATE_FAILURE',
  )<void, number, any>();
