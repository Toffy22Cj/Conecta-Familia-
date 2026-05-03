import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import DiagnosticPage from './pages/DiagnosticPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diagnostic" element={<DiagnosticPage />} />
        {/* Placeholder para futuras páginas */}
        <Route path="/simulator" element={<Dashboard />} />
        <Route path="/challenges" element={<Dashboard />} />
        <Route path="/forum" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
