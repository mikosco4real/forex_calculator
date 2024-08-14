import React, { useState } from 'react';

const CalculatorForm = () => {
  const [accountSize, setAccountSize] = useState('');
  const [stopLossTicks, setStopLossTicks] = useState('');
  const [risk, setRisk] = useState('');
  const [riskType, setRiskType] = useState('%');
  const [result, setResult] = useState('');

  const totalRisk = () => {
    const parsedRisk = parseFloat(risk);
    const parsedAccountSize = parseFloat(accountSize);

    if (isNaN(parsedRisk) || isNaN(parsedAccountSize)) {
      return 0; // Return 0 or any default value if inputs are invalid
    }

    if (riskType === '%') {
      return parsedAccountSize * (parsedRisk / 100);
    }

    return parsedRisk;
  };

  const handleCalculate = () => {
    const parsedStopLossTicks = parseFloat(stopLossTicks);
    const risk = totalRisk();

    if (isNaN(parsedStopLossTicks) || parsedStopLossTicks === 0) {
      setResult("Invalid stop loss ticks"); // Handle invalid input
      return;
    }

    const calculatedResult = (risk / parsedStopLossTicks).toFixed(2);
    setResult(calculatedResult);
  };

  return (
    <div className="calculator-form">
      <h2>Risk Calculator</h2>
      <div className="form-group">
        <label htmlFor="accountSize">Account Size:</label>
        <input
          type="text"
          id="accountSize"
          value={accountSize}
          onChange={(e) => setAccountSize(e.target.value)}
          placeholder="Enter account size"
        />
      </div>
      <div className="form-group">
        <label htmlFor="stopLossTicks">Stop Loss Ticks:</label>
        <input
          type="text"
          id="stopLossTicks"
          value={stopLossTicks}
          onChange={(e) => setStopLossTicks(e.target.value)}
          placeholder="Enter stop loss ticks"
        />
      </div>
      <div className="form-group">
        <label htmlFor="risk">Risk:</label>
        <div className="risk-group">
          <input
            type="text"
            id="risk"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            placeholder="Enter risk"
          />
          <select
            id="riskType"
            value={riskType}
            onChange={(e) => setRiskType(e.target.value)}
          >
            <option value="%">%</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>
      <button onClick={handleCalculate}>Calculate</button>
      {result && (
        <div className="result">
          <h3>Lot size:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default CalculatorForm;
