import { useState, useEffect } from 'react';
import { 
  fetchBaselineData, 
  loadFromLocalStorage, 
  saveToLocalStorage, 
  mergeData,
  exportData as exportDataUtil,
  clearLocalStorage,
  getActiveProfile,
  createProfile as createProfileUtil
} from '../utils/storage';
import { TransactionContext } from './transactionContext';
import { formatLocalDate } from '../utils/dates';

export function TransactionProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const baseline = await fetchBaselineData();
        const localData = loadFromLocalStorage();
        const merged = mergeData(baseline, localData);
        
        // Trim profile names to 50 characters if they exceed the limit
        if (merged.profiles) {
          Object.keys(merged.profiles).forEach(profileId => {
            const profile = merged.profiles[profileId];
            if (profile.name && profile.name.length > 50) {
              merged.profiles[profileId].name = profile.name.substring(0, 50);
            }
          });
        }
        
        setData(merged);
      } catch (err) {
        setError(err.message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Get current active profile
  const currentProfile = data ? getActiveProfile(data) : null;

  // Switch active profile
  const switchProfile = (profileId) => {
    if (!data || !data.profiles || !data.profiles[profileId]) {
      console.error('Profile not found:', profileId);
      return false;
    }

    const updatedData = {
      ...data,
      activeProfileId: profileId,
      lastModified: new Date().toISOString()
    };

    setData(updatedData);
    saveToLocalStorage(updatedData);
    return true;
  };

  // Add new profile
  const addProfile = (name, emoji, config) => {
    const newProfile = createProfileUtil(name, emoji, config);
    
    const updatedData = {
      ...data,
      profiles: {
        ...data.profiles,
        [newProfile.id]: newProfile
      },
      activeProfileId: newProfile.id, // Switch to new profile
      lastModified: new Date().toISOString()
    };

    setData(updatedData);
    saveToLocalStorage(updatedData);
    return newProfile.id;
  };

  // Update profile config
  const updateProfile = (profileId, updates) => {
    if (!data || !data.profiles || !data.profiles[profileId]) {
      console.error('Profile not found:', profileId);
      return false;
    }

    const updatedProfile = {
      ...data.profiles[profileId],
      ...updates,
      lastModified: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      profiles: {
        ...data.profiles,
        [profileId]: updatedProfile
      },
      lastModified: new Date().toISOString()
    };

    setData(updatedData);
    saveToLocalStorage(updatedData);
    return true;
  };

  // Delete profile
  const deleteProfile = (profileId) => {
    if (!data || !data.profiles || !data.profiles[profileId]) {
      console.error('Profile not found:', profileId);
      return false;
    }

    // Prevent deleting the last profile
    const profileIds = Object.keys(data.profiles);
    if (profileIds.length === 1) {
      console.error('Cannot delete the last profile');
      return false;
    }

    // Remove the profile
    const { [profileId]: _removed, ...remainingProfiles } = data.profiles;

    // If deleting active profile, switch to first remaining profile
    const newActiveProfileId = data.activeProfileId === profileId
      ? Object.keys(remainingProfiles)[0]
      : data.activeProfileId;

    const updatedData = {
      ...data,
      profiles: remainingProfiles,
      activeProfileId: newActiveProfileId,
      lastModified: new Date().toISOString()
    };

    setData(updatedData);
    saveToLocalStorage(updatedData);
    return true;
  };

  // Add transaction to current profile
  const addTransaction = (transaction) => {
    if (!currentProfile) {
      console.error('No active profile');
      return;
    }

    const newTransaction = {
      id: crypto.randomUUID(),
      date: transaction.date || formatLocalDate(new Date()),
      amount: parseFloat(transaction.amount),
      type: transaction.type || 'addition',
      note: transaction.note || '',
      createdAt: new Date().toISOString()
    };

    const updatedProfile = {
      ...currentProfile,
      transactions: [...(currentProfile.transactions || []), newTransaction],
      lastModified: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      profiles: {
        ...data.profiles,
        [currentProfile.id]: updatedProfile
      },
      lastModified: new Date().toISOString()
    };

    setData(updatedData);
    saveToLocalStorage(updatedData);
  };

  // Delete transaction from current profile
  const deleteTransaction = (id) => {
    if (!currentProfile) {
      console.error('No active profile');
      return;
    }

    const updatedProfile = {
      ...currentProfile,
      transactions: currentProfile.transactions.filter(t => t.id !== id),
      lastModified: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      profiles: {
        ...data.profiles,
        [currentProfile.id]: updatedProfile
      },
      lastModified: new Date().toISOString()
    };

    setData(updatedData);
    saveToLocalStorage(updatedData);
  };

  // Export data (all profiles or current profile only)
  const exportData = (currentProfileOnly = false) => {
    if (data) {
      const profileId = currentProfileOnly && currentProfile ? currentProfile.id : null;
      exportDataUtil(data, profileId);
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
    const baseline = await fetchBaselineData();
    setData(baseline);
  };

  const value = {
    data,
    loading,
    error,
    profiles: data?.profiles || {},
    activeProfileId: data?.activeProfileId,
    currentProfile,
    switchProfile,
    addProfile,
    updateProfile,
    deleteProfile,
    addTransaction,
    deleteTransaction,
    exportData,
    importData,
    resetToBaseline,
    // Legacy support - expose current profile's config and transactions
    config: currentProfile?.config || {},
    transactions: currentProfile?.transactions || []
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
