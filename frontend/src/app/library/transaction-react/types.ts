type TransactionIdle = {
  type: 'idle';
};

type TransactionPending = {
  type: 'pending';
  id: string;
};

type TransactionRegistering = {
  type: 'registering';
  id: string;
};

type TransactionFailed = {
  type: 'failed';
  id: string;
  error: Error;
};

type TransactionWaitingForApproval = {
  type: 'waitingForApproval';
  id: string;
};

type TransactionCancelled = {
  type: 'cancelled';
  id: string;
};

type TransactionWaitingForConfirmations = {
  type: 'waitingForConfirmation';
  id: string;
  tx: any ;
};

type TransactionCompleted = {
  type: 'completed';
  id: string;
};

export type TransactionState = (TransactionIdle
  | TransactionPending
  | TransactionRegistering
  | TransactionFailed
  | TransactionWaitingForApproval
  | TransactionCancelled
  | TransactionWaitingForConfirmations
  | TransactionCompleted) & { txId?: any };

export type TransactionFunction = (
  overrides?,
) => Promise<any>;


export type TransactionProgressDonutProps = any;
