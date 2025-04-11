import { SharedStateType } from '@app/types/interface/SharedStateType';
import { NephriteStateType } from '@app/types/interface';

export interface AppState {
  shared: SharedStateType;
  trove: any;
  stabilityDeposit:any;
  nephrite: any;
  appPersist: any
}
