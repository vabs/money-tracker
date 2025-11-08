import { useState, useEffect } from 'react';
import MoneyDisplay from './components/MoneyDisplay';
import GrowthChart from './components/GrowthChart';
import ThemeSelector from './components/ThemeSelector';
import { getCurrentValue } from './utils/calculations';
import { config } from './config';
import { themes, defaultTheme } from './themes';

function App() {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [showChart, setShowChart] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);

  useEffect(() => {
    // Calculate current value based on config
    const amount = getCurrentValue(
      config.initialAmount,
      config.annualInterestRate,
      config.startDate
    );
    setCurrentAmount(amount);
  }, []);

  const theme = themes[currentTheme];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.background,
      transition: 'background-color 0.3s ease',
      position: 'relative'
    }}>
      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />
      
      <MoneyDisplay
        amount={currentAmount}
        interestRate={config.annualInterestRate}
        theme={theme}
        onGraphClick={() => setShowChart(true)}
      />

      {showChart && (
        <GrowthChart
          theme={theme}
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  );
}

export default App;
