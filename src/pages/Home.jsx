import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MoneyDisplay from '../components/MoneyDisplay';
import GrowthChart from '../components/GrowthChart';
import ThemeSelector from '../components/ThemeSelector';
import ProfileSelector from '../components/ProfileSelector';
import ProfileManager from '../components/ProfileManager';
import { getCurrentValue } from '../utils/calculations';
import { useTransactions } from '../hooks/useTransactions';
import { themes, defaultTheme } from '../themes';

export default function Home() {
  const navigate = useNavigate();
  const { config, transactions } = useTransactions();
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('money-tracker-theme');
    return saved || defaultTheme;
  });
  const [showChart, setShowChart] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);

  // Save theme to localStorage when it changes
  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('money-tracker-theme', newTheme);
  };

  useEffect(() => {
    if (config.initialAmount) {
      const amount = getCurrentValue(
        config.initialAmount,
        config.annualInterestRate,
        config.startDate,
        transactions
      );
      setCurrentAmount(amount);
    }
  }, [config, transactions]);

  const theme = themes[currentTheme];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.background,
      transition: 'background-color 0.3s ease',
      position: 'relative'
    }}>
      {/* Profile Selector - Top Left */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000
      }}>
        <ProfileSelector
          theme={theme}
          onManageClick={() => setShowProfileManager(true)}
        />
      </div>

      {/* Theme Selector - Top Right */}
      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />
      
      <MoneyDisplay
        amount={currentAmount}
        interestRate={config.annualInterestRate}
        theme={theme}
        onGraphClick={() => setShowChart(true)}
      />

      {/* Floating Add Money Button */}
      <button
        onClick={() => navigate('/manage')}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: theme.accent,
          border: 'none',
          fontSize: '32px',
          cursor: 'pointer',
          boxShadow: `0 4px 16px ${theme.accent}60`,
          transition: 'all 0.2s ease',
          zIndex: 100
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = `0 6px 20px ${theme.accent}80`;
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = `0 4px 16px ${theme.accent}60`;
        }}
        title="Manage Money"
      >
        💰
      </button>

      {showChart && (
        <GrowthChart
          theme={theme}
          onClose={() => setShowChart(false)}
        />
      )}

      {showProfileManager && (
        <ProfileManager
          theme={theme}
          onClose={() => setShowProfileManager(false)}
        />
      )}
    </div>
  );
}
