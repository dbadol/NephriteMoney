import { NephriteAppParams, UserViewParams } from '@core/types';

export interface NephriteStateType {
  appParams: NephriteAppParams;
  is_moderator: boolean;
  public_key: string;
  contractHeight: number;
  userView: UserViewParams;
  totalsView: UserViewParams;
  rate: number;
  popupsState: {
    deposit: boolean;
    withdraw: boolean;
    pkey: boolean;
  }
}
