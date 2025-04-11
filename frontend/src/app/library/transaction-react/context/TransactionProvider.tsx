import React, { useCallback, useReducer, useRef, useState } from 'react';
import { TransactionState } from '../types';
import { TransactionContext } from './TransactionContext';
import { Dictionary } from 'typescript-collections';

export type TransactionsBatch = Dictionary<string, TransactionState>;


export const TransactionProvider/* : React.FC */ = ({ children }) => {
  const transactionsState = useRef<TransactionsBatch>(new Dictionary(/* funcDictionaryStringConverter */));
  const [, rerender] = useReducer(p => !p, false);

  const deepCopyDictionary = (fromDictionary: TransactionsBatch, newDictionaryInitializer: Function = null): TransactionsBatch => {

    const newDictionary = !!newDictionaryInitializer && typeof newDictionaryInitializer === "function" ?
      newDictionaryInitializer(/* maybe implement some params */) :
      new Dictionary();

    fromDictionary.forEach((key, value) => {
      newDictionary.setValue(key, value);
    });


    return newDictionary;
  }

  const setTransactionState = (transactionState: TransactionState) => {
    const transactionUiId = transactionState.id;

    const copiedDictionary: TransactionsBatch = deepCopyDictionary(transactionsState.current);

    if (
      transactionState.type === "idle" || transactionState.type === "completed"
    ) copiedDictionary.remove(transactionUiId);
    else copiedDictionary.setValue(transactionUiId, transactionState);

    transactionsState.current = copiedDictionary;

    rerender();


  }

  return (
    <TransactionContext.Provider value={{ transactionsState: transactionsState.current, setTransactionState }}>{children}</TransactionContext.Provider>
  );
};
