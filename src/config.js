// Configuration for the money tracker app
// These values can be overridden via environment variables during build

export const config = {
  // Initial amount in dollars
  initialAmount: parseFloat(import.meta.env.VITE_INITIAL_AMOUNT) || 1000,
  
  // Annual interest rate as a percentage (e.g., 7 for 7%)
  annualInterestRate: parseFloat(import.meta.env.VITE_ANNUAL_INTEREST_RATE) || 7,
  
  // Start date in YYYY-MM-DD format
  startDate: import.meta.env.VITE_START_DATE || new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
};
