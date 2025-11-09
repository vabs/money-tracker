import { useEffect, useMemo, useState } from 'react';
import { themes, defaultTheme } from '../themes';
import { ThemeContext } from './themeContext';

export function ThemeProvider({ children }) {
  const getStoredTheme = () => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }
    const stored = localStorage.getItem('money-tracker-theme');
    return themes[stored] ? stored : defaultTheme;
  };

  const [themeKey, setThemeKey] = useState(getStoredTheme);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('money-tracker-theme', themeKey);
    }
  }, [themeKey]);

  const value = useMemo(() => {
    const selectedTheme = themes[themeKey] || themes[defaultTheme];
    return {
      themeKey,
      theme: selectedTheme,
      setTheme: (nextKey) => {
        if (themes[nextKey]) {
          setThemeKey(nextKey);
        }
      }
    };
  }, [themeKey]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
