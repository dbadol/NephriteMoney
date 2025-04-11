import { SystemState, Transaction } from '@core/types';

export interface SharedStateType {
  errorMessage: string | null;
  systemState: SystemState;
  transactions: Transaction[];
  isLoaded: boolean;
  dappVersion: any;
  adminKey: string;
}
