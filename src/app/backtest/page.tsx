"use client"
import React, { useState } from 'react';
import axios from 'axios';

interface BacktestResult {
  // Define the structure of the backtest result based on your backend response
  [key: string]: any;
}

const BacktestForm: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [strategy, setStrategy] = useState<string>('moving_sma');
  const [results, setResults] = useState<BacktestResult | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/strategies', {
        symbol,
        startDate,
        endDate,
        strategy
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error running backtest:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Stock Symbol"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
        <option value="moving_sma">Moving SMA</option>
        {/* Add more strategies here */}
      </select>
      <button type="submit">Run Backtest</button>
      {results && <div>Results: {JSON.stringify(results)}</div>}
    </form>
  );
};

export default BacktestForm;
