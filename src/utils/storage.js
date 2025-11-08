const STORAGE_KEY = 'money-tracker-transactions';

/**
 * Load transactions from localStorage
 */
export function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Save transactions to localStorage
 */
export function saveToLocalStorage(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Clear localStorage
 */
export function clearLocalStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Fetch baseline transactions from public folder
 */
export async function fetchBaselineTransactions() {
  try {
    // Use import.meta.env.BASE_URL to handle different base paths
    const basePath = import.meta.env.BASE_URL || '/';
    const url = `${basePath}transactions.json`.replace('//', '/');
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions.json');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching baseline transactions:', error);
    // Return default structure if file doesn't exist
    return {
      config: {
        initialAmount: 1000,
        annualInterestRate: 7,
        startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]
      },
      transactions: [],
      version: '1.0.0',
      lastModified: new Date().toISOString()
    };
  }
}

/**
 * Merge baseline and localStorage transactions
 * localStorage transactions take precedence
 */
export function mergeTransactions(baseline, localData) {
  if (!localData) {
    return baseline;
  }

  // Merge: Start with baseline transactions, then add/override with local ones
  const baselineTransactions = baseline.transactions || [];
  const mergedTransactions = [...baselineTransactions];

  // Add local transactions that aren't in baseline
  localData.transactions?.forEach(localTx => {
    const existingIndex = mergedTransactions.findIndex(t => t.id === localTx.id);
    if (existingIndex === -1) {
      mergedTransactions.push(localTx);
    } else {
      // Override baseline with local version
      mergedTransactions[existingIndex] = localTx;
    }
  });

  // Sort by date
  mergedTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    ...baseline,
    transactions: mergedTransactions,
    lastModified: new Date().toISOString()
  };
}

/**
 * Export transactions as JSON file
 */
export function exportTransactions(data) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'transactions.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
