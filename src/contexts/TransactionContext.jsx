import { useState, useEffect } from 'react';
import { 
  fetchBaselineTransactions, 
  loadFromLocalStorage, 
  saveToLocalStorage, 
  mergeTransactions,
  exportTransactions,
  clearLocalStorage
} from '../utils/storage';
import { TransactionContext } from './transactionContext';

export function TransactionProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const baseline = await fetchBaselineTransactions();
        const localData = loadFromLocalStorage();
        const merged = mergeTransactions(baseline, localData);
        setData(merged);
      } catch (err) {
        setError(err.message);
        console.error('Error loading transactions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Add transaction
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: crypto.randomUUID(),
      date: transaction.date || new Date().toISOString().split('T')[0],
      amount: parseFloat(transaction.amount),
      type: transaction.type || 'addition',
      note: transaction.note || '',
      createdAt: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      transactions: [...(data.transactions || []), newTransaction],
      lastModified: new Date().toISOString()
    };

    setData(updatedData);
    saveToLocalStorage(updatedData);
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    const updatedData = {
      ...data,
      transactions: data.transactions.filter(t => t.id !== id),
      lastModified: new Date().toISOString()
    };

    setData(updatedData);
    saveToLocalStorage(updatedData);
  };

  // Export data
  const exportData = () => {
    if (data) {
      exportTransactions(data);
    }
  };

  // Import data
  const importData = (importedData) => {
    try {
      setData(importedData);
      saveToLocalStorage(importedData);
      return true;
    } catch (err) {
      console.error('Error importing data:', err);
      return false;
    }
  };

  // Reset to baseline (clear localStorage)
  const resetToBaseline = async () => {
    clearLocalStorage();
    const baseline = await fetchBaselineTransactions();
    setData(baseline);
  };

  const value = {
    data,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    exportData,
    importData,
    resetToBaseline,
    config: data?.config || {},
    transactions: data?.transactions || []
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
