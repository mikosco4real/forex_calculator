import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './../assets/css/AppLayout.css';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <h2>Forex Calculator</h2>
        <ul>
          <li>
            <Link to="/risk-ticks">Lot Size with ticks</Link>
          </li>
          <li>
            <Link to="/stoploss-points">Lot Size with price</Link>
          </li>
        </ul>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
