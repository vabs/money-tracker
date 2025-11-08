# 💰 Money Growth Tracker

A beautiful, minimal web app that visualizes how money grows over time using compound interest. Built with React and Vite, designed to be deployed on GitHub Pages.

## ✨ Features

- **Big Number Display**: Shows your current money value with the interest rate
- **Interactive Growth Chart**: Visualize your money growth over different time periods (1M, 6M, 1Y, 5Y)
- **Add/Withdraw Money**: Track additional contributions and withdrawals with compound growth
- **Transaction History**: View and manage all your money transactions
- **Transaction Markers**: See visual indicators on the chart where transactions occurred
- **6 Pastel Themes**: Switch between beautiful pastel color themes with icon-based selection
- **Export/Import**: Download your transaction data and sync across deployments
- **localStorage Persistence**: Your changes persist across browser sessions
- **Configurable**: Set initial amount, interest rate, and start date via configuration file
- **Static & Fast**: No backend required, perfect for GitHub Pages
- **Responsive**: Works beautifully on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd money-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## ⚙️ Configuration

The app can be configured using environment variables. Create a `.env` file in the root directory:

```env
# Initial amount in dollars
VITE_INITIAL_AMOUNT=1000

# Annual interest rate as a percentage
VITE_ANNUAL_INTEREST_RATE=7

# Start date in YYYY-MM-DD format
VITE_START_DATE=2024-01-01

# Base path for GitHub Pages (only needed if deploying to a subdirectory)
VITE_BASE_PATH=/
```

### Default Values

If no `.env` file is provided, the app uses these defaults:
- **Initial Amount**: $1,000
- **Annual Interest Rate**: 7%
- **Start Date**: 1 year ago from today

## 📦 Building for Production

Build the app for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

Preview the production build locally:

```bash
npm run preview
```

## 🔍 Code Quality

The project includes a pre-commit hook that automatically runs ESLint on staged files before each commit. This ensures code quality and consistency.

**Manual linting:**
```bash
npm run lint
```

The pre-commit hook is powered by:
- **Husky**: Git hooks made easy
- **lint-staged**: Run linters on staged files only

## 💵 Managing Transactions

### Adding Money or Withdrawals

1. Click the 💰 button in the bottom-right corner
2. Choose "Add Money" or "Withdraw"
3. Enter amount (or use quick-add buttons: $5, $10, $20, $50, $100)
4. Select the date (can be in the past)
5. Optionally add a note
6. Click "Add Transaction"

### How It Works

- **Compound Growth**: Each transaction grows with compound interest from its date
- **localStorage**: Transactions are saved locally in your browser
- **Visual Markers**: Dots appear on the chart where transactions occurred
- **Real-time Updates**: The main display updates immediately

### Syncing Across Devices

Since there's no backend, use this workflow to sync your data:

1. **Export**: Click "Export" button on the Manage Money page
2. **Save**: Download `transactions.json` file
3. **Update Repo**: Replace `public/transactions.json` in your repository
4. **Commit & Push**:
   ```bash
   git add public/transactions.json
   git commit -m "Update transactions"
   git push
   ```
5. **Redeploy**: Run `npm run deploy`
6. **Done**: Your transactions are now in the deployed version

### Data Structure

The `public/transactions.json` file contains:

```json
{
  "config": {
    "initialAmount": 5000,
    "annualInterestRate": 8.5,
    "startDate": "2024-01-01"
  },
  "transactions": [
    {
      "id": "uuid",
      "date": "2024-06-15",
      "amount": 100,
      "type": "addition",
      "note": "Birthday gift"
    }
  ],
  "version": "1.0.0",
  "lastModified": "2024-11-08T10:00:00Z"
}
```

## 🌐 Deploying to GitHub Pages

### Option 1: Using the Deploy Script

1. Make sure your repository is initialized and pushed to GitHub
2. Run the deploy command:

```bash
npm run deploy
```

This will build your app and push it to the `gh-pages` branch.

### Option 2: Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_INITIAL_AMOUNT: 1000
          VITE_ANNUAL_INTEREST_RATE: 7
          VITE_START_DATE: 2024-01-01
          VITE_BASE_PATH: /money-tracker
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Setting the Base Path

If deploying to `username.github.io/repository-name`, set the base path:

```env
VITE_BASE_PATH=/repository-name
```

For custom domains or `username.github.io`, use:

```env
VITE_BASE_PATH=/
```

## 🎨 Customization

### Changing Themes

The app includes 6 pastel themes with icon-based selection. You can add more themes by editing `src/themes.js`:

```javascript
export const themes = {
  yourTheme: {
    name: 'Your Theme',
    icon: '🎨',  // Emoji icon for the theme selector
    background: '#f0fdf4',
    text: '#14532d',
    accent: '#86efac',
    graphLine: '#4ade80',
    graphFill: '#bbf7d0'
  },
  // ... other themes
};
```

Each theme includes:
- **name**: Display name (shown in tooltip)
- **icon**: Emoji icon for the theme selector button
- **background**: Page background color
- **text**: Primary text color
- **accent**: Accent color for buttons and highlights
- **graphLine**: Line/stroke color for the chart
- **graphFill**: Fill color for the chart (not currently used with gradient)

### Modifying Calculation Logic

The compound interest calculation is in `src/utils/calculations.js`. The formula used is:

```
A = P(1 + r/n)^(nt)
```

Where:
- P = principal (initial amount)
- r = annual interest rate (as decimal)
- n = number of times interest is compounded per year (365 for daily)
- t = time in years

## 📁 Project Structure

```
money-tracker/
├── public/
│   └── transactions.json       # Baseline transaction data (committed)
├── src/
│   ├── components/
│   │   ├── MoneyDisplay.jsx    # Main number display
│   │   ├── GrowthChart.jsx     # Chart with transaction markers
│   │   └── ThemeSelector.jsx   # Icon-based theme switcher
│   ├── contexts/
│   │   └── TransactionContext.jsx  # Transaction state management
│   ├── pages/
│   │   ├── Home.jsx            # Main dashboard page
│   │   └── ManageMoney.jsx     # Add/withdraw transactions page
│   ├── utils/
│   │   ├── calculations.js     # Compound interest with transactions
│   │   └── storage.js          # localStorage & export/import
│   ├── config.js               # App configuration (deprecated, use transactions.json)
│   ├── themes.js               # Theme definitions with icons
│   ├── App.jsx                 # Router setup
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── .env.example                # Example environment variables
├── .husky/                     # Git hooks
│   └── pre-commit              # Lint staged files
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies and scripts
```

## 🤝 Contributing

This is an open-source project! Feel free to:
- Fork the repository
- Create your own version with different configurations
- Submit pull requests with improvements
- Report issues or suggest features

## 📄 License

MIT License - feel free to use this project for any purpose!

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Vite](https://vitejs.dev/)
- Charts by [Recharts](https://recharts.org/)
- Deployed on [GitHub Pages](https://pages.github.com/)

---

Made with ❤️ for tracking money growth
