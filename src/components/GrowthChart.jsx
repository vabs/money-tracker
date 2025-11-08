import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { generateGrowthData, getDaysForRange, formatCurrency } from '../utils/calculations';
import { useTransactions } from '../hooks/useTransactions';

export default function GrowthChart({ theme, onClose }) {
  const { config, transactions } = useTransactions();
  const [selectedRange, setSelectedRange] = useState('1Y');
  
  const timeRanges = ['1M', '6M', '1Y', '5Y'];
  
  const chartData = useMemo(() => {
    const days = getDaysForRange(selectedRange);
    const data = generateGrowthData(
      config.initialAmount,
      config.annualInterestRate,
      config.startDate,
      days,
      transactions
    );
    
    // Sample data points for better performance on large datasets
    // But always keep points with transactions
    if (data.length > 100) {
      const step = Math.ceil(data.length / 100);
      return data.filter((item, index) => 
        index % step === 0 || 
        index === data.length - 1 || 
        item.hasTransaction
      );
    }
    
    return data;
  }, [selectedRange, config, transactions]);

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    },
    container: {
      backgroundColor: theme.background,
      borderRadius: '20px',
      padding: '32px',
      maxWidth: '1000px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: theme.text,
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '28px',
      cursor: 'pointer',
      color: theme.text,
      opacity: 0.6,
      padding: '4px 8px',
      lineHeight: 1
    },
    rangeSelector: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      flexWrap: 'wrap'
    },
    rangeButton: (isActive) => ({
      padding: '8px 20px',
      fontSize: '14px',
      fontWeight: '600',
      color: isActive ? theme.text : theme.text + '80',
      backgroundColor: isActive ? theme.accent : 'transparent',
      border: `2px solid ${isActive ? theme.accent : theme.text + '30'}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }),
    chartContainer: {
      width: '100%',
      height: '400px',
      marginTop: '20px'
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: theme.background,
            padding: '12px 16px',
            borderRadius: '8px',
            border: `2px solid ${theme.accent}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ margin: 0, color: theme.text, fontWeight: '600', fontSize: '16px' }}>
            {formatCurrency(payload[0].value)}
          </p>
          <p style={{ margin: '4px 0 0 0', color: theme.text, opacity: 0.7, fontSize: '14px' }}>
            Day {payload[0].payload.day}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Growth Over Time</h2>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseOver={(e) => e.target.style.opacity = '1'}
            onMouseOut={(e) => e.target.style.opacity = '0.6'}
          >
            ×
          </button>
        </div>
        
        <div style={styles.rangeSelector}>
          {timeRanges.map((range) => (
            <button
              key={range}
              style={styles.rangeButton(selectedRange === range)}
              onClick={() => setSelectedRange(range)}
              onMouseOver={(e) => {
                if (selectedRange !== range) {
                  e.target.style.backgroundColor = theme.accent + '30';
                }
              }}
              onMouseOut={(e) => {
                if (selectedRange !== range) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {range}
            </button>
          ))}
        </div>

        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 25 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.graphLine} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.graphLine} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.text + '20'} />
              <XAxis
                dataKey="day"
                stroke={theme.text}
                opacity={0.6}
                label={{ value: 'Days', position: 'insideBottom', offset: -10, fill: theme.text, fontWeight: 'bold', fontSize: 14 }}
              />
              <YAxis
                stroke={theme.text}
                opacity={0.6}
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                label={{ value: 'Amount', angle: -90, position: 'insideLeft', offset: 10, fill: theme.text, fontWeight: 'bold', fontSize: 14 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={theme.graphLine}
                strokeWidth={3}
                fill="url(#colorAmount)"
                fillOpacity={1}
              />
              {/* Transaction markers */}
              {chartData.filter(d => d.hasTransaction).map((point, idx) => (
                <ReferenceDot
                  key={`tx-${idx}`}
                  x={point.day}
                  y={point.amount}
                  r={6}
                  fill={theme.accent}
                  stroke={theme.text}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
