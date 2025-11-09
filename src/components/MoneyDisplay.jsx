import { formatCurrency } from '../utils/calculations';
import { useTheme } from '../hooks/useTheme';

export default function MoneyDisplay({ amount, interestRate, onGraphClick }) {
  const { theme } = useTheme();
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      transition: 'all 0.3s ease'
    },
    amountContainer: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    amount: {
      fontSize: 'clamp(48px, 12vw, 120px)',
      fontWeight: '700',
      color: theme.text,
      margin: '0',
      lineHeight: '1',
      letterSpacing: '-0.02em'
    },
    rate: {
      fontSize: 'clamp(18px, 3vw, 28px)',
      color: theme.text,
      opacity: '0.6',
      marginTop: '12px',
      fontWeight: '500'
    },
    graphButton: {
      padding: '14px 32px',
      fontSize: '16px',
      fontWeight: '600',
      color: theme.text,
      backgroundColor: theme.accent,
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: `0 4px 12px ${theme.accent}40`
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.amountContainer}>
        <h1 style={styles.amount}>
          {formatCurrency(amount)}
        </h1>
        <p style={styles.rate}>
          {interestRate}% annual rate
        </p>
      </div>
      <button
        style={styles.graphButton}
        onClick={onGraphClick}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = `0 6px 16px ${theme.accent}60`;
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = `0 4px 12px ${theme.accent}40`;
        }}
      >
        📊 View Growth Chart
      </button>
    </div>
  );
}
