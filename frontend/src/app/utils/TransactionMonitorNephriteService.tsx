import { TransactionContext, useTransactionState } from "@app/library/transaction-react/context/TransactionContext";
import { TransactionsBatch } from "@app/library/transaction-react/context/TransactionProvider";
import { selectContractHeight } from "@app/store/NephriteStore/selectors";
import { selectTransactions } from "@app/store/SharedStore/selectors";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dictionary } from "typescript-collections";

export type TransactionActionType = "trove close" | "trove open" | "trove modify" | "troves liquidate" |
  "update stab pool" |
  "surplus withdraw" | "redeem" | string;



export const TransactionMonitorNephriteService = () => {
  const { transactionsState, setTransactionState } = useTransactionState();

  const transactions = useSelector(selectTransactions());
  const contractHeight = useSelector(selectContractHeight());

  useEffect(() => {


    if (transactionsState.size() && transactionsState.values().some(
      transaction => ["waitingForApproval", "waitingForConfirmation"/* , "pending" */].includes(transaction.type)
    )) return;


    for (let transaction of transactions) {
      const isPending = [0, 1, 5].includes(transaction.status);
      const isAlreadyAdded = transactionsState.values().find(addedTransaction => addedTransaction.txId == transaction.txId);

      if (isPending && !isAlreadyAdded /* && transaction.height <= contractHeight */) {
        setTransactionState(
          { txId: transaction.txId, id: transaction.comment, type: "pending" }
        )
        return;
      }

      if (transaction.status == 3 && isAlreadyAdded) {
        setTransactionState({ type: "completed", id: transaction.comment });
        return;
      }

      if (transaction.status == 4 && isAlreadyAdded) {
        setTransactionState({ type: "failed", id: transaction.comment, error: new Error(transaction.status_string) });
        return;
      }
    }

    return () => {
    }


  }, [transactions]);

  return <></>;

}
