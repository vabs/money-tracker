import { themes } from '../themes';

export default function ThemeSelector({ currentTheme, onThemeChange }) {
  const styles = {
    container: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      gap: '8px',
      backgroundColor: themes[currentTheme].background,
      padding: '8px',
      borderRadius: '12px',
      border: `2px solid ${themes[currentTheme].accent}`,
      boxShadow: `0 4px 12px ${themes[currentTheme].accent}40`
    },
    button: (themeKey) => ({
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      border: currentTheme === themeKey 
        ? `3px solid ${themes[currentTheme].accent}` 
        : '2px solid transparent',
      backgroundColor: currentTheme === themeKey 
        ? themes[themeKey].accent + '40' 
        : 'transparent',
      cursor: 'pointer',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      outline: 'none'
    })
  };

  return (
    <div style={styles.container}>
      {Object.keys(themes).map((themeKey) => (
        <button
          key={themeKey}
          onClick={() => onThemeChange(themeKey)}
          style={styles.button(themeKey)}
          title={themes[themeKey].name}
          onMouseOver={(e) => {
            if (currentTheme !== themeKey) {
              e.target.style.backgroundColor = themes[themeKey].accent + '20';
            }
          }}
          onMouseOut={(e) => {
            if (currentTheme !== themeKey) {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          {themes[themeKey].icon}
        </button>
      ))}
    </div>
  );
}
