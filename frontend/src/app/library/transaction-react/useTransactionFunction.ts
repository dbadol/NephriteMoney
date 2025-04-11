import { useCallback } from "react";
import { useTransactionState } from "./context/TransactionContext";
import { TransactionState } from "./types";
import { Transaction } from '@app/library/base/transaction/types';
import { TransactionsBatch } from "./context/TransactionProvider";
import { delay } from "../base/appUtils";


export const useTransactionFunction = (
    id: string,
    send
  ): [sendTransaction: () => Promise<void>, transactionsState: TransactionsBatch] => {
    const {transactionsState,setTransactionState} = useTransactionState();

    const sendTransaction = useCallback(async () => {
      setTransactionState({ type: "waitingForApproval", id });

      try {
        const tx = await send();

        setTransactionState({
          type: "waitingForConfirmation",
          id,
          tx
        });

      } catch (error) {

          const errorMessage = error.message ? `(${error.message})` : '';

          setTransactionState({
            type: "failed",
            id,
            error: new Error(`Failed to send transaction ${errorMessage}`)
          });
      }
    }, [send, id, setTransactionState]);

    return [sendTransaction, transactionsState];
  };
