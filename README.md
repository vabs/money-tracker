# 💰 Money Growth Tracker

An educational web app designed to teach kids about financial literacy, compound interest, and money management. This interactive tool helps children visualize how their money grows over time, understand interest rates, and track their earnings and expenses in a fun, engaging way.

## ✨ Features

### Educational Benefits
- **Learn Compound Interest**: Kids see firsthand how money grows over time with interest
- **Track Earnings & Expenses**: Record allowances, chores, gifts, and purchases
- **Visual Learning**: Interactive charts make financial concepts easy to understand
- **Goal Setting**: Watch progress toward savings goals with real-time calculations
- **Financial Responsibility**: Teaches the value of saving and smart spending

### App Features
- **Multi-Profile Support**: Track money for multiple kids in one app
- **Profile Management**: Each child gets their own profile with custom emoji and color
- **Big Number Display**: Shows current balance with the interest rate
- **Interactive Growth Chart**: Visualize money growth over different time periods (1M, 6M, 1Y, 5Y)
- **Add/Withdraw Money**: Track allowances, earnings, and spending with compound growth
- **Transaction History**: View and manage all money transactions with notes
- **Transaction Markers**: See visual indicators on the chart where transactions occurred
- **6 Pastel Themes**: Kid-friendly color themes with icon-based selection
- **Export/Import**: Download transaction data and sync across devices
- **localStorage Persistence**: All changes persist across browser sessions
- **Independent Configurations**: Each child has their own initial amount, interest rate, and start date
- **Static & Fast**: No backend required, perfect for GitHub Pages
- **Responsive**: Works beautifully on desktop, tablet, and mobile

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

### Profile-Based Configuration (Recommended)

With v2.0.0, each profile has its own configuration. Edit `public/transactions.json` to set up your profiles with different initial amounts, interest rates, and start dates.

### Environment Variables (Optional)

You can still use environment variables for deployment settings:

```env
# Base path for GitHub Pages (only needed if deploying to a subdirectory)
VITE_BASE_PATH=/
```

### Default Values

If no `transactions.json` file is found, the app creates a default profile:
- **Name**: "Default"
- **Emoji**: 👤
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

## 👥 Managing Profiles

### Creating Profiles

1. Click on the profile selector in the top-left corner
2. Click "Manage Profiles" at the bottom of the dropdown
3. Click "➕ Add New Profile"
4. Configure the profile:
   - **Name**: Enter the person's name (e.g., "Alex", "Emma")
   - **Emoji**: Choose from 12 emoji options for visual identification
   - **Initial Amount**: Starting balance in dollars
   - **Annual Interest Rate**: Interest rate as a percentage
   - **Start Date**: When the money tracking begins
5. Click "Add Profile"

### Switching Between Profiles

1. Click the profile selector in the top-left corner (shows current profile)
2. Select any profile from the dropdown
3. All data (balance, transactions, chart) updates instantly

### Editing Profiles

1. Open Profile Manager (click profile selector → "Manage Profiles")
2. Click "Edit" on any profile card
3. Modify name, emoji, or configuration
4. Click "Update Profile"

### Deleting Profiles

1. Open Profile Manager
2. Click "Delete" on the profile you want to remove
3. Confirm deletion (note: you cannot delete the last profile)

### Profile Features

- **Independent Data**: Each profile has separate transactions and configuration
- **Visual Identity**: Emojis and colors help distinguish profiles quickly
- **Profile Stats**: See balance and transaction count for each profile
- **Active Indicator**: Current profile is highlighted with a checkmark
- **Persistent Selection**: Your active profile is remembered across sessions

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

### Exporting Data

You can export your data in two ways:

1. **Current Profile Only**: Click "Export" on the Manage Money page
   - Downloads: `money-tracker-[profile-name].json`
   - Contains: Only the selected profile's data

2. **All Profiles**: Export from Profile Manager
   - Downloads: `money-tracker-data.json`
   - Contains: All profiles and their transactions

### Syncing Across Devices

Since there's no backend, use this workflow to sync your data:

1. **Export**: Click "Export" button (current profile or all profiles)
2. **Save**: Download the JSON file
3. **Update Repo**: Replace `public/transactions.json` in your repository
4. **Commit & Push**:
   ```bash
   git add public/transactions.json
   git commit -m "Update transactions"
   git push
   ```
5. **Redeploy**: Run `npm run deploy`
6. **Done**: Your data is now in the deployed version

### Data Structure (v2.0.0)

The `public/transactions.json` file now uses a multi-profile structure:

```json
{
  "version": "2.0.0",
  "profiles": {
    "profile-id-1": {
      "id": "profile-id-1",
      "name": "Alex",
      "emoji": "👦",
      "color": "#4ade80",
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
          "note": "Birthday gift",
          "createdAt": "2024-06-15T10:00:00Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z",
      "lastModified": "2024-06-15T10:00:00Z"
    },
    "profile-id-2": {
      "id": "profile-id-2",
      "name": "Emma",
      "emoji": "👧",
      "color": "#f472b6",
      "config": {
        "initialAmount": 3000,
        "annualInterestRate": 7.5,
        "startDate": "2024-02-01"
      },
      "transactions": [],
      "createdAt": "2024-02-01T00:00:00Z",
      "lastModified": "2024-02-01T00:00:00Z"
    }
  },
  "activeProfileId": "profile-id-1",
  "lastModified": "2024-11-08T10:00:00Z"
}
```

**Key Changes from v1.0.0:**
- Profiles are stored in a `profiles` object keyed by profile ID
- Each profile has its own `config` and `transactions`
- `activeProfileId` tracks which profile is currently selected
- Each profile has visual identifiers: `name`, `emoji`, `color`

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
│   └── transactions.json       # Baseline data with profiles (v2.0.0)
├── src/
│   ├── components/
│   │   ├── MoneyDisplay.jsx    # Main number display
│   │   ├── GrowthChart.jsx     # Chart with transaction markers
│   │   ├── ThemeSelector.jsx   # Icon-based theme switcher
│   │   ├── ProfileSelector.jsx # Profile dropdown switcher
│   │   └── ProfileManager.jsx  # Profile management modal
│   ├── contexts/
│   │   ├── TransactionContext.jsx  # Multi-profile state management
│   │   └── transactionContext.js   # Context definition
│   ├── hooks/
│   │   └── useTransactions.js  # Hook to access transaction context
│   ├── pages/
│   │   ├── Home.jsx            # Main dashboard page
│   │   └── ManageMoney.jsx     # Add/withdraw transactions page
│   ├── utils/
│   │   ├── calculations.js     # Compound interest with transactions
│   │   └── storage.js          # localStorage, export/import, profiles
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
