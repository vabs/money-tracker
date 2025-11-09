import { HashRouter, Routes, Route } from 'react-router-dom';
import { TransactionProvider } from './contexts/TransactionContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import Home from './pages/Home';
import ManageMoney from './pages/ManageMoney';

function App() {
  return (
    <ThemeProvider>
      <TransactionProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manage" element={<ManageMoney />} />
          </Routes>
        </HashRouter>
      </TransactionProvider>
    </ThemeProvider>
  );
}

export default App;
