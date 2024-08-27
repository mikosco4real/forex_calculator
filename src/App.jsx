import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import TicksCalculator from './pages/TicksCalculator';
import PointsCalculator from './pages/PointsCalculator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<PointsCalculator />} />
          <Route path="risk-ticks" element={<TicksCalculator />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
