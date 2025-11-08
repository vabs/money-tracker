import { HashRouter, Routes, Route } from 'react-router-dom';
import { TransactionProvider } from './contexts/TransactionContext';
import Home from './pages/Home';
import ManageMoney from './pages/ManageMoney';

function App() {
  return (
    <TransactionProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manage" element={<ManageMoney />} />
        </Routes>
      </HashRouter>
    </TransactionProvider>
  );
}

export default App;
