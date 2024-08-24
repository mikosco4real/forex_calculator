import React, { useState } from 'react';
import Select from 'react-select';
import './../assets/css/PointsCalculator.css';

const instrumentOptions = [
  { value: 'XAUUSD', label: 'XAUUSD' },
  { value: 'GBPJPY', label: 'GBPJPY' },
  { value: 'GBPUSD', label: 'GBPUSD' },
  { value: 'USDJPY', label: 'USDJPY' },
  // Add more instruments here
];

const PointsCalculatorForm = () => {
  const [instrument, setInstrument] = useState(instrumentOptions[0]);
  const [accountSize, setAccountSize] = useState('');
  const [depositCurrency, setDepositCurrency] = useState('USD');
  const [entryPoint, setEntryPoint] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [risk, setRisk] = useState('');
  const [riskType, setRiskType] = useState('%');
  const [lotSize, setLotSize] = useState('');
  const [riskAmount, setRiskAmount] = useState('');
  const [profitAmount, setProfitAmount] = useState('');

  const calculatePipValue = (pair) => {
    let pipValue = 0;
    const lotSize = 100000; // standard lot size for forex pairs

    switch (pair) {
      case 'XAUUSD':
        pipValue = (1 / 10) * lotSize / 100; // For 1 lot size in USD
        break;
      case 'GBPJPY':
      case 'USDJPY':
        pipValue = (1 / 10) * lotSize / 100; // JPY pairs have a pip value of 0.01
        break;
      case 'GBPUSD':
      case 'EURUSD':
        pipValue = (1 / 10) * lotSize / 100; // For USD quote currency pairs
        break;
      default:
        pipValue = (1 / 10) * lotSize / 100; // Default pip value for other major pairs with USD as the quote currency
    }

    return pipValue;
  };

  const handleCalculate = () => {
    const parsedStopLoss = parseFloat(stopLoss);
    const parsedTakeProfit = parseFloat(takeProfit);
    const parsedEntrypoint = parseFloat(entryPoint);
    const parsedRisk = parseFloat(risk);
    const pipValue = calculatePipValue(instrument.value);

    if (isNaN(parsedStopLoss) || isNaN(parsedEntrypoint) || isNaN(parsedRisk) || parsedStopLoss === 0) {
      alert("Please provide valid inputs for Stop Loss, Take Profit, and Risk.");
      return;
    }

    const stopLossPips = ((parsedEntrypoint - parsedStopLoss) * pipValue).toFixed(2);
    const takeProfitPips = ((parsedTakeProfit - parsedEntrypoint) * pipValue).toFixed(2);

    const riskAmountCalc = riskType === '%' ? (accountSize * (parsedRisk / 100)) : parsedRisk;
    const calculatedLotSize = (riskAmountCalc / stopLossPips).toFixed(2);
    const calculatedRiskAmount = (calculatedLotSize * stopLossPips).toFixed(2);
    const profitAmountCalc = (takeProfitPips * calculatedLotSize).toFixed(2);

    setLotSize(calculatedLotSize);
    setRiskAmount(calculatedRiskAmount);
    setProfitAmount(profitAmountCalc);
  };

  return (
    <div className="trade-calculator">
      <h2>Forex Trade Calculator</h2>
      <div className="form-group">
        <label htmlFor="instrument">Instrument:</label>
        <Select
          id="instrument"
          value={instrument}
          onChange={(selectedOption) => setInstrument(selectedOption)}
          options={instrumentOptions}
          className="instrument-select"
        />
      </div>
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
        <label htmlFor="depositCurrency">Deposit Currency:</label>
        <select
          id="depositCurrency"
          value={depositCurrency}
          onChange={(e) => setDepositCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          {/* Add other currencies as needed */}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="entryPoint">Entry Point:</label>
        <input
          type="text"
          id="entryPoint"
          value={entryPoint}
          onChange={(e) => setEntryPoint(e.target.value)}
          placeholder="Enter entry point"
        />
      </div>
      <div className="form-group">
        <label htmlFor="takeProfit">Take Profit:</label>
        <input
          type="text"
          id="takeProfit"
          value={takeProfit}
          onChange={(e) => setTakeProfit(e.target.value)}
          placeholder="Enter take profit"
        />
      </div>
      <div className="form-group">
        <label htmlFor="stopLoss">Stop Loss:</label>
        <input
          type="text"
          id="stopLoss"
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
          placeholder="Enter stop loss"
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
            placeholder="Enter risk amount"
          />
          <select
            id="riskType"
            value={riskType}
            onChange={(e) => setRiskType(e.target.value)}
            className="risk-type-select"
          >
            <option value="%">%</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>
      <button onClick={handleCalculate}>Calculate</button>

      {lotSize && riskAmount && profitAmount && (
        <div className="result">
          <div className="result-field">
            <h3>Lot Size:</h3>
            <p>{lotSize}</p>
          </div>
          <div className="result-field">
            <h3>Risk Amount:</h3>
            <p>{riskAmount}</p>
          </div>
          <div className="result-field">
            <h3>Profit Amount:</h3>
            <p>{profitAmount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsCalculatorForm;
