import React, { useState } from 'react';
import Select from 'react-select';
import './../assets/css/PointsCalculator.css';

const GOLD = 'XAUUSD'
const pairs = new Set([GOLD, 'EURUSD','GBPUSD','USDJPY','USDCHF','AUDUSD','USDCAD','NZDUSD','EURGBP','EURJPY','EURCHF','GBPJPY','GBPCHF','AUDJPY','AUDGBP','AUDCHF','NZDJPY','NZDGBP','NZDCHF','EURAUD','EURCAD','EURNZD','GBPAUD','GBPCAD','GBPNZD','CHFJPY','CADJPY','AUDCAD','AUDNZD','CADCHF','CHFGBP','CHFNZD','NZDCAD','EURSGD','EURHKD','EURTRY','GBPSGD','GBPHKD','GBPTRY','AUDSGD','AUDHKD','AUDTRY','NZDSGD','NZDHKD','NZDTRY','CHFSEK','CHFZAR','USDTRY','USDZAR','USDHKD','USDSGD','USDMXN','USDINR','USDBRL','USDCNH','USDNOK','USDSEK','USDPLN','USDDKK','USDHUF','USDILS','USDPHP','USDTHB','USDMYR','USDIDR','USDCZK','USDRUB','USDKZT','USDQAR','USDKWD','USDBHD','USDOMR','USDMAD','USDSAR','XAUUSD','XAGUSD','USDCLP','USDVND','USDNGN', 'US30USD'])

let instrumentOptions = [];

for (const p of pairs) {
  instrumentOptions.push({value: p, label: p})
}

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
  const [error, setError] = useState('');

  const getCurrentRate = async (baseCurrency, quoteCurrency) => {
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/e9fa0188eb316eddee4b9f2c/latest/${baseCurrency}`);
      if (!response.ok) {
        throw new Error(`Error fetching exchange rate for ${baseCurrency}/${quoteCurrency}`);
      }
      const data = await response.json();
      return data.conversion_rates[quoteCurrency] || 1;
    } catch (err) {
      setError(`Error fetching exchange rate: ${err.message}`);
      return 1;
    }
  };

  const handleCalculate = async () => {
    // Validate inputs
    setError('');
    const parsedEntrypoint = parseFloat(entryPoint);
    const parsedStopLoss = parseFloat(stopLoss);
    const parsedTakeProfit = parseFloat(takeProfit);
    const parsedRisk = parseFloat(risk)

    if (isNaN(parsedRisk) || isNaN(parsedEntrypoint) || isNaN(parsedStopLoss) || parsedStopLoss === 0) {
      setError("All required fields must be filled");
      return
    }

    // Calculate risk amount
    const riskAmountCalc = riskType === '%' ? (accountSize * (parsedRisk / 100)) : parsedRisk;
    
    // Calculate stop loss distance
    const stopLossDistance = Math.abs(parsedEntrypoint - parsedStopLoss)
    const takeProfitDistance = Math.abs(parsedEntrypoint - parsedTakeProfit)

    // Determine pip value
    let pipValue = instrument.value.includes('JPY') || instrument.value.includes('XAU') ? 0.01: 0.0001;
    if (instrument.value.includes('US30')) {
      pipValue = 0.01;
    }
    const stopLossPips = stopLossDistance / pipValue
    const takeProfitPips = takeProfitDistance / pipValue

    // extract baseCurrency and quoteCurrency
    const baseCurrency = instrument.value.substring(0, 3)
    const quoteCurrency = instrument.value.substring(3,)

    // Trade size is usually 100000
    // Consider rewriting to consider cases for XAUAUD, XAUGBP, US30GBP etc.
    let TradeSize = 0;
    switch (instrument.value) {
      case GOLD:
      TradeSize = 100
      break
      case 'US30USD':
      TradeSize = 10
      break
      default:
      TradeSize = 100000
  }

    // Calculate pipValue in account currency
    let pipValuePerLot;
    if (depositCurrency === baseCurrency) { // eg: Given USD as deposit currency - USDCAD, USDJPY, USDCHF
      pipValuePerLot = (pipValue / parsedEntrypoint) * TradeSize
    } else if (depositCurrency === quoteCurrency) { // eg: Given USD as deposit currency - GBPUSD, EURUSD, NZDUSD, XAUUSD
      pipValuePerLot = pipValue * TradeSize
    } else { // eg: Given USD as deposit currency - GBPJPY, GBPCAD, EURCHF
      const crossPairPrice = await getCurrentRate(depositCurrency, quoteCurrency)
      pipValuePerLot = (pipValue  * TradeSize) / crossPairPrice
    }

    // Calculate Lot size 
    const lotSizeCalc = riskAmountCalc / (stopLossPips * pipValuePerLot);
    
    // Update lotsize, riskAmount, profitAmount 
    setLotSize((lotSizeCalc).toFixed(2))
    setRiskAmount((lotSizeCalc * stopLossPips * pipValuePerLot).toFixed(2))
    setProfitAmount((lotSizeCalc * takeProfitPips * pipValuePerLot).toFixed(2))
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
          className="deposit-currency-select"
        >
          <option value="USD">USD</option>
          <option value="AUD">AUD</option>
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

      {error && (
        <div className="error-message">
          <h5>Error</h5>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default PointsCalculatorForm;
