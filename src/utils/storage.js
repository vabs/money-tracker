import { formatLocalDate } from './dates';

const STORAGE_KEY = 'money-tracker-v2';

/**
 * Load all profiles data from localStorage
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
 * Save all profiles data to localStorage
 */
export function saveToLocalStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
 * Fetch baseline data from public folder
 */
export async function fetchBaselineData() {
  try {
    const basePath = import.meta.env.BASE_URL || '/';
    const url = `${basePath}transactions.json`.replace('//', '/');
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions.json');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching baseline data:', error);
    // Return default structure with one default profile
    const defaultProfileId = crypto.randomUUID();
    return {
      version: '2.0.0',
      profiles: {
        [defaultProfileId]: {
          id: defaultProfileId,
          name: 'Default',
          emoji: '👤',
          color: '#4ade80',
          config: {
            initialAmount: 1000,
            annualInterestRate: 7,
            startDate: formatLocalDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
          },
          transactions: [],
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
      },
      activeProfileId: defaultProfileId,
      lastModified: new Date().toISOString()
    };
  }
}

/**
 * Merge baseline and localStorage data
 * localStorage data takes precedence
 */
export function mergeData(baseline, localData) {
  if (!localData) {
    return baseline;
  }

  // Use local data if it exists, otherwise use baseline
  return {
    ...baseline,
    ...localData,
    lastModified: new Date().toISOString()
  };
}

/**
 * Get active profile from data
 */
export function getActiveProfile(data) {
  if (!data || !data.profiles || !data.activeProfileId) {
    return null;
  }
  return data.profiles[data.activeProfileId] || null;
}

/**
 * Create a new profile
 */
export function createProfile(name, emoji, config) {
  const profileId = crypto.randomUUID();
  return {
    id: profileId,
    name,
    emoji,
    color: '#4ade80', // Default color, can be customized
    config: {
      initialAmount: config.initialAmount || 1000,
      annualInterestRate: config.annualInterestRate || 7,
      startDate: config.startDate || formatLocalDate(new Date())
    },
    transactions: [],
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
}

/**
 * Export data as JSON file
 */
export function exportData(data, profileId = null) {
  let exportData = data;
  let filename = 'money-tracker-data.json';
  
  // If profileId is provided, export only that profile
  if (profileId && data.profiles && data.profiles[profileId]) {
    const profile = data.profiles[profileId];
    exportData = {
      version: '2.0.0',
      profiles: {
        [profileId]: profile
      },
      activeProfileId: profileId,
      lastModified: new Date().toISOString()
    };
    filename = `money-tracker-${profile.name.toLowerCase().replace(/\s+/g, '-')}.json`;
  }
  
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
