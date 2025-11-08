import { useContext } from 'react';
import { TransactionContext } from '../contexts/transactionContext';

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
}
