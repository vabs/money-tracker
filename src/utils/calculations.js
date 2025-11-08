/**
 * Calculate compound interest for a given number of days
 * Formula: A = P(1 + r/n)^(nt)
 * Where:
 * - P = principal (initial amount)
 * - r = annual interest rate (as decimal)
 * - n = number of times interest is compounded per year (365 for daily)
 * - t = time in years
 */
export function calculateCompoundInterest(principal, annualRate, days) {
  const r = annualRate / 100; // Convert percentage to decimal
  const n = 365; // Daily compounding
  const t = days / 365; // Convert days to years
  
  return principal * Math.pow(1 + r / n, n * t);
}

/**
 * Generate day-by-day growth data with transactions
 * @param {number} initialAmount - Starting amount
 * @param {number} annualRate - Annual interest rate as percentage
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {number} days - Number of days to generate
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Array of {date, amount, day, hasTransaction} objects
 */
export function generateGrowthData(initialAmount, annualRate, startDate, days, transactions = []) {
  const data = [];
  const start = new Date(startDate);
  
  for (let i = 0; i <= days; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const currentDateStr = currentDate.toISOString().split('T')[0];
    
    // Calculate base amount from initial investment
    const baseAmount = calculateCompoundInterest(initialAmount, annualRate, i);
    
    // Calculate contribution from transactions
    let transactionAmount = 0;
    const transactionsOnThisDay = [];
    
    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      if (txDate <= currentDate) {
        // Calculate days this transaction has been growing
        const daysGrowing = Math.floor((currentDate - txDate) / (1000 * 60 * 60 * 24));
        const txValue = calculateCompoundInterest(tx.amount, annualRate, daysGrowing);
        
        if (tx.type === 'addition') {
          transactionAmount += txValue;
        } else if (tx.type === 'withdrawal') {
          transactionAmount -= txValue;
        }
        
        // Mark if transaction happened on this exact day
        if (tx.date === currentDateStr) {
          transactionsOnThisDay.push(tx);
        }
      }
    });
    
    const totalAmount = baseAmount + transactionAmount;
    
    data.push({
      date: currentDateStr,
      amount: totalAmount,
      day: i,
      displayDate: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hasTransaction: transactionsOnThisDay.length > 0,
      transactions: transactionsOnThisDay
    });
  }
  
  return data;
}

/**
 * Get the number of days for a given time range
 */
export function getDaysForRange(range) {
  const ranges = {
    '1M': 30,
    '6M': 180,
    '1Y': 365,
    '5Y': 365 * 5
  };
  
  return ranges[range] || 365;
}

/**
 * Calculate the current value based on days elapsed since start date
 * @param {number} initialAmount - Starting amount
 * @param {number} annualRate - Annual interest rate as percentage
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Current total value
 */
export function getCurrentValue(initialAmount, annualRate, startDate, transactions = []) {
  const start = new Date(startDate);
  const now = new Date();
  const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  
  // Calculate base amount
  const baseAmount = calculateCompoundInterest(initialAmount, annualRate, daysPassed);
  
  // Calculate contribution from transactions
  let transactionAmount = 0;
  transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    if (txDate <= now) {
      const daysGrowing = Math.floor((now - txDate) / (1000 * 60 * 60 * 24));
      const txValue = calculateCompoundInterest(tx.amount, annualRate, daysGrowing);
      
      if (tx.type === 'addition') {
        transactionAmount += txValue;
      } else if (tx.type === 'withdrawal') {
        transactionAmount -= txValue;
      }
    }
  });
  
  return baseAmount + transactionAmount;
}

/**
 * Format number as currency
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
