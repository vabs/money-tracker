import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MoneyDisplay from '../components/MoneyDisplay';
import GrowthChart from '../components/GrowthChart';
import ThemeSelector from '../components/ThemeSelector';
import ProfileSelector from '../components/ProfileSelector';
import ProfileManager from '../components/ProfileManager';
import { getCurrentValue } from '../utils/calculations';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../hooks/useTheme';

export default function Home() {
  const navigate = useNavigate();
  const { config, transactions } = useTransactions();
  const { theme } = useTheme();
  const [showChart, setShowChart] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);

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
        <ProfileSelector onManageClick={() => setShowProfileManager(true)} />
      </div>

      {/* Theme Selector - Top Right */}
      <ThemeSelector />
      
      <MoneyDisplay
        amount={currentAmount}
        interestRate={config.annualInterestRate}
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
        <GrowthChart onClose={() => setShowChart(false)} />
      )}

      {showProfileManager && (
        <ProfileManager onClose={() => setShowProfileManager(false)} />
      )}
    </div>
  );
}
