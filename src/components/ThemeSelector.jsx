import { useState, useRef, useEffect } from 'react';
import { themes } from '../themes';
import { useTheme } from '../hooks/useTheme';

export default function ThemeSelector() {
  const { themeKey: currentTheme, theme: activeTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const styles = {
    container: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000
    },
    buttonWrapper: {
      backgroundColor: activeTheme.background,
      padding: '8px',
      borderRadius: '12px',
      border: `2px solid ${activeTheme.accent}`,
      boxShadow: `0 4px 12px ${activeTheme.accent}40`
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      backgroundColor: activeTheme.background,
      padding: '8px',
      borderRadius: '12px',
      border: `2px solid ${activeTheme.accent}`,
      boxShadow: `0 4px 16px ${activeTheme.accent}60`,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      animation: 'slideDown 0.2s ease'
    },
    toggleButton: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      border: `3px solid ${activeTheme.accent}`,
      backgroundColor: activeTheme.accent + '40',
      cursor: 'pointer',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      outline: 'none'
    },
    button: (themeKey) => {
      const optionTheme = themes[themeKey];
      const isActive = currentTheme === themeKey;
      return {
        width: '40px',
        height: '40px',
        borderRadius: '8px',
      border: isActive ? `3px solid ${optionTheme.accent}` : '2px solid transparent',
      backgroundColor: isActive ? optionTheme.accent + '40' : 'transparent',
      cursor: 'pointer',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      outline: 'none'
      };
    }
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <div style={styles.buttonWrapper}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={styles.toggleButton}
          title={`Current theme: ${activeTheme.name}`}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {activeTheme.icon}
        </button>
      </div>
      
      {isOpen && (
        <div style={styles.dropdown}>
          {Object.keys(themes).map((themeKey) => (
            themeKey !== currentTheme && (
              <button
                key={themeKey}
                onClick={() => {
                  setTheme(themeKey);
                  setIsOpen(false);
                }}
                style={styles.button(themeKey)}
                title={themes[themeKey].name}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = themes[themeKey].accent + '20';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {themes[themeKey].icon}
              </button>
            )
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
