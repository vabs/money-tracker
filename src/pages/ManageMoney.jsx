import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, getCurrentValue } from '../utils/calculations';
import { themes, defaultTheme } from '../themes';

export default function ManageMoney() {
  const navigate = useNavigate();
  const { config, transactions, addTransaction, deleteTransaction, exportData } = useTransactions();
  const [currentTheme] = useState(defaultTheme);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('addition');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const theme = themes[currentTheme];

  const quickAmounts = [5, 10, 20, 50, 100];

  // Calculate current balance
  const currentBalance = useMemo(() => {
    if (!config.initialAmount) return 0;
    return getCurrentValue(
      config.initialAmount,
      config.annualInterestRate,
      config.startDate,
      transactions
    );
  }, [config, transactions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Validate withdrawal amount
    if (type === 'withdrawal' && parseFloat(amount) > currentBalance) {
      alert(`Cannot withdraw more than your current balance of ${formatCurrency(currentBalance)}`);
      return;
    }

    addTransaction({
      amount: parseFloat(amount),
      type,
      date,
      note
    });

    // Reset form
    setAmount('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleQuickAdd = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: theme.background,
      padding: '20px',
      paddingBottom: '100px'
    },
    header: {
      maxWidth: '600px',
      margin: '0 auto',
      marginBottom: '32px'
    },
    backButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: theme.text,
      padding: '8px',
      marginBottom: '16px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: theme.text,
      margin: '0'
    },
    form: {
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: theme.background,
      padding: '24px',
      borderRadius: '16px',
      border: `2px solid ${theme.accent}`,
      marginBottom: '32px'
    },
    typeSelector: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px'
    },
    typeButton: (isActive) => ({
      flex: 1,
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: isActive ? theme.text : theme.text + '80',
      backgroundColor: isActive ? theme.accent : 'transparent',
      border: `2px solid ${isActive ? theme.accent : theme.text + '30'}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }),
    inputGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: theme.text
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      borderRadius: '8px',
      border: `2px solid ${theme.accent}`,
      backgroundColor: theme.background,
      color: theme.text,
      outline: 'none'
    },
    quickButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginTop: '12px'
    },
    quickButton: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      color: theme.text,
      backgroundColor: theme.accent + '40',
      border: `2px solid ${theme.accent}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    submitButton: {
      width: '100%',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      color: theme.text,
      backgroundColor: theme.accent,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '8px'
    },
    transactionList: {
      maxWidth: '600px',
      margin: '0 auto'
    },
    transactionItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: theme.background,
      border: `2px solid ${theme.accent}`,
      borderRadius: '12px'
    },
    transactionInfo: {
      flex: 1
    },
    transactionAmount: (txType) => ({
      fontSize: '18px',
      fontWeight: '700',
      color: txType === 'addition' ? theme.graphLine : '#ef4444',
      marginBottom: '4px'
    }),
    transactionDate: {
      fontSize: '14px',
      color: theme.text,
      opacity: 0.7
    },
    deleteButton: {
      padding: '8px 12px',
      fontSize: '14px',
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    exportButton: {
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      color: theme.text,
      backgroundColor: theme.accent,
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: `0 4px 16px ${theme.accent}60`,
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          style={styles.backButton}
          onClick={() => navigate('/')}
          title="Back to Home"
        >
          ← Back
        </button>
        <h1 style={styles.title}>Manage Money</h1>
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.typeSelector}>
          <button
            type="button"
            style={styles.typeButton(type === 'addition')}
            onClick={() => setType('addition')}
          >
            💵 Add Money
          </button>
          <button
            type="button"
            style={styles.typeButton(type === 'withdrawal')}
            onClick={() => setType('withdrawal')}
          >
            💸 Withdraw Money
          </button>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Amount
            {type === 'withdrawal' && (
              <span style={{ fontSize: '12px', opacity: 0.7, marginLeft: '8px' }}>
                (Max: {formatCurrency(currentBalance)})
              </span>
            )}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max={type === 'withdrawal' ? currentBalance : undefined}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={styles.input}
          />
          <div style={styles.quickButtons}>
            {quickAmounts.map(qa => (
              <button
                key={qa}
                type="button"
                style={styles.quickButton}
                onClick={() => handleQuickAdd(qa)}
              >
                ${qa}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Note (Optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Birthday gift, Salary"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.submitButton}>
          {type === 'addition' ? '➕ Add' : '➖ Withdraw'}
        </button>
      </form>

      {transactions.length > 0 && (
        <div style={styles.transactionList}>
          <h2 style={{ ...styles.title, fontSize: '24px', marginBottom: '16px' }}>
            Transaction History
          </h2>
          {[...transactions].reverse().map(tx => (
            <div key={tx.id} style={styles.transactionItem}>
              <div style={styles.transactionInfo}>
                <div style={styles.transactionAmount(tx.type)}>
                  {tx.type === 'addition' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                </div>
                <div style={styles.transactionDate}>
                  {new Date(tx.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  {tx.note && ` • ${tx.note}`}
                </div>
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => {
                  if (confirm('Delete this transaction?')) {
                    deleteTransaction(tx.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        style={styles.exportButton}
        onClick={exportData}
        title="Export transactions.json"
      >
        📥 Export
      </button>
    </div>
  );
}
